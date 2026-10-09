/* ============================================================
 * 云酿智链 AI OS —— 内置酒业决策引擎
 * 四大 Agent：选品 / 私域 / 投放 / 内容
 * ============================================================ */
const AgentEngine = {

  /* ---------- 选品决策 ---------- */
  invHealth(sku) {
    const cover = sku.inv / Math.max(1, sku.velocity);
    if (cover >= 1 && cover <= 3.5) return 1;
    if (cover < 1) return 0.4 + cover * 0.6;
    return Math.max(0.2, 1 - (cover - 3.5) * 0.18);
  },
  priceFit(price, range) {
    const [lo, hi] = range;
    if (price >= lo && price <= hi) return 1;
    const d = price < lo ? lo / price : price / hi;
    return Math.max(0, 1 - (d - 1) * 0.9);
  },
  scoreSkus(scene, skus) {
    const maxSell = Math.max(...skus.map(s => s.sell30));
    const maxMargin = Math.max(...skus.map(s => s.margin));
    return skus.map(s => {
      const matched = s.scenes.filter(t => scene.tags.includes(t));
      const parts = {
        scene: Math.min(1, matched.length / Math.max(1, scene.tags.length) * 1.6),
        price: this.priceFit(s.price, scene.priceFit),
        sell: s.sell30 / maxSell,
        margin: s.margin / maxMargin,
        inv: this.invHealth(s),
      };
      const w = scene.w;
      const total = (parts.scene * w.scene + parts.price * w.price + parts.sell * w.sell +
                     parts.margin * w.margin + parts.inv * w.inv) * 100;
      return { sku: s, parts, matched, total: Math.round(total * 10) / 10 };
    }).sort((a, b) => b.total - a.total);
  },
  buildWhy(r, scene) {
    const { sku, parts, matched } = r;
    const why = [];
    if (matched.length) why.push(`场景命中「${matched.join('、')}」`);
    if (parts.price > 0.95) why.push(`价格 ¥${sku.price} 落在${scene.name}主力带`);
    if (sku.sell30 >= 0.6) why.push(`历史30日动销 ${Math.round(sku.sell30 * 100)}%，动销确定性高`);
    if (sku.margin >= 0.45) why.push(`毛利 ${Math.round(sku.margin * 100)}%，利润空间厚`);
    const cover = (sku.inv / Math.max(1, sku.velocity)).toFixed(1);
    why.push(`库存 ${sku.inv} 件，可支撑约 ${cover} 个月动销`);
    return why.join('；');
  },
  rejectReason(r, scene) {
    const { sku, parts, matched } = r;
    if (!matched.length) return `场景标签不匹配「${scene.name}」`;
    if (parts.price < 0.5) return `价格 ¥${sku.price} 偏离目标价格带`;
    if (parts.sell < 0.5) return `历史动销偏弱（${Math.round(sku.sell30 * 100)}%），主推风险高`;
    return '综合得分低于入选线';
  },
  adjustScene(scene, goal) {
    const s = JSON.parse(JSON.stringify(scene));
    if (goal === 'margin') { s.w.margin += 0.15; s.w.sell -= 0.10; s.w.inv -= 0.05; }
    if (goal === 'clear') { s.w.inv += 0.20; s.w.price -= 0.05; s.w.margin -= 0.15; }
    return s;
  },
  runSelect(sceneId, goal, topN) {
    const base = DB.selectScenes.find(s => s.id === sceneId) || DB.selectScenes[0];
    const scene = this.adjustScene(base, goal);
    const scored = this.scoreSkus(scene, DB.skus);
    return {
      scored,
      picks: scored.slice(0, topN),
      rejected: scored.slice(topN, topN + 3),
      scene,
      goalName: { balance: '动销/毛利均衡', margin: '毛利优先', clear: '清库存优先' }[goal],
    };
  },

  /* ---------- 私域经营决策 ---------- */
  planPrivate(goalId) {
    const goal = DB.privateGoals.find(g => g.id === goalId) || DB.privateGoals[0];
    const primary = DB.segments.find(s => s.key === goal.target);
    const others = DB.segments.filter(s => s.key !== goal.target)
      .sort((a, b) => b.conv - a.conv).slice(0, 2);
    const reach = Math.round(primary.count * 0.85);
    const conv = Math.round(reach * primary.conv);
    const avgOrder = primary.key === 'vip' ? 598 : primary.key === 'new' ? 19.9 : 168;
    const gmv = Math.round(conv * avgOrder);
    return { goal, primary, others, reach, conv, gmv, avgOrder };
  },

  /* ---------- 投放决策 ---------- */
  runAdAllocation(budget, platformIds, sceneId) {
    const platforms = DB.platforms.filter(p => platformIds.includes(p.id));
    if (!platforms.length) platforms.push(DB.platforms[0]);

    // 基于各平台历史ROI加权分配预算
    const totalRoi = platforms.reduce((a, p) => a + p.avgRoi, 0);
    const allocations = platforms.map(p => {
      const ratio = p.avgRoi / totalRoi;
      const allocated = Math.round(budget * ratio);
      const expectedConv = Math.round(allocated * p.avgRoi / 80); // 假设客单价80
      const exposure = Math.round(allocated / 0.05 * 10); // 假设CPM 50元
      return {
        platform: p,
        budget: allocated,
        ratio: Math.round(ratio * 100),
        roi: p.avgRoi,
        expectedGmv: Math.round(allocated * p.avgRoi),
        expectedConv,
        exposure,
      };
    });

    const totalBudget = allocations.reduce((a, b) => a + b.budget, 0);
    const totalGmv = allocations.reduce((a, b) => a + b.expectedGmv, 0);
    const totalConv = allocations.reduce((a, b) => a + b.expectedConv, 0);
    const overallRoi = (totalGmv / totalBudget).toFixed(2);

    // 最佳投放时段
    const timeSlots = [
      { time: '08:00-10:00', label: '早高峰', score: 0.42 },
      { time: '12:00-14:00', label: '午间休息', score: 0.68 },
      { time: '18:00-20:00', label: '晚间通勤', score: 0.85 },
      { time: '20:00-23:00', label: '黄金时段', score: 1.0 },
      { time: '23:00-01:00', label: '深夜场', score: 0.55 },
    ];

    return { allocations, totalBudget, totalGmv, totalConv, overallRoi, timeSlots };
  },

  /* ---------- 内容生成 ---------- */
  generateContent(type, skuId, style) {
    const sku = DB.skus.find(s => s.id === skuId) || DB.skus[0];
    const templates = {
      live: this._generateLiveScript(sku, style),
      shortvideo: this._generateShortVideoScript(sku, style),
      graphic: this._generateGraphicContent(sku, style),
      digital: this._generateDigitalHuman(sku, style),
    };
    return templates[type] || templates.live;
  },

  _generateLiveScript(sku, style) {
    const scripts = {
      intro: `家人们！今天给大家带来一款${sku.aroma}的好酒——${sku.name}！
这款酒我跟你们说，真的是我们直播间的${sku.sell30 > 0.6 ? '爆款' : '宝藏款'}！
价格只要${sku.price}元，${sku.margin > 0.4 ? '这个品质这个价格，真的是捡漏价！' : '性价比超高！'}`,
      product: `来家人们看一下酒线——（倒酒展示）
看到没有，这个酒花细密饱满，经久不散！
${sku.aroma}，入口绵柔不辣喉，喝完不上头！
${sku.note}，这就是品质的保证！`,
      scene: `不管你是${sku.scenes[0]}，还是${sku.scenes[1] || '朋友聚饮'}，
这款酒都特别合适！${sku.crowd[0]}都在喝！
现在下单还有赠品，库存有限，手慢无！`,
      promo: `来家人们，今天直播间专属福利！
原价${Math.round(sku.price * 1.3)}元的${sku.name}，
今天下单立减${Math.round(sku.price * 0.15)}元，只要${Math.round(sku.price * 0.85)}元！
再送价值39元的小酒版！3、2、1，上链接！`,
    };
    return {
      title: `${sku.name} · 直播话术（${style || '产品介绍型'}）`,
      duration: '约 5 分钟',
      sections: [
        { name: '开场引流', content: scripts.intro, duration: '60秒' },
        { name: '产品展示', content: scripts.product, duration: '90秒' },
        { name: '场景种草', content: scripts.scene, duration: '80秒' },
        { name: '逼单转化', content: scripts.promo, duration: '70秒' },
      ],
      keyPoints: ['酒花展示', '价格锚定', '场景代入', '限时福利', '库存稀缺'],
    };
  },

  _generateShortVideoScript(sku, style) {
    return {
      title: `${sku.name} · 短视频脚本`,
      duration: '30 秒',
      scenes: [
        { time: '0-3秒', shot: '特写', content: '倒酒慢动作，酒花飞溅', voiceover: '这酒花，绝了！', text: `${sku.aroma} 纯粮酿造` },
        { time: '3-8秒', shot: '中景', content: '人物举杯品鉴，表情享受', voiceover: `${sku.name}，入口绵柔，回甘持久`, text: `${sku.price}元 超值` },
        { time: '8-15秒', shot: '特写', content: '酒瓶+礼盒展示', voiceover: `${sku.note}`, text: `${sku.scenes[0]}必备` },
        { time: '15-25秒', shot: '快切', content: '多款酒品横评对比', voiceover: '对比了十多款，这款性价比最高', text: '闭眼入不踩雷' },
        { time: '25-30秒', shot: '全景', content: '小黄车弹出+价格标签', voiceover: '点击下方链接，今天有福利价', text: '限时立减 手慢无' },
      ],
      hashtags: ['#好酒推荐', `#${sku.aroma.replace(' ', '')}`, '#性价比好酒', '#微醺时刻'],
    };
  },

  _generateGraphicContent(sku, style) {
    return {
      title: `${sku.name} · 图文种草文案`,
      platform: '小红书 / 朋友圈',
      headline: `被问爆的${sku.aroma}好酒！${sku.price}元喝出千元品质`,
      body: `姐妹们！今天必须给你们安利这款我最近超爱的酒——${sku.name}！

🍷 口感：${sku.aroma}，入口特别绵柔，完全不辣喉，喝完也不会口干上头
💴 价格：只要${sku.price}元！这个价位能喝到这个品质，真的绝了
🎁 包装：${sku.scenes.includes('礼赠') ? '礼盒装超有面儿，送礼太合适了' : '瓶身设计超好看，摆在家里都像艺术品'}
👥 适合：${sku.scenes.join('、')}都ok

我已经回购好几次了，身边的朋友也被我种草成功！
真心推荐给喜欢喝酒又追求性价比的姐妹们～

${sku.note}
放心冲，不好喝你来打我（不是）`,
      tags: ['好酒推荐', '性价比好酒', '微醺日常', sku.series, sku.aroma.split(' ')[0] + '酒'],
      imageCount: 6,
    };
  },

  _generateDigitalHuman(sku, style) {
    return {
      title: 'AI 数字人直播方案',
      digitalHuman: {
        name: '酿酿',
        avatar: '🍶',
        style: '甜美专业型',
        languages: ['普通话', '山东方言'],
        workHours: '7×24 小时不间断',
      },
      schedule: [
        { time: '00:00-06:00', type: '循环录播+AI互动', content: '爆款产品循环讲解，AI回复常见问题', audience: '夜猫子/失眠人群' },
        { time: '06:00-12:00', type: '半实时直播', content: '早间福利场，引流款主推', audience: '早起人群/银发族' },
        { time: '12:00-18:00', type: '数字人+真人轮播', content: '产品深度讲解+场景种草', audience: '午间休息/摸鱼党' },
        { time: '18:00-24:00', type: '真人主力+数字人辅助', content: '黄金时段大场，全力转化', audience: '主力消费人群' },
      ],
      benefits: [
        '7×24小时不停播，闲时转化率提升30%',
        '降低主播人力成本，一个团队管多个直播间',
        '话术标准化输出，品控稳定不走样',
        '多平台同步开播，流量获取最大化',
      ],
      currentSku: sku,
    };
  },
};
