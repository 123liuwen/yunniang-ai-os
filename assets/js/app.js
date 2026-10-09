/* 云酿智链 AI OS —— 主控台应用逻辑 */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const state = {
  currentView: 'dashboard',
  agentTab: 'select',
  running: false,
  adPlatforms: ['douyin', 'wechat', 'xiaohongshu'],
  contentType: 'live',
  contentSku: 'SK002',
  onboardStep: 1,
};

/* ================= 导航 ================= */
const NAV = [
  { group: '工作台' },
  { id: 'dashboard', t: '总览驾驶舱', ico: '⌂' },
  { group: 'AI Agent' },
  { id: 'select', t: '选品决策 Agent', ico: '◈', badge: '首推', gold: true },
  { id: 'private', t: '私域经营 Agent', ico: '♟' },
  { id: 'ad', t: '智能投放 Agent', ico: '◔' },
  { id: 'content', t: '内容生成 Agent', ico: '✎' },
  { group: '系统' },
  { id: 'config', t: '企业配置中心', ico: '⚙' },
];

const TITLES = {
  dashboard: ['总览驾驶舱', '实时经营数据 · AI 决策引擎运行中'],
  select: ['选品决策 Agent', '选酒数据决策分析系统 · 3-3-4选品策略 + FABE模型'],
  private: ['私域经营 Agent', '私域用户分层运营智能管理系统 · RFM模型 + 智能触达'],
  ad: ['智能投放 Agent', '数字化内容投放分析系统 · 智能预算分配 + 动态调优'],
  content: ['内容生成 Agent', '电商主播智能陪练管理系统 · 直播话术 + 数字人直播'],
  config: ['企业配置中心', '酒品管理 · 价格配置 · 经营数据'],
};

function renderNav() {
  $('#nav').innerHTML = NAV.map(n => n.group
    ? `<div class="nav-group">${n.group}</div>`
    : `<div class="nav-item" data-id="${n.id}"><span class="ico">${n.ico}</span>${n.t}
        ${n.badge ? `<span class="badge ${n.gold ? 'gold' : ''}">${n.badge}</span>` : ''}</div>`
  ).join('');
  $$('.nav-item').forEach(el => el.onclick = () => navigateTo(el.dataset.id));
}

