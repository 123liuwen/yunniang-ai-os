/* ============================================================
 * 云酿智链 AI OS —— 全站数据源（客户视角）
 * 内容严格紧扣项目计划书与演示PPT
 * ============================================================ */
const DB = {

  /* ---------- 品牌信息 ---------- */
  brand: {
    name: '云酿智链 AI OS',
    pos: '酒业AI经营决策与全链路增长平台',
    company: '临沂云酿流香信息技术有限公司',
    slogan: '懂酒的不懂 AI，懂 AI 的没有酒业数据 —— 我们恰好两样都有。',
    tagline: '让每一个经营决策，都有数据撑腰。',
  },

  /* ---------- 核心KPI ---------- */
  kpis: [
    { label: '本月销售额', val: '286.5', unit: '万元', note: '较上月 +12.3%', trend: 'up', trendVal: '+12.3%' },
    { label: '本月净利润', val: '32.8', unit: '万元', note: '较上月 +8.6%', trend: 'up', trendVal: '+8.6%' },
    { label: '私域用户数', val: '172,340', unit: '', note: '本月新增 3,280 人', trend: 'up', trendVal: '+1.9%' },
    { label: '投放 ROI', val: '3.06', unit: '', note: '行业平均 1.8', trend: 'up', trendVal: '领先 70%' },
    { label: '复购率', val: '28.4', unit: '%', note: '私域用户复购', trend: 'up', trendVal: '+3.2pct' },
    { label: 'AI 决策次数', val: '1,248', unit: '次', note: '本月累计运行', trend: 'up', trendVal: '+24%' },
  ],

  /* ---------- 四大 Agent 介绍 ---------- */
  agents: [
    {
      id: 'select', ico: '◈', name: 'AI 选品决策',
      desc: '3-3-4选品策略 + FABE销售法则，秒级输出选品清单与决策理由',
      badge: '首推', color: 'gold',
      fullName: '选酒数据决策分析系统',
      softReg: '软著登字第15975854号',
    },
    {
      id: 'private', ico: '♟', name: '私域经营',
      desc: 'RFM用户分层 + AI助理接入 + 复购精准触达，17万+用户自动运营',
      badge: '', color: 'cyan',
      fullName: '私域用户分层运营智能管理系统',
      softReg: '软著登字第17967569号',
    },
    {
      id: 'ad', ico: '◔', name: '智能投放',
      desc: '智能预算分配 + 动态调优 + 高潜场景筛选，ROI提升至 3.06',
      badge: '', color: 'purple',
      fullName: '基于场景数据的数字化内容投放分析系统',
      softReg: '软著登字第18173283号',
    },
    {
      id: 'content', ico: '✎', name: '内容生成',
      desc: '直播话术生成 + 图文脚本 + AI数字人直播，7×24小时不间断获客',
      badge: '', color: 'green',
      fullName: '电商主播智能陪练管理系统',
      softReg: '软著登字第17300301号',
    },
  ],

  /* ---------- SKU 库（选品 Agent 决策样本） ---------- */
  skus: [
    { id: 'SK001', name: '满头彩·鸿运礼盒', aroma: '浓香 52°', price: 368, cost: 212, scenes: ['礼赠', '婚宴', '节礼'], sell30: 0.71, margin: 0.42, inv: 3200, velocity: 1850, crowd: ['礼赠人群', '宴席主家'], note: '自有品牌礼盒，节庆动销王', series: '满头彩' },
    { id: 'SK002', name: '金钻清樽', aroma: '清香 42°', price: 188, cost: 120, scenes: ['口粮', '微醺', '聚饮'], sell30: 0.64, margin: 0.36, inv: 5400, velocity: 2600, crowd: ['大众自饮'], note: '自有品牌走量款', series: '金钻' },
    { id: 'SK003', name: '蓝钻清樽', aroma: '浓香 45°', price: 268, cost: 160, scenes: ['宴请', '礼赠'], sell30: 0.58, margin: 0.40, inv: 2100, velocity: 1200, crowd: ['商务宴请'], note: '自有品牌中坚款', series: '蓝钻' },
    { id: 'SK004', name: '枇杷秋梨酒', aroma: '果酒 12°', price: 99, cost: 45, scenes: ['微醺', '悦己', '伴手礼'], sell30: 0.66, margin: 0.55, inv: 4800, velocity: 3100, crowd: ['新世代女性', '轻饮人群'], note: '发明专利产品·助农共富', series: '清饮' },
    { id: 'SK005', name: '湄窖·黔韵', aroma: '酱香 53°', price: 428, cost: 222, scenes: ['商务', '收藏', '高端礼赠'], sell30: 0.41, margin: 0.48, inv: 900, velocity: 380, crowd: ['高净值客'], note: '老字号·独家代理', series: '湄窖' },
    { id: 'SK006', name: '浏阳河·红方', aroma: '浓香 50°', price: 158, cost: 106, scenes: ['口粮', '宴席', '聚饮'], sell30: 0.69, margin: 0.33, inv: 6700, velocity: 3400, crowd: ['大众宴席'], note: '老字号·宴席基酒', series: '浏阳河' },
    { id: 'SK007', name: '青花氿·青花20', aroma: '清香 53°', price: 598, cost: 287, scenes: ['商务', '高端礼赠', '收藏'], sell30: 0.35, margin: 0.52, inv: 600, velocity: 210, crowd: ['高端礼赠'], note: '高端形象款', series: '青花氿' },
    { id: 'SK008', name: '诗林醉·桂花酿', aroma: '露酒 18°', price: 129, cost: 64, scenes: ['悦己', '微醺', '伴手礼'], sell30: 0.49, margin: 0.50, inv: 2600, velocity: 1150, crowd: ['年轻女性'], note: '新锐口味酒', series: '诗林醉' },
    { id: 'SK009', name: '金钻·小酌50ml', aroma: '浓香 45°', price: 19.9, cost: 14.3, scenes: ['微醺', '尝鲜', '悦己'], sell30: 0.83, margin: 0.28, inv: 15000, velocity: 8200, crowd: ['尝鲜客', '学生党'], note: '小酒赛道引流款', series: '金钻' },
    { id: 'SK010', name: '第一河·封坛', aroma: '原浆 60°', price: 888, cost: 355, scenes: ['收藏', '高端礼赠', '商务'], sell30: 0.22, margin: 0.60, inv: 300, velocity: 95, crowd: ['收藏客'], note: '品牌制高点', series: '第一河' },
  ],

  /* 选品场景知识库 */
  selectScenes: [
    { id: 'mid-autumn', name: '中秋礼赠', tags: ['礼赠', '高端礼赠', '伴手礼'], priceFit: [150, 600],
      w: { scene: 0.35, price: 0.15, sell: 0.20, margin: 0.15, inv: 0.15 },
      kb: ['礼赠场景→礼盒装/品牌知名度优先', '价格锚点 200-600 元为礼赠主力带', '节前 21 天进入动销高峰', '包装仪式感权重 > 口感权重'] },
    { id: 'newyear', name: '年夜饭/宴席', tags: ['宴席', '聚饮', '婚宴'], priceFit: [100, 400],
      w: { scene: 0.35, price: 0.15, sell: 0.20, margin: 0.10, inv: 0.20 },
      kb: ['宴席场景→大包装高性价比为王', '香型偏好区域化：山东浓香为主', '宴席走量大、毛利可让渡', '库存深度是第一约束'] },
    { id: 'biz', name: '商务宴请', tags: ['商务', '高端礼赠'], priceFit: [300, 900],
      w: { scene: 0.35, price: 0.20, sell: 0.10, margin: 0.25, inv: 0.10 },
      kb: ['商务场景→品牌力与价格双锚定', '高毛利优先，动销频次其次', '酱香/清香头部香型溢价明显'] },
    { id: 'daily', name: '日常口粮', tags: ['口粮', '聚饮'], priceFit: [50, 250],
      w: { scene: 0.30, price: 0.20, sell: 0.25, margin: 0.10, inv: 0.15 },
      kb: ['口粮场景→复购率是核心指标', '100-200 元为黄金口粮带', '纯粮固态发酵是信任关键词'] },
    { id: 'tipsy', name: '微醺悦己', tags: ['微醺', '悦己', '尝鲜'], priceFit: [10, 150],
      w: { scene: 0.35, price: 0.15, sell: 0.25, margin: 0.15, inv: 0.10 },
      kb: ['微醺场景→低度化+小瓶装+高颜值', '新世代女性为第一人群', '内容种草转化链路最短', '50ml 小酒市场快速扩容'] },
  ],

  /* ---------- 私域用户分层 ---------- */
  segments: [
    { key: 'vip', name: '高价值活跃层', pct: 0.06, count: 10200, rfm: 'R近 F高 M高', conv: 0.18,
      strategy: '专属顾问1v1 + 新品优先购 + 封坛/收藏款定向推荐',
      msg: '「云酿臻享」王哥，您收藏的青花20同款年份批次本周到仓30坛，会员优先锁价598元/瓶，附赠定制分酒器，回复"留"为您预留。' },
    { key: 'repeat', name: '复购临期层', pct: 0.21, count: 35700, rfm: 'R中 F中 M中', conv: 0.09,
      strategy: '复购周期预测触发 + 老客专享券 + 同款续购一键下单',
      msg: '您上次购入的金钻清樽预计快喝完啦～老客续购立减20，今日下单再送50ml小酌装，戳→ ynzl.cn/r8' },
    { key: 'sleep', name: '沉睡唤醒层', pct: 0.38, count: 64600, rfm: 'R远 F低 M低', conv: 0.03,
      strategy: '内容唤醒（场景种草）→ 小额券试触 → 高意向者人工跟进',
      msg: '好久没跟您聊酒了。最近降温，给您留了一份「温酒指南」+ 无门槛15元券，看看有没有合眼缘的→ ynzl.cn/w3' },
    { key: 'new', name: '新客培育层', pct: 0.35, count: 59500, rfm: 'R近 F0 M0', conv: 0.05,
      strategy: '首单培育SOP + 19.9元小酌引流款 + 品牌溯源故事种草',
      msg: '新朋友您好！第一瓶不用买贵的——19.9元金钻小酌装，纯粮酿造先试喝，喝好再来找我。下单点→ ynzl.cn/n1' },
  ],
  privateGoals: [
    { id: 'wake', name: '沉睡用户唤醒', target: 'sleep', desc: '对 90 天未互动用户做低成本唤醒' },
    { id: 'repurchase', name: '复购促单', target: 'repeat', desc: '对复购临期用户触发续购提醒' },
    { id: 'vip', name: '高净值维护', target: 'vip', desc: '对高价值用户做深度绑定与提频' },
    { id: 'first', name: '新客首购转化', target: 'new', desc: '对新进私域用户做首单培育' },
  ],

  /* ---------- 投放 Agent 数据 ---------- */
  platforms: [
    { id: 'douyin', name: '抖音', ico: '🎵', desc: '短视频+直播', avgRoi: 3.2, active: true },
    { id: 'wechat', name: '视频号', ico: '💬', desc: '私域联动', avgRoi: 2.8, active: true },
    { id: 'xiaohongshu', name: '小红书', ico: '📕', desc: '种草转化', avgRoi: 2.5, active: true },
    { id: 'kuaishou', name: '快手', ico: '⚡', desc: '下沉市场', avgRoi: 2.1, active: false },
  ],

  adScenes: [
    { id: 'festival', name: '节日礼赠', time: '节前21天启动', desc: '中秋/春节/端午等节点' },
    { id: 'weekend', name: '周末聚饮', time: '周四-周六投放', desc: '周末聚饮场景种草' },
    { id: 'evening', name: '晚间微醺', time: '20:00-23:00', desc: '夜间黄金流量时段' },
    { id: 'newproduct', name: '新品上市', time: '上市前7天预热', desc: '新品造势+预售转化' },
  ],

  /* ---------- 内容 Agent 数据 ---------- */
  contentTypes: [
    { id: 'live', name: '直播话术', ico: '🎙', desc: '直播间口播脚本' },
    { id: 'shortvideo', name: '短视频脚本', ico: '🎬', desc: '15-60秒短视频' },
    { id: 'graphic', name: '图文种草', ico: '📝', desc: '小红书/朋友圈图文' },
    { id: 'digital', name: '数字人直播', ico: '🤖', desc: 'AI数字人7×24直播' },
  ],

  liveTemplates: [
    { name: '产品介绍型', duration: '3分钟', scene: '单品深度讲解' },
    { name: '福利促销型', duration: '2分钟', scene: '限时秒杀/满减' },
    { name: '场景种草型', duration: '4分钟', scene: '消费场景代入' },
    { name: '对比测评型', duration: '5分钟', scene: '多酒品横评' },
  ],

  /* ---------- 经营数据 ---------- */
  revenueChart: [
    { y: '1月', rev: 186, profit: 18 },
    { y: '2月', rev: 210, profit: 22 },
    { y: '3月', rev: 198, profit: 20 },
    { y: '4月', rev: 225, profit: 25 },
    { y: '5月', rev: 248, profit: 28 },
    { y: '6月', rev: 286, profit: 33 },
  ],

  /* ---------- 最近决策记录 ---------- */
  recentDecisions: [
    { agent: '选品', action: '生成中秋礼赠选品清单', time: '10分钟前', status: 'success' },
    { agent: '私域', action: '执行沉睡用户唤醒第3批', time: '25分钟前', status: 'running' },
    { agent: '投放', action: '调整抖音投放预算分配', time: '1小时前', status: 'success' },
    { agent: '内容', action: '生成直播话术3套', time: '2小时前', status: 'success' },
    { agent: '选品', action: '宴席用酒选品决策', time: '3小时前', status: 'success' },
  ],
};
