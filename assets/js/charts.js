/* ============================================================
 * 云酿智链 AI OS —— 轻量级图表组件（纯SVG/Canvas，无依赖）
 * ============================================================ */
const Charts = {

  /* ---------- 柱状图 ---------- */
  revenueBars(data) {
    const w = 420, h = 180, pad = { t: 20, r: 16, b: 28, l: 44 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    const maxV = Math.max(...data.map(d => Math.max(d.rev, d.profit))) * 1.15;
    const barW = cw / data.length * 0.32;
    const gap = cw / data.length;

    const bars = data.map((d, i) => {
      const x = pad.l + gap * i + gap * 0.18;
      const revH = d.rev / maxV * ch;
      const profitH = d.profit / maxV * ch;
      const revY = pad.t + ch - revH;
      const profitY = pad.t + ch - profitH;
      return `
        <rect x="${x}" y="${revY}" width="${barW}" height="${revH}" rx="3"
          fill="url(#gradGold)" class="bar-anim" style="animation-delay:${i * 0.1}s">
          <title>营收 ${d.rev}万</title>
        </rect>
        <rect x="${x + barW + 4}" y="${profitY}" width="${barW}" height="${profitH}" rx="3"
          fill="url(#gradCyan)" class="bar-anim" style="animation-delay:${i * 0.1 + 0.15}s">
          <title>净利 ${d.profit}万</title>
        </rect>
        <text x="${x + barW + 2}" y="${pad.t + ch + 16}" text-anchor="middle"
          fill="#6B7386" font-size="11" font-family="var(--mono)">${d.y}</text>`;
    }).join('');

    // Y轴刻度
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map(r => {
      const y = pad.t + ch - ch * r;
      const val = Math.round(maxV * r);
      return `
        <line x1="${pad.l - 6}" y1="${y}" x2="${pad.l}" y2="${y}" stroke="rgba(255,255,255,.08)"/>
        <text x="${pad.l - 10}" y="${y + 4}" text-anchor="end" fill="#6B7386" font-size="10" font-family="var(--mono)">${val}</text>`;
    }).join('');

    return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" style="max-width:${w}px">
      <defs>
        <linearGradient id="gradGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E8C476"/>
          <stop offset="100%" stop-color="#9A6B2A"/>
        </linearGradient>
        <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#5BE0D8"/>
          <stop offset="100%" stop-color="#2A8B84"/>
        </linearGradient>
      </defs>
      ${yTicks}
      ${bars}
      <style>
        .bar-anim{opacity:0;animation:barIn .8s cubic-bezier(.2,.8,.2,1) forwards;transform-origin:bottom;transform:scaleY(0)}
        @keyframes barIn{to{opacity:1;transform:scaleY(1)}}
      </style>
    </svg>`;
  },

  /* ---------- 环形图 ---------- */
  donut(data) {
    const size = 140, r = 52, cx = size / 2, cy = size / 2;
    const total = data.reduce((a, d) => a + d.pct, 0);
    let startAngle = -Math.PI / 2;
    const colors = ['#D8A94E', '#5BE0D8', '#A78BFA', '#5BC98A'];

    const arcs = data.map((d, i) => {
      const angle = (d.pct / total) * Math.PI * 2;
      const endAngle = startAngle + angle;
      const largeArc = angle > Math.PI ? 1 : 0;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      startAngle = endAngle;
      return `<path d="${path}" fill="${colors[i % colors.length]}" opacity=".85" class="donut-slice"
        style="animation:donutIn .8s cubic-bezier(.2,.8,.2,1) ${i * 0.1}s both;transform-origin:${cx}px ${cy}px">
        <title>${d.name} ${Math.round(d.pct * 100)}%</title>
      </path>`;
    }).join('');

    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${cx}" cy="${cy}" r="${r - 1}" fill="var(--bg2)"/>
      ${arcs}
      <circle cx="${cx}" cy="${cy}" r="32" fill="var(--panel)"/>
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="#E9E4D8" font-size="16" font-weight="700" font-family="var(--mono)">${data.length}层</text>
      <text x="${cx}" y="${cy + 12}" text-anchor="middle" fill="#6B7386" font-size="10">用户分层</text>
      <style>
        .donut-slice{opacity:0;transform:scale(.6)}
        @keyframes donutIn{to{opacity:.85;transform:scale(1)}}
      </style>
    </svg>`;
  },

  /* ---------- 三组对比柱 ---------- */
  trioBars(vals) {
    const max = Math.max(...vals);
    const bars = vals.map((v, i) => {
      const w = (v / max) * 100;
      const colors = ['#6B7386', '#A78BFA', '#D8A94E'];
      return `<div style="background:${colors[i]};width:${w}%;height:8px;border-radius:4px;
        animation:barW .6s cubic-bezier(.2,.8,.2,1) ${i * 0.1}s both;transform-origin:left"></div>`;
    }).join('');
    return `<div style="display:flex;flex-direction:column;gap:4px">${bars}</div>
      <style>@keyframes barW{from{transform:scaleX(0)}to{transform:scaleX(1)}}</style>`;
  },

  /* ---------- 投放漏斗 ---------- */
  funnel(data) {
    const max = data[0].val;
    return data.map((d, i) => {
      const w = (d.val / max) * 100;
      return `
        <div class="funnel-stage">
          <div class="fs-label">${d.label}</div>
          <div class="fs-bar"><div class="fs-bar-fill" data-w="${w}%"></div></div>
          <div class="fs-val">${d.val.toLocaleString()} ${d.unit || ''}</div>
        </div>`;
    }).join('');
  },
};