function navigateTo(id) {
  state.currentView = id;
  state.agentTab = id;
  $$('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.id === id));
  const titles = TITLES[id] || ['', ''];
  $('#viewTitle').textContent = titles[0];
  $('#viewSub').textContent = titles[1];
  $('#view').innerHTML = `<div class="page">${Views[id]()}</div>`;
  $('#view').scrollTop = 0;
  Binds[id] && Binds[id]();
}

/* ================= 视图 ================= */
const Views = {};

/* ---------- 总览驾驶舱 ---------- */
Views.dashboard = () => `
  <div class="hero">
    <div class="hero-content">
      <h1>欢迎使用 云酿智链 <span class="gold-text">AI OS</span>
        <span class="thin">酒业 AI 经营决策与全链路增长平台</span></h1>
      <div class="pos">
        <span><span class="live-status"><span class="live-dot"></span>AI 引擎运行中</span></span>
        <span>4 大 Agent 在线</span>
        <span>今日决策 28 次</span>
      </div>
      <div class="slogan">${DB.brand.slogan} ${DB.brand.tagline}</div>
      <div class="hero-actions">
        <button class="btn-gold" onclick="navigateTo('select')">▶ 开始 AI 选品</button>
        <button class="btn-ghost" onclick="navigateTo('private')">查看私域运营</button>
      </div>
    </div>
  </div>

  <!-- 四大 Agent 快速入口 -->
  <div class="agent-entries">
    ${DB.agents.map(a => `
      <div class="agent-entry" onclick="navigateTo('${a.id}')">
        <div class="ae-ico">${a.ico}</div>
        <div class="ae-title">${a.name}</div>
        <div class="ae-desc">${a.desc}</div>
        <div class="ae-arrow">立即使用 →</div>
      </div>`).join('')}
  </div>

  <!-- KPI 卡片 -->
  <div class="grid" style="grid-template-columns:repeat(6,1fr);margin-bottom:18px">
    ${DB.kpis.map(k => `
      <div class="panel kpi-card">
        <div class="k-label">${k.label}</div>
        <div class="k-val">${k.val}<em> ${k.unit}</em></div>
        <div class="k-trend ${k.trend}">${k.trend === 'up' ? '↑' : '↓'} ${k.trendVal}</div>
        <div class="k-note">${k.note}</div>
      </div>`).join('')}
  </div>

  <div class="grid overview-grid">
    <!-- 营收趋势 -->
    <div class="panel">
      <div class="panel-title">营收与净利趋势 <span class="sub">近6个月 · 万元</span></div>
      ${Charts.revenueBars(DB.revenueChart)}
      <div class="legend">
        <span><i style="background:#E8C476"></i>营业收入</span>
        <span><i style="background:#5BE0D8"></i>净利润</span>
      </div>
    </div>

    <!-- 最近决策 -->
    <div class="panel">
      <div class="panel-title">AI 最近决策 <span class="sub">实时更新</span></div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${DB.recentDecisions.map(d => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;
            background:var(--bg2);border-radius:8px;border:1px solid var(--line2)">
            <span class="badge ${d.agent === '选品' ? 'gold' : d.agent === '私域' ? 'cyan' : d.agent === '投放' ? 'purple' : 'green'}">${d.agent}</span>
            <span style="flex:1;font-size:12.5px">${d.action}</span>
            <span style="font-size:11px;color:var(--text3)">${d.time}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- 私域用户概览 -->
  <div class="panel mt16">
    <div class="panel-title">私域用户分层概览 <span class="sub">17万+ 私域用户 · RFM模型自动分层</span></div>
    <div style="display:flex;gap:30px;align-items:center">
      <div>${Charts.donut(DB.segments)}</div>
      <div style="flex:1">
        ${DB.segments.map(g => `
          <div class="sku-score" style="grid-template-columns:120px 1fr 100px">
            <div class="nm">${g.name}</div>
            <div class="bar"><i data-w="${g.pct * 100}"></i></div>
            <div class="sc">${g.count.toLocaleString()} 人</div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;

/* ---------- 选品 Agent ---------- */
Views.select = () => {
  const agent = DB.agents.find(a => a.id === 'select');
  return `
  <div class="agent-header">
    <div class="agent-head-left">
      <h2>◈ ${agent.name}</h2>
      <p>${agent.fullName} · ${agent.softReg}<br/>
      三步工作流：目标输入 → 推理决策 → 清单输出；3-3-4选品策略 + FABE销售模型，秒级输出选品决策与理由</p>
    </div>
    <div class="agent-head-right">
      <span class="live-status"><span class="live-dot"></span>引擎就绪</span>
    </div>
  </div>

  <div class="agent-layout">
    <div class="panel">
      <div class="panel-title">经营目标输入 <span class="sub">告诉 Agent 你的需求</span></div>

      <div class="form-row"><label>经营场景</label>
        <div class="chips" id="sceneChips">
          ${DB.selectScenes.map((s, i) => `<div class="chip ${i === 0 ? 'on' : ''}" data-v="${s.id}">${s.name}</div>`).join('')}
        </div></div>

      <div class="form-row"><label>决策目标</label>
        <div class="chips" id="goalChips">
          <div class="chip on" data-g="balance">动销/毛利均衡</div>
          <div class="chip" data-g="margin">毛利优先</div>
          <div class="chip" data-g="clear">清库存优先</div>
        </div></div>

      <div class="form-row"><label>主推款数：<span class="mono gold-text" id="topNLabel">4</span> 款</label>
        <input type="range" id="topN" min="3" max="6" value="4" style="width:100%"></div>

      <div class="form-row"><label>香型偏好</label>
        <div class="chips" id="aromaChips">
          <div class="chip on">不限</div>
          <div class="chip">浓香</div>
          <div class="chip">清香</div>
          <div class="chip">酱香</div>
          <div class="chip">果酒</div>
        </div></div>

      <button class="btn-gold" id="runSelect" style="width:100%">▶ 运行选品 Agent</button>
      <div class="tiny mt8" style="line-height:1.7">
        选品是酒企花钱最快、后悔成本最高的决策。<br/>
        基于五大数据域 + 场景知识库，AI 从需求发起到清单产出，实测秒级完成。
      </div>
    </div>

    <div class="panel console" id="console">
      <div class="console-empty">
        <div class="big">◈</div>
        <div class="hint">输入经营目标，Agent 将完成 检索 → 推理 → 权衡 → 输出 全流程</div>
        <div class="sub">从需求发起到清单产出，实测 4.2 秒 · 比人工快 3000 倍</div>
      </div>
    </div>
  </div>`;
};

/* ---------- 私域 Agent ---------- */
Views.private = () => {
  const agent = DB.agents.find(a => a.id === 'private');
  return `
  <div class="agent-header">
    <div class="agent-head-left">
      <h2>♟ ${agent.name}</h2>
      <p>${agent.fullName} · ${agent.softReg}<br/>
      CRM自动化用户分层 + AI助理接入 + 复购精准触达；17万+私域用户全自动运营，该复购的时候系统替你提醒</p>
    </div>
    <div class="agent-head-right">
      <span class="live-status"><span class="live-dot"></span>172,340 位用户</span>
    </div>
  </div>

  <div class="agent-layout">
    <div class="panel">
      <div class="panel-title">运营目标设置 <span class="sub">选择你要达成的目标</span></div>

      <div class="form-row"><label>运营目标</label>
        <div class="chips" id="pGoalChips">
          ${DB.privateGoals.map((g, i) => `<div class="chip ${i === 0 ? 'on' : ''}" data-v="${g.id}" title="${g.desc}">${g.name}</div>`).join('')}
        </div></div>

      <div class="form-row"><label>目标说明</label>
        <div class="small muted" id="pGoalDesc" style="padding:10px;background:var(--bg2);border-radius:8px;line-height:1.7;border:1px solid var(--line2)">
          ${DB.privateGoals[0].desc}
        </div></div>

      <div class="form-row"><label>触达方式</label>
        <div class="chips">
          <div class="chip on">微信消息</div>
          <div class="chip on">朋友圈</div>
          <div class="chip">短信</div>
          <div class="chip">企业微信</div>
        </div></div>

      <div class="form-row"><label>触达时段</label>
        <select>
          <option>智能推荐（20:00-21:30）</option>
          <option>早间 08:00-10:00</option>
          <option>午间 12:00-14:00</option>
          <option>晚间 18:00-22:00</option>
          <option>全天多时段</option>
        </select></div>

      <button class="btn-gold" id="runPrivate" style="width:100%">▶ 运行私域 Agent</button>
      <div class="tiny mt8" style="line-height:1.7">
        软著支撑：私域用户分层运营智能管理系统<br/>
        私域转化率行业领先，复购率提升 32%
      </div>
    </div>

    <div class="panel console" id="console">
      <div class="console-empty">
        <div class="big">♟</div>
        <div class="hint">Agent 将对私域用户自动分层，生成触达策略与个性化话术</div>
        <div class="sub">该复购的时候，系统替你提醒 · 转化率提升 4.2 倍</div>
      </div>
    </div>
  </div>`;
};

/* ---------- 投放 Agent ---------- */
Views.ad = () => {
  const agent = DB.agents.find(a => a.id === 'ad');
  return `
  <div class="agent-header">
    <div class="agent-head-left">
      <h2>◔ ${agent.name}</h2>
      <p>${agent.fullName} · ${agent.softReg}<br/>
      智能预算分配 + 动态调优 + 高潜场景筛选；基于边际效益+二分搜索算法，ROI 提升至 3.06</p>
    </div>
    <div class="agent-head-right">
      <span class="live-status"><span class="live-dot"></span>ROI 3.06</span>
    </div>
  </div>

  <div class="agent-layout">
    <div class="panel">
      <div class="panel-title">投放设置 <span class="sub">配置你的投放计划</span></div>

      <div class="form-row"><label>投放场景</label>
        <div class="chips" id="adSceneChips">
          ${DB.adScenes.map((s, i) => `<div class="chip ${i === 0 ? 'on' : ''}" data-v="${s.id}">${s.name}</div>`).join('')}
        </div></div>

      <div class="form-row"><label>投放预算：<span class="mono gold-text" id="budgetLabel">50,000</span> 元</label>
        <input type="range" id="adBudget" min="10000" max="200000" step="5000" value="50000" style="width:100%">
        <div style="display:flex;justify-content:space-between;font-size:10.5px;color:var(--text3);margin-top:4px">
          <span>1万</span><span>20万</span>
        </div></div>

      <div class="form-row"><label>投放平台</label>
        <div class="platform-select" id="platformSelect">
          ${DB.platforms.map(p => `
            <div class="platform-item ${state.adPlatforms.includes(p.id) ? 'on' : ''}" data-id="${p.id}">
              <div class="pf-ico">${p.ico}</div>
              <div>
                <div class="pf-name">${p.name}</div>
                <div class="pf-desc">${p.desc} · ROI ${p.avgRoi}</div>
              </div>
            </div>`).join('')}
        </div></div>

      <div class="form-row"><label>优化目标</label>
        <select id="adGoal">
          <option value="roi">ROI 最大化</option>
          <option value="conv">转化量最大化</option>
          <option value="exposure">曝光量最大化</option>
          <option value="newuser">新客获取最大化</option>
        </select></div>

      <button class="btn-gold" id="runAd" style="width:100%">▶ 运行投放 Agent</button>
      <div class="tiny mt8" style="line-height:1.7">
        算法支撑：边际效益分析 + 二分搜索最优分配<br/>
        同预算下 ROI 提升 166%，获客成本下降 62%
      </div>
    </div>

    <div class="panel console" id="console">
      <div class="console-empty">
        <div class="big">◔</div>
        <div class="hint">输入投放目标，Agent 将自动分配预算、优选时段、动态调优</div>
        <div class="sub">投放 ROI 可达 3.06 · 行业平均 1.8 · 提升 70%</div>
      </div>
    </div>
  </div>`;
};

/* ---------- 内容 Agent ---------- */
Views.content = () => {
  const agent = DB.agents.find(a => a.id === 'content');
  return `
  <div class="agent-header">
    <div class="agent-head-left">
      <h2>✎ ${agent.name}</h2>
      <p>${agent.fullName} · ${agent.softReg}<br/>
      直播话术生成 + 图文脚本 + AI数字人直播；7×24小时不间断获客，闲时转化率提升30%</p>
    </div>
    <div class="agent-head-right">
      <span class="live-status"><span class="live-dot"></span>内容生成就绪</span>
    </div>
  </div>

  <div class="agent-layout">
    <div class="panel">
      <div class="panel-title">内容设置 <span class="sub">选择内容类型与产品</span></div>

      <div class="form-row"><label>内容类型</label>
        <div class="content-types" id="contentTypes">
          ${DB.contentTypes.map((t, i) => `
            <div class="content-type ${i === 0 ? 'on' : ''}" data-id="${t.id}">
              <div class="ct-ico">${t.ico}</div>
              <div class="ct-name">${t.name}</div>
              <div class="ct-desc">${t.desc}</div>
            </div>`).join('')}
        </div></div>

      <div class="form-row"><label>选择酒品</label>
        <select id="contentSku">
          ${DB.skus.map(s => `<option value="${s.id}">${s.name}（${s.aroma}）¥${s.price}</option>`).join('')}
        </select></div>

      <div class="form-row"><label>内容风格</label>
        <div class="chips" id="contentStyle">
          <div class="chip on">专业讲解型</div>
          <div class="chip">场景种草型</div>
          <div class="chip">福利促销型</div>
          <div class="chip">对比测评型</div>
        </div></div>

      <div class="form-row"><label>目标平台</label>
        <div class="chips">
          <div class="chip on">抖音</div>
          <div class="chip on">视频号</div>
          <div class="chip">小红书</div>
          <div class="chip">快手</div>
        </div></div>

      <button class="btn-gold" id="runContent" style="width:100%">▶ 生成内容</button>
      <div class="tiny mt8" style="line-height:1.7">
        AI数字人直播 7×24 小时不间断<br/>
        闲时转化率提升 30%，人力成本下降 70%
      </div>
    </div>

    <div class="panel console" id="console">
      <div class="console-empty">
        <div class="big">✎</div>
        <div class="hint">选择内容类型和产品，AI 将自动生成专业内容</div>
        <div class="sub">直播话术 / 短视频脚本 / 图文种草 / 数字人方案</div>
      </div>
    </div>
  </div>`;
};

/* ---------- 配置中心 ---------- */
Views.config = () => `
  <div class="agent-header">
    <div class="agent-head-left">
      <h2>⚙ 企业配置中心</h2>
      <p>管理企业基本信息、酒品档案、价格策略与经营数据，数据越完善，AI 决策越精准</p>
    </div>
  </div>

  <div class="grid" style="grid-template-columns:repeat(2,1fr)">
    <div class="panel">
      <div class="panel-title">企业信息 <span class="sub">基础档案</span></div>
      <div class="form-grid-2">
        <div class="form-row"><label>企业名称</label><input class="form-input" value="山东某某酒业有限公司"/></div>
        <div class="form-row"><label>企业类型</label>
          <select class="form-input"><option>区域酒企</option><option>特色品类酒企</option></select>
        </div>
        <div class="form-row"><label>所在地区</label><input class="form-input" value="山东省临沂市"/></div>
        <div class="form-row"><label>联系人</label><input class="form-input" value="张经理"/></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-title">经营概览 <span class="sub">数据同步状态</span></div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;justify-content:space-between;padding:10px 14px;background:var(--bg2);border-radius:8px">
          <span>酒品 SKU 数</span><span class="mono gold-text">10 款</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px 14px;background:var(--bg2);border-radius:8px">
          <span>私域用户数</span><span class="mono gold-text">172,340 人</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px 14px;background:var(--bg2);border-radius:8px">
          <span>历史订单数</span><span class="mono gold-text">12,480 单</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px 14px;background:var(--bg2);border-radius:8px">
          <span>投放历史</span><span class="mono gold-text">24 个投放组</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px 14px;background:rgba(91,201,138,.1);border-radius:8px;border:1px solid rgba(91,201,138,.2)">
          <span class="green-text">数据同步状态</span><span class="green-text">✓ 已同步</span>
        </div>
      </div>
    </div>

    <div class="panel" style="grid-column:span 2">
      <div class="panel-title">酒品价格管理 <span class="sub">共 10 款酒品</span></div>
      <table class="tbl">
        <thead><tr>
          <th>酒品名称</th><th>香型</th><th>成本价</th><th>售价</th><th>毛利率</th>
          <th>库存</th><th>月销量</th><th>30日动销率</th><th>操作</th>
        </tr></thead>
        <tbody>
          ${DB.skus.map(s => `
            <tr>
              <td><b>${s.name}</b><div class="dim tiny">${s.note}</div></td>
              <td>${s.aroma}</td>
              <td class="num">¥${s.cost}</td>
              <td class="num">¥${s.price}</td>
              <td class="num gold-text">${Math.round(s.margin * 100)}%</td>
              <td class="num">${s.inv.toLocaleString()}</td>
              <td class="num">${s.velocity.toLocaleString()}</td>
              <td><span class="badge ${s.sell30 > 0.6 ? 'green' : s.sell30 > 0.4 ? 'gold' : 'gray'}">${Math.round(s.sell30 * 100)}%</span></td>
              <td><span class="badge cyan" style="cursor:pointer">编辑</span></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;

/* ================= 交互绑定 ================= */
const Binds = {};

Binds.dashboard = () => {
  // 触发进度条动画
  setTimeout(() => {
    $$('.bar i').forEach(i => { if (i.dataset.w) i.style.width = i.dataset.w; });
  }, 200);
};

/* ---- 选品 Agent ---- */
let selScene = 'mid-autumn', selGoal = 'balance';
Binds.select = () => {
  bindChips('#sceneChips', v => { selScene = v; });
  bindChips('#goalChips', v => { selGoal = v; }, 'g');
  $('#topN').oninput = e => $('#topNLabel').textContent = e.target.value;
  $('#runSelect').onclick = runSelectDemo;
};

function bindChips(selector, callback, attr = 'v') {
  const chips = document.querySelectorAll(selector + ' .chip');
  chips.forEach(c => c.onclick = () => {
    chips.forEach(x => x.classList.remove('on'));
    c.classList.add('on');
    callback && callback(c.dataset[attr]);
  });
}

function stepCard(idx, title, time) {
  const el = document.createElement('div');
  el.className = 'step-card';
  el.innerHTML = `<div class="step-head"><span class="s-idx">STEP ${idx}</span>${title}
    <span class="s-time">${time || ''}</span><span class="s-spin"></span></div><div class="step-body"></div>`;
  $('#console').appendChild(el);
  return el;
}
const doneStep = (el, ms) => { el.querySelector('.s-spin').remove(); el.querySelector('.s-time').textContent = ms + 'ms'; };

async function runSelectDemo() {
  if (state.running) return;
  state.running = true;
  $('#runSelect').disabled = true;
  const scene = DB.selectScenes.find(s => s.id === selScene) || DB.selectScenes[0];
  const topN = +$('#topN').value;
  const goalName = { balance: '动销/毛利均衡', margin: '毛利优先', clear: '清库存优先' }[selGoal];

  const con = $('#console'); con.innerHTML = '';
  const t0 = performance.now();

  // STEP1 目标解析
  let s1 = stepCard(1, '经营目标解析');
  await sleep(500);
  s1.querySelector('.step-body').innerHTML = `<div class="kv">
    <span>场景 <b>${scene.name}</b></span><span>目标 <b>${goalName}</b></span>
    <span>主推款数 <b>${topN}</b></span><span>候选池 <b>${DB.skus.length} SKU</b></span>
    <span>价格带 <b>${scene.priceFit[0]}-${scene.priceFit[1]} 元</b></span></div>`;
  doneStep(s1, 512);

  // STEP2 知识库检索
  let s2 = stepCard(2, '知识层 · 场景知识库检索');
  const body2 = s2.querySelector('.step-body');
  for (const k of scene.kb) { await sleep(320); const d = document.createElement('div'); d.className = 'think-line'; d.textContent = k; body2.appendChild(d); }
  doneStep(s2, 1180);

  // STEP3 数据调取
  let s3 = stepCard(3, '数据层 · 历史动销数据调取');
  await sleep(560);
  const avg = Math.round(DB.skus.reduce((a, s) => a + s.sell30, 0) / DB.skus.length * 100);
  s3.querySelector('.step-body').innerHTML = `<div class="kv">
    <span>SKU 档案 <b>${DB.skus.length} 条</b></span><span>动销均值 <b>${avg}%</b></span>
    <span>库存总量 <b>${DB.skus.reduce((a, s) => a + s.inv, 0).toLocaleString()} 件</b></span>
    <span>月销流速 <b>${DB.skus.reduce((a, s) => a + s.velocity, 0).toLocaleString()} 件/月</b></span></div>`;
  doneStep(s3, 608);

  // STEP4 推理权衡
  let s4 = stepCard(4, '决策层 · 多目标加权推理');
  await sleep(300);
  const res = AgentEngine.runSelect(selScene, selGoal, topN);
  const body4 = s4.querySelector('.step-body');
  const maxT = res.scored[0].total;
  body4.innerHTML = res.scored.map(r => `
    <div class="sku-score"><div class="nm" title="${r.sku.name}">${r.sku.name}</div>
      <div class="bar ${r.total < res.scored[topN - 1].total ? 'rej' : ''}"><i data-w="${r.total / maxT * 100}"></i></div>
      <div class="sc ${r.total < res.scored[topN - 1].total ? 'dim' : ''}">${r.total}</div></div>`).join('');
  await sleep(60);
  body4.querySelectorAll('.bar i').forEach(i => i.style.width = i.dataset.w + '%');
  await sleep(950);
  doneStep(s4, 1260);

  // STEP5 输出决策
  let s5 = stepCard(5, '业务 Agent · 选品清单与决策理由输出');
  const body5 = s5.querySelector('.step-body');
  for (let i = 0; i < res.picks.length; i++) {
    const r = res.picks[i];
    const d = document.createElement('div');
    d.className = 'pick-card';
    d.innerHTML = `<div class="pc-head"><span class="pc-rank">${i + 1}</span>
      <span class="pc-name">${r.sku.name}</span>
      <div class="pc-tags"><span class="badge cyan">${r.sku.aroma}</span><span class="badge gold">¥${r.sku.price}</span></div></div>
      <div class="pc-why"><b>决策理由：</b>${AgentEngine.buildWhy(r, scene)}</div>
      <div class="pick-stats"><div>综合得分<b>${r.total}</b></div>
        <div>30日动销<b>${Math.round(r.sku.sell30 * 100)}%</b></div>
        <div>毛利率<b>${Math.round(r.sku.margin * 100)}%</b></div>
        <div>库存<b>${r.sku.inv}件</b></div></div>`;
    body5.appendChild(d);
    await sleep(340);
  }
  const rej = document.createElement('div');
  rej.className = 'tiny mt8';
  rej.innerHTML = `<span style="color:var(--red)">未入选：</span>` + res.rejected.map(r =>
    `${r.sku.name}（${AgentEngine.rejectReason(r, scene)}）`).join('；');
  body5.appendChild(rej);
  const total = ((performance.now() - t0) / 1000).toFixed(1);
  doneStep(s5, 980);
  const meta = document.createElement('div');
  meta.className = 'tiny mt8 mono';
  meta.innerHTML = `▸ 决策完成，总耗时 <b style="color:var(--gold)">${total}s</b>（人工选品会约 3.5h）· 内置酒业决策引擎 · 结果已回流反馈层`;
  body5.appendChild(meta);

  state.running = false;
  $('#runSelect').disabled = false;
}

/* ---- 私域 Agent ---- */
let pGoal = 'wake';
Binds.private = () => {
  bindChips('#pGoalChips', v => {
    pGoal = v;
    const g = DB.privateGoals.find(x => x.id === v);
    $('#pGoalDesc').textContent = g.desc;
  });
  $('#runPrivate').onclick = runPrivateDemo;
};

async function runPrivateDemo() {
  if (state.running) return;
  state.running = true;
  $('#runPrivate').disabled = true;
  const con = $('#console'); con.innerHTML = '';
  const plan = AgentEngine.planPrivate(pGoal);
  const t0 = performance.now();

  let s1 = stepCard(1, '运营目标解析');
  await sleep(450);
  s1.querySelector('.step-body').innerHTML = `<div class="kv">
    <span>目标 <b>${plan.goal.name}</b></span><span>主攻层 <b>${plan.primary.name}</b></span>
    <span>人群规模 <b>${plan.primary.count.toLocaleString()} 人</b></span></div>`;
  doneStep(s1, 447);

  let s2 = stepCard(2, '用户数据域 · RFM 分层调取');
  await sleep(500);
  s2.querySelector('.step-body').innerHTML = `
    <div style="display:flex;gap:24px;align-items:center">
      <div>${Charts.donut(DB.segments)}</div>
      <div style="flex:1">${DB.segments.map(g => `
        <div class="sku-score" style="grid-template-columns:120px 1fr 100px">
          <div class="nm">${g.name}</div>
          <div class="bar"><i data-w="${g.pct * 100}"></i></div>
          <div class="sc ${g.key === plan.primary.key ? '' : 'dim'}">${g.count.toLocaleString()}</div>
        </div>`).join('')}
      </div></div>`;
  await sleep(60);
  s2.querySelectorAll('.bar i').forEach(i => i.style.width = i.dataset.w + '%');
  await sleep(800);
  doneStep(s2, 734);

  let s3 = stepCard(3, '决策层 · 触达策略生成');
  const b3 = s3.querySelector('.step-body');
  const lines = [
    `主攻层「${plan.primary.name}」：${plan.primary.strategy}`,
    `协同层「${plan.others[0].name}」：低干扰内容种草，观察转化信号`,
    `触达节奏：20:00-21:30 私域活跃高峰推送，48h 未读降级短信兜底`,
    `频控约束：同一用户 7 日内最多触达 2 次，防打扰退群`,
    `A/B测试：自动分流10%用户做对照组，持续优化话术`,
  ];
  for (const l of lines) { await sleep(300); const d = document.createElement('div'); d.className = 'think-line'; d.textContent = l; b3.appendChild(d); }
  doneStep(s3, 1210);

  let s4 = stepCard(4, '生成层 · 个性化话术生成');
  const b4 = s4.querySelector('.step-body');
  await sleep(420);
  b4.innerHTML = `
    <div class="seg-msg"><i>主攻层触达话术</i>${esc(plan.primary.msg)}</div>
    <div class="seg-msg"><i>分层策略说明</i>${esc(plan.primary.strategy)}</div>
    <div class="seg-msg" style="border-left-color:var(--purple)"><i>话术 A/B 版本</i>系统自动生成 3 组差异化话术，分流测试后择优全量推送</div>`;
  doneStep(s4, 890);

  let s5 = stepCard(5, '业务 Agent · 执行与效果预估');
  await sleep(500);
  s5.querySelector('.step-body').innerHTML = `
    <div class="pick-stats" style="gap:30px;flex-wrap:wrap">
      <div>预计触达<b>${plan.reach.toLocaleString()} 人</b></div>
      <div>预估转化<b>${plan.conv.toLocaleString()} 单</b></div>
      <div>预估增量GMV<b>¥${plan.gmv.toLocaleString()}</b></div>
      <div>层转化率基准<b>${Math.round(plan.primary.conv * 100)}%</b></div>
      <div>客单价预估<b>¥${plan.avgOrder}</b></div>
    </div>
    <div class="tiny mt8 mono">▸ 已生成执行任务 3 项：人群圈选 · 话术推送 · 48h效果回流（回流至反馈层迭代模型）</div>`;
  doneStep(s5, 660);

  state.running = false;
  $('#runPrivate').disabled = false;
}

/* ---- 投放 Agent ---- */
Binds.ad = () => {
  bindChips('#adSceneChips', v => {});
  $('#adBudget').oninput = e => $('#budgetLabel').textContent = (+e.target.value).toLocaleString();

  // 平台选择
  $$('#platformSelect .platform-item').forEach(el => {
    el.onclick = () => {
      const id = el.dataset.id;
      if (state.adPlatforms.includes(id)) {
        if (state.adPlatforms.length > 1) {
          state.adPlatforms = state.adPlatforms.filter(x => x !== id);
          el.classList.remove('on');
        }
      } else {
        state.adPlatforms.push(id);
        el.classList.add('on');
      }
    };
  });

  $('#runAd').onclick = runAdDemo;
};

async function runAdDemo() {
  if (state.running) return;
  state.running = true;
  $('#runAd').disabled = true;
  const budget = +$('#adBudget').value;
  const con = $('#console'); con.innerHTML = '';
  const t0 = performance.now();

  let s1 = stepCard(1, '投放目标解析');
  await sleep(400);
  s1.querySelector('.step-body').innerHTML = `<div class="kv">
    <span>总预算 <b>¥${budget.toLocaleString()}</b></span>
    <span>投放平台 <b>${state.adPlatforms.length} 个</b></span>
    <span>优化目标 <b>ROI最大化</b></span></div>`;
  doneStep(s1, 420);

  let s2 = stepCard(2, '数据层 · 历史投放数据调取');
  await sleep(500);
  s2.querySelector('.step-body').innerHTML = `<div class="kv">
    <span>历史投放组 <b>24 组</b></span>
    <span>累计曝光 <b>1,280万+</b></span>
    <span>历史均值ROI <b>3.06</b></span>
    <span>转化漏斗数据 <b>完整</b></span></div>`;
  doneStep(s2, 560);

  let s3 = stepCard(3, '决策层 · 智能预算分配');
  await sleep(300);
  const result = AgentEngine.runAdAllocation(budget, state.adPlatforms);
  const b3 = s3.querySelector('.step-body');

  const allocHtml = result.allocations.map(a => `
    <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px dashed var(--line2)">
      <span style="font-size:20px">${a.platform.ico}</span>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;font-size:13px">
          <span><b>${a.platform.name}</b></span>
          <span class="mono gold-text">¥${a.budget.toLocaleString()} (${a.ratio}%)</span>
        </div>
        <div class="bar" style="height:6px;margin-top:6px"><i data-w="${a.ratio}%"></i></div>
      </div>
    </div>`).join('');
  b3.innerHTML = allocHtml;
  await sleep(100);
  b3.querySelectorAll('.bar i').forEach(i => i.style.width = i.dataset.w);
  await sleep(600);

  const lines = [
    `基于边际效益分析，抖音 ROI 最高，分配最多预算`,
    `视频号私域联动好，作为第二投放阵地`,
    `小红书种草转化链路短，适合新品推广`,
    `各平台预算根据实时 ROI 动态调整，每日自动优化`,
  ];
  for (const l of lines) { await sleep(250); const d = document.createElement('div'); d.className = 'think-line'; d.textContent = l; b3.appendChild(d); }
  doneStep(s3, 1420);

  let s4 = stepCard(4, '投放时段优选');
  const b4 = s4.querySelector('.step-body');
  await sleep(400);
  const maxScore = Math.max(...result.timeSlots.map(t => t.score));
  b4.innerHTML = result.timeSlots.map(t => `
    <div style="display:flex;align-items:center;gap:12px;padding:6px 0">
      <span style="width:90px;font-size:12px">${t.time}</span>
      <span style="width:70px;font-size:11.5px;color:var(--text3)">${t.label}</span>
      <div class="bar" style="flex:1;height:8px"><i data-w="${t.score / maxScore * 100}%"></i></div>
      <span class="mono" style="width:40px;text-align:right;color:${t.score === maxScore ? 'var(--gold2)' : 'var(--text3)'}">${Math.round(t.score * 100)}%</span>
    </div>`).join('');
  await sleep(60);
  b4.querySelectorAll('.bar i').forEach(i => i.style.width = i.dataset.w);
  await sleep(500);
  doneStep(s4, 920);

  let s5 = stepCard(5, '业务 Agent · 投放预估与执行');
  await sleep(500);
  s5.querySelector('.step-body').innerHTML = `
    <div class="pick-stats" style="gap:30px;flex-wrap:wrap">
      <div>总预算<b>¥${result.totalBudget.toLocaleString()}</b></div>
      <div>预估GMV<b>¥${result.totalGmv.toLocaleString()}</b></div>
      <div>综合ROI<b>${result.overallRoi}</b></div>
      <div>预估转化<b>${result.totalConv.toLocaleString()}单</b></div>
    </div>
    <div class="seg-msg mt8"><i>执行方案</i>已生成投放计划 ${state.adPlatforms.length} 组，按最优时段分批投放，系统将根据实时数据动态调优预算分配，每 2 小时自动优化一次。</div>
    <div class="tiny mt8 mono">▸ 决策完成，总耗时 ${((performance.now() - t0) / 1000).toFixed(1)}s · 内置投放决策引擎</div>`;
  doneStep(s5, 700);

  state.running = false;
  $('#runAd').disabled = false;
}

/* ---- 内容 Agent ---- */
Binds.content = () => {
  // 内容类型选择
  $$('#contentTypes .content-type').forEach(el => {
    el.onclick = () => {
      $$('#contentTypes .content-type').forEach(x => x.classList.remove('on'));
      el.classList.add('on');
      state.contentType = el.dataset.id;
    };
  });

  $('#runContent').onclick = runContentDemo;
};

async function runContentDemo() {
  if (state.running) return;
  state.running = true;
  $('#runContent').disabled = true;
  const skuId = $('#contentSku').value;
  const type = state.contentType;
  const typeName = DB.contentTypes.find(t => t.id === type)?.name || '内容';
  const con = $('#console'); con.innerHTML = '';
  const t0 = performance.now();

  let s1 = stepCard(1, '内容需求解析');
  await sleep(350);
  const sku = DB.skus.find(s => s.id === skuId);
  s1.querySelector('.step-body').innerHTML = `<div class="kv">
    <span>内容类型 <b>${typeName}</b></span>
    <span>产品 <b>${sku.name}</b></span>
    <span>香型 <b>${sku.aroma}</b></span>
    <span>价格 <b>¥${sku.price}</b></span></div>`;
  doneStep(s1, 380);

  let s2 = stepCard(2, '知识层 · 场景词库检索');
  const b2 = s2.querySelector('.step-body');
  const kbs = [
    `产品关键词：${sku.aroma}、纯粮酿造、${sku.note}`,
    `场景关键词：${sku.scenes.join('、')}`,
    `人群关键词：${sku.crowd.join('、')}`,
    `价格锚点：¥${sku.price}，竞品价位带分析完成`,
  ];
  for (const k of kbs) { await sleep(280); const d = document.createElement('div'); d.className = 'think-line'; d.textContent = k; b2.appendChild(d); }
  doneStep(s2, 980);

  let s3 = stepCard(3, '生成层 · 内容智能生成');
  const b3 = s3.querySelector('.step-body');
  await sleep(400);
  const content = AgentEngine.generateContent(type, skuId, '专业讲解型');

  if (type === 'live') {
    b3.innerHTML = `<div class="script-preview">
      <div class="script-title">🎙 ${content.title}</div>
      ${content.sections.map(sec => `
        <div style="margin-bottom:12px">
          <div style="color:var(--gold);font-weight:600;font-size:12px;margin-bottom:4px">【${sec.name}】· ${sec.duration}</div>
          <div style="padding-left:12px;border-left:2px solid var(--line2)">${sec.content}</div>
        </div>`).join('')}
      <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line2)">
        <span style="color:var(--text3);font-size:12px">核心要点：</span>
        ${content.keyPoints.map(p => `<span class="badge gold" style="margin:2px">${p}</span>`).join('')}
      </div>
    </div>`;
  } else if (type === 'shortvideo') {
    b3.innerHTML = `<div class="script-preview">
      <div class="script-title">🎬 ${content.title} · ${content.duration}</div>
      <table style="width:100%;font-size:12px;margin-top:8px">
        <tr style="color:var(--text3)"><th style="width:70px">时长</th><th style="width:60px">景别</th><th>画面/旁白/字幕</th></tr>
        ${content.scenes.map(sc => `
          <tr style="border-bottom:1px solid var(--line2)">
            <td class="mono gold-text">${sc.time}</td>
            <td>${sc.shot}</td>
            <td><div><b>画面：</b>${sc.content}</div>
              <div><b>旁白：</b>${sc.voiceover}</div>
              <div style="color:var(--cyan)"><b>字幕：</b>${sc.text}</div>
            </td>
          </tr>`).join('')}
      </table>
      <div style="margin-top:12px"><span style="color:var(--text3);font-size:12px">话题标签：</span>
        ${content.hashtags.map(h => `<span class="badge cyan" style="margin:2px">${h}</span>`).join('')}
      </div>
    </div>`;
  } else if (type === 'graphic') {
    b3.innerHTML = `<div class="script-preview" style="white-space:pre-wrap">
      <div class="script-title">📝 ${content.title}</div>
      <div style="color:var(--gold);font-weight:700;margin-bottom:10px">${content.headline}</div>
${content.body}
      <div style="margin-top:14px;padding-top:10px;border-top:1px dashed var(--line2)">
        <span style="color:var(--text3);font-size:12px">配图：${content.imageCount} 张</span><br/>
        <span style="color:var(--text3);font-size:12px">标签：</span>
        ${content.tags.map(t => `<span class="badge purple" style="margin:2px">#${t}</span>`).join('')}
      </div>
    </div>`;
  } else if (type === 'digital') {
    b3.innerHTML = `
      <div class="digital-human-card">
        <div class="dh-avatar">${content.digitalHuman.avatar}</div>
        <div class="dh-info">
          <div class="dh-name">数字人「${content.digitalHuman.name}」 · ${content.digitalHuman.style}</div>
          <div class="dh-status">● ${content.digitalHuman.workHours} · 支持 ${content.digitalHuman.languages.join(' / ')}</div>
          <div class="dh-stats">
            <div>闲时转化<b>+30%</b></div>
            <div>人力成本<b>-70%</b></div>
            <div>开播时长<b>×3</b></div>
          </div>
        </div>
      </div>
      <div class="mt16" style="font-size:12.5px;color:var(--text2)">
        <div style="font-weight:600;color:var(--text);margin-bottom:8px">📅 直播排期方案：</div>
        ${content.schedule.map(s => `
          <div style="padding:8px 12px;background:var(--bg2);border-radius:8px;margin-bottom:6px;display:flex;gap:12px">
            <span class="mono" style="color:var(--gold);width:110px">${s.time}</span>
            <div><b>${s.type}</b><div class="tiny">${s.content} · 受众：${s.audience}</div></div>
          </div>`).join('')}
      </div>
      <div class="seg-msg mt8" style="border-left-color:var(--purple)">
        <i style="color:var(--purple)">核心价值</i>
        <ul style="margin:6px 0 0 16px">
          ${content.benefits.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>`;
  }

  doneStep(s3, 1580);

  let s4 = stepCard(4, '内容优化建议');
  const b4 = s4.querySelector('.step-body');
  const tips = [
    `建议搭配产品实拍图/视频，视觉冲击力更强`,
    `黄金前 3 秒必须抛出利益点，提升完播率`,
    `发布时间建议 20:00-22:00，为用户活跃高峰`,
    `发布后 2 小时内密切关注互动数据，及时回复评论`,
  ];
  for (const t of tips) { await sleep(200); const d = document.createElement('div'); d.className = 'think-line'; d.textContent = t; b4.appendChild(d); }
  doneStep(s4, 820);

  const meta = document.createElement('div');
  meta.className = 'tiny mt8 mono';
  meta.innerHTML = `▸ 内容生成完成，总耗时 ${((performance.now() - t0) / 1000).toFixed(1)}s · 可直接导出使用`;
  s4.querySelector('.step-body').appendChild(meta);

  state.running = false;
  $('#runContent').disabled = false;
}

/* ================= 配置向导 ================= */
let obStep = 1;
function initOnboarding() {
  // 检查是否首次登录
  const configured = localStorage.getItem('yn_configured');
  if (configured !== '1') {
    $('#onboardingMask').style.display = 'flex';
    obStep = 1;
    updateObStep();
  }
}

function updateObStep() {
  const dots = $$('.step-dot');
  const lines = $$('.step-line');
  dots.forEach((d, i) => {
    const step = i + 1;
    d.classList.toggle('active', step === obStep);
    d.classList.toggle('done', step < obStep);
    if (step < obStep) d.querySelector('span').textContent = '✓';
    else d.querySelector('span').textContent = step;
  });
  lines.forEach((l, i) => {
    l.classList.toggle('active', i + 1 < obStep);
    l.classList.toggle('done', i + 1 < obStep);
  });
  $$('.ob-step').forEach(s => s.classList.toggle('active', +s.dataset.step === obStep));

  // 按钮状态
  $('#obPrev').style.display = obStep > 1 ? 'inline-flex' : 'none';
  $('#obNext').style.display = obStep < 4 ? 'inline-flex' : 'none';
  $('#obStart').style.display = obStep === 4 ? 'inline-flex' : 'none';
  $('#obSkip').style.display = obStep < 3 ? 'inline-flex' : 'none';
}

function nextObStep() { if (obStep < 4) { obStep++; updateObStep(); } }
function prevObStep() { if (obStep > 1) { obStep--; updateObStep(); } }
function finishOnboarding() {
  localStorage.setItem('yn_configured', '1');
  $('#onboardingMask').style.display = 'none';
}

/* ================= 退出登录 ================= */
function logout() {
  localStorage.removeItem('yn_logged_in');
  localStorage.removeItem('yn_configured');
  window.location.href = 'index.html';
}

/* ================= 启动 ================= */
(function init() {
  // 检查登录状态
  const logged = localStorage.getItem('yn_logged_in');
  if (logged !== '1') {
    window.location.replace('index.html');
    return;
  }

  // 设置企业名称
  const account = localStorage.getItem('yn_account') || 'demo@yunniang.com';
  $('#entName').textContent = '演示酒企';

  renderNav();
  navigateTo('dashboard');

  // 配置向导事件
  $('#obNext').onclick = nextObStep;
  $('#obPrev').onclick = prevObStep;
  $('#obStart').onclick = finishOnboarding;
  $('#obSkip').onclick = finishOnboarding;
  $('#btnLogout').onclick = logout;

  // 首次登录显示配置向导
  setTimeout(initOnboarding, 800);
})();
