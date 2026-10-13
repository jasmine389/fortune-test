// 财运体质测试 - 核心逻辑

// ===== 题库 =====
const questions = [
  // SAV 储蓄定力
  { id: 1, dimension: 'sav', reverse: false, text: '每个月工资到账后，我会先转一部分到储蓄或投资账户，再安排消费。' },
  { id: 2, dimension: 'sav', reverse: true, text: '我觉得"钱是赚出来的，不是省出来的"，所以很少刻意存钱。' },
  { id: 3, dimension: 'sav', reverse: false, text: '我会为买房、旅行、应急等目标单独设立储蓄计划。' },
  // IMP 消费冲动
  { id: 4, dimension: 'imp', reverse: false, text: '看到直播间"限时秒杀""全网最低价"，我经常忍不住下单。' },
  { id: 5, dimension: 'imp', reverse: false, text: '心情不好的时候，我会通过购物、点外卖、喝奶茶来让自己开心一点。' },
  { id: 6, dimension: 'imp', reverse: true, text: '我买东西前通常会货比三家，不会因为一时冲动付款。' },
  // RIS 风险偏好
  { id: 7, dimension: 'ris', reverse: false, text: '我愿意拿出一部分存款投资股票、基金或ETF，即使可能亏损。' },
  { id: 8, dimension: 'ris', reverse: true, text: '我觉得把钱放在银行活期或稳健理财里最踏实，不追求高收益。' },
  { id: 9, dimension: 'ris', reverse: false, text: '如果朋友推荐一个"靠谱"的新兴投资机会，我会认真考虑并可能参与。' },
  // HUS 搞钱动力
  { id: 10, dimension: 'hus', reverse: false, text: '除了主业，我一直在琢磨或尝试副业、兼职、自媒体变现等增收方式。' },
  { id: 11, dimension: 'hus', reverse: false, text: '我愿意为提升赚钱技能（课程、考证、装备）主动投入时间和金钱。' },
  { id: 12, dimension: 'hus', reverse: true, text: '我觉得有一份稳定工作就够了，没必要折腾副业或理财。' },
  // FACE 面子消费
  { id: 13, dimension: 'face', reverse: false, text: '朋友结婚、同事生娃，我的份子钱标准不会低于身边大多数人。' },
  { id: 14, dimension: 'face', reverse: false, text: '我会因为社交需要（饭局、送礼、品牌）购买超出自己实际消费能力的东西。' },
  { id: 15, dimension: 'face', reverse: true, text: '我不太在乎别人怎么看我的消费选择，实用和划算最重要。' },
  // ANX 金钱焦虑
  { id: 16, dimension: 'anx', reverse: false, text: '即使账户里有钱，我也会经常担心未来会出现大额支出或失业。' },
  { id: 17, dimension: 'anx', reverse: false, text: '看到同龄人在买房、升职、搞副业，我会因为自己的财务状况感到焦虑。' },
  { id: 18, dimension: 'anx', reverse: true, text: '我对自己的财务状况总体上感到满意和安心。' },
];

const options = [
  { value: 1, label: '完全不同意' },
  { value: 2, label: '不太同意' },
  { value: 3, label: '一般' },
  { value: 4, label: '比较同意' },
  { value: 5, label: '完全同意' },
];

// ===== 结果类型定义 =====
const resultTypes = {
  pixiu: {
    emoji: '🐉',
    name: '貔貅型',
    tag: '只进不出 · 财富守门员',
    desc: '你的钱包有个看不见的盖子：进钱的时候痛快，出钱的时候抠。你可能有三个以上记账APP轮着用过，买东西前必看凑单满减，存款数字每涨一万，你晚上睡觉都踏实一分。',
    advantages: [
      '手里永远有粮——失业、生病这种大事砸下来，你比多数人扛得住',
      '直播间的"最后三分钟"话术对你基本无效，智商税交得少',
      '同样是月薪一万，你五年后攒下的钱大概率是同龄人的两三倍',
    ],
    traps: [
      '该花的不花：体检拖了两年没做、牙疼靠忍、几百块的网课反复犹豫，最后花更多钱补窟窿',
      '存款全躺在活期，一年利息不到 1.5%，实际每年被通胀吃掉两三个点',
      '省钱省到人情也薄了——份子钱、请客全躲，时间长了吃亏的是自己',
    ],
    tips: ['设立"快乐基金"：每月固定5%收入用于无负担消费', '学习低风险定投，让存款跑赢通胀', '把"会花钱"也当作一种能力练习'],
    color: '#8b5cf6',
    rarity: '18%',
    lucky: { color: '金色', number: '6、8', habit: '每日记账三分钟', career: '定投/固收理财内容' },
    wealthGuide: {
      short: [
        '开一个"快乐账户"，转入月收入5%，专门用来花且不许心疼（依据：心理账户理论——专款专用能消除消费负罪感）',
        '把纠结很久舍不得买的东西列成清单，今天为其中一件真正提升生活品质的下单',
        '用"时薪换算法"重新评估消费：这件东西 = 你几小时的生命？该买就买，不该买的自然放下',
      ],
      month: [
        '系统学习一个低风险理财工具（债基/固收+/国债逆回购），让沉睡的存款开始参与增长',
        '设置一笔自动化定投，发薪日自动划转——把自律交给制度，而不是意志力',
        '每周做一次"值得消费"复盘：哪些钱花得值？慢慢校准自己的消费观',
      ],
      long: [
        '把10%的储蓄精力转向自我投资：课程、健康、人脉的长期回报率远超多数理财产品',
        '给自己定一条"足够线"：达到某个存款数后主动提高生活质量——钱是工具，安全感不该只来自数字',
        '理解复利的另一半是"活在当下"：为65岁的自己储蓄的同时，别透支35岁的自己',
      ],
    },
  },
  scatter: {
    emoji: '💸',
    name: '散财童子型',
    tag: '花钱如流水 · 体验派',
    desc: '钱在你这儿就是个过客。发薪日像过年，月底吃土也认了。你的购物车里永远躺着 30 件东西，快递小哥认识你家门牌号，但你的人生体验也确实拉满了——吃过的、玩过的、见过的，比很多存款多你一倍的人还多。',
    advantages: [
      '活得不拧巴：该吃吃该玩玩，情绪价值给自己拉满，心理内耗比存钱狂小得多',
      '花钱花出眼光——你比一般人更懂什么值得买，做测评、带货天然有说服力',
      '朋友多、饭局多，路子宽，真缺钱的时候总有人愿意拉你一把',
    ],
    traps: [
      '月薪一万花一万二：花呗和信用卡分期在悄悄吃你——市面上分期年化普遍在 15% 上下，是理财收益的三倍',
      '家里堆满"当时觉得有用"的东西，二手转卖价往往不到三折',
      '压力大就下单，钱花了情绪问题还在，等于花两遍钱',
    ],
    tips: ['设置"48小时冷静期"：非必需品加入购物车两天后决定', '用"时薪换算"：这件东西值我工作多少小时？', '每月工资自动转存固定比例，"眼不见心不花"'],
    color: '#ec4899',
    rarity: '16%',
    lucky: { color: '珊瑚粉', number: '3、7', habit: '购物车冷静三天', career: '好物种草与测评' },
    wealthGuide: {
      short: [
        '关掉1个购物APP的推送通知，或干脆卸载一周试试（依据：环境设计——减少触发就能减少冲动）',
        '把购物车当"许愿池"：加入后48小时再回来看，还想买的才是真需求',
        '盘点并取消一项闲置的订阅/会员——你可能会发现已经连续扣了半年',
      ],
      month: [
        '记录每一笔情绪性消费并标注当时的情绪（焦虑/无聊/报复性），找到你的"消费触发器"',
        '每周设一个"不消费挑战日"：不点外卖、不购物，用免费方式取悦自己',
        '给单笔非必需消费设上限（如200元），超线必须隔天再决定',
      ],
      long: [
        '区分多巴胺快乐和内啡肽满足：购物带来的是前者，技能和运动带来的是后者，后者更持久',
        '建立"先储蓄后消费"的自动机制，让钱在看到之前就被存走（依据：行为经济学的"默认选项"效应）',
        '练习用体验替代购物：一场徒步、一次长谈，往往比一件物品更抗通胀',
      ],
    },
  },
  hunter: {
    emoji: '🎯',
    name: '猎人型',
    tag: '高风险高回报 · 搞钱冒险家',
    desc: '别人的钱在账户里躺着，你的钱在战场上跑着。基金、股票、副业、圈子里流传的新机会，你都门儿清。你亏过钱，也赚过钱，比起账户余额，你更享受的是"看准了"的那种爽感。',
    advantages: [
      '信息嗅觉灵：新政策、新风口你总是朋友圈里最早知道的',
      '输得起也爬得起来，这种钝感力是很多理财老手练不出来的',
      '敢下注，所以你抓到大机会的概率天然比不敢动手的人高',
    ],
    traps: [
      '赚过几次就把运气当实力——2021年追高基金被套的人里，大多是前一年刚尝过甜头的',
      '手里拿不住现金，看到机会就想梭哈，一次重仓失手两年白干',
      '精力全盯着盘面，主业荒了——主业才是大多数人最大的现金流资产',
    ],
    tips: ['遵守"闲钱投资"原则：不影响生活的钱才能冒险', '设置止损线，亏损到达比例无条件离场', '分散配置，不要把所有鸡蛋放在一个篮子里'],
    color: '#f59e0b',
    rarity: '12%',
    lucky: { color: '钛银灰', number: '1、9', habit: '每周投资复盘', career: '行业资讯与自媒体' },
    wealthGuide: {
      short: [
        '检查持仓集中度：单一标的占比不超过30%，今天就开始调（依据：分散化是唯一的"免费午餐"）',
        '把止损线白纸黑字写下来贴在屏幕边——承诺装置能对抗侥幸心理',
        '盘点本周花在"研究机会"上的真实小时数，如果超过主业，警示灯已亮',
      ],
      month: [
        '建立投资复盘日记：记录每笔决策的"理由"而非"结果"，三个月后回看胜率才真实',
        '配置一层稳定收益打底仓（货基/债基），让冒险的钱有安全垫',
        '砍掉一个投入产出比最低的搞钱方向——聚焦本身就是收益率',
      ],
      long: [
        '理解"慢即是快"：频繁操作的年化收益大多跑不赢老实定投（依据：行为金融学——过度交易是散户亏损首因）',
        '建立能力圈意识：只赚认知内的钱，圈外的风口与你无关',
        '用制度代替判断：定投+年度再平衡，把择时交给纪律',
      ],
    },
  },
  hoarder: {
    emoji: '🏠',
    name: '囤粮型',
    tag: '稳扎稳打 · 长期主义者',
    desc: '你是那种"买房前把楼盘周边规划查个底朝天"的人。记账、做预算、算收益率，一样不落。你的钱可能不算多，但每一分都有名字：首付的、娃的教育金、爸妈的养老钱。日子未必刺激，但越过越稳。',
    advantages: [
      '有规划的人十年后的净资产，普遍是没有规划的人的好几倍——你不是在存钱，是在执行计划',
      '家里出大事不慌：应急金、保险、备用卡都是现成的',
      '目标感强的人也更少被"伪需求"收割，你买东西前心里都有一杆秤',
    ],
    traps: [
      '把"稳"理解成"不动"：全家存款就趴活期，看着安全，其实每年都在被通胀稀释',
      '对自己太狠：全家旅行能推就推，衣服穿到起球，钱攒下了，生活的滋味少了',
      '只认工资和存款，不愿意了解任何理财工具，错过了时间这个最大的盟友',
    ],
    tips: ['把大目标拆成可执行的月度小目标', '配置一部分稳健增值资产（债券、固收+、年金）', '允许自己为"当下幸福"花钱，储蓄不是惩罚'],
    color: '#10b981',
    rarity: '20%',
    lucky: { color: '墨绿色', number: '2、5', habit: '每月预算会议', career: '知识付费与课程' },
    wealthGuide: {
      short: [
        '算一次家庭"财务自由度"：被动收入 ÷ 总支出，这个数字每提高0.1，你就自由一分',
        '给最大的那个储蓄目标（房/教育/养老）开一个专门账户，视觉化的进度条会加倍动力',
        '检查应急金是否覆盖6个月支出——这是你所有规划的底盘',
      ],
      month: [
        '系统学习一套资产配置框架（如股债平衡），让稳健的钱也有章法地增长',
        '设一个"享受预算"并强制花掉它——储蓄是对未来的责任，享受是对现在的责任',
        '和伴侣/家人开一次正式的家庭财务会议，对齐目标比埋头存钱更重要',
      ],
      long: [
        '接受合理的通胀损耗：全部的钱都躺在活期，等于每年确定亏2-3%',
        '教育金和养老金越早启动越轻松——18年为孩子存的每一万元，都带着时间的复利',
        '练习"花在体验上的钱不打折"：旅行、学习、健康是抗通胀的支出',
      ],
    },
  },
  hustler: {
    emoji: '🚀',
    name: '搞钱型',
    tag: '永远有Plan B · 斜杠青年',
    desc: '上班是你的现金流，下班后的世界才是你的财富实验场。你可能挂着闲鱼店铺、剪着短视频、接着私单，或者在研究哪个平台还有红利。你不怕累，怕的是只有一条收入来源。',
    advantages: [
      '抗风险能力拉满：大环境裁掉谁，你都还有 Plan B 在跑',
      '学东西快、动手快，这种执行力放在哪个赛道都能跑出结果',
      '见过足够多的赚钱方式，你对"什么能变现"的判断越来越准',
    ],
    traps: [
      '摊子铺太大：五个副业各赚三百，不如一个副业做透——时间才是你最稀缺的本金',
      '为"搞钱"交的学费越攒越多：课买了一堆、社群进了一堆，真正落地的没几个',
      '收入不稳定又没存下钱的话，一旦副业断档，生活立刻断电',
    ],
    tips: ['选出1-2个最有潜力的方向深耕，不要什么都做', '建立"收入仪表盘"，清楚每份副业的投入产出比', '至少保留3-6个月生活费的应急储备'],
    color: '#3b82f6',
    rarity: '17%',
    lucky: { color: '活力橙', number: '3、8', habit: '晨间规划一小时', career: '技能变现型副业' },
    wealthGuide: {
      short: [
        '列出所有副业并算出各自的"时薪"，今天就砍掉时薪最低的那个（依据：机会成本思维）',
        '把碎片化的接单时间聚焦成一个"主项目"，每天雷打不动推进2小时',
        '用3个月里程碑代替每日目标——副业死于焦虑，成于节奏',
      ],
      month: [
        '建立"收入仪表盘"：每个副业的投入时长、收入、增长率，一张表看清全部',
        '每周留一个"深度日"不接杂活，只做能积累复利的事（内容、模板、系统）',
        '存够3个月应急金——它是你敢对烂机会说"不"的底气',
      ],
      long: [
        '深耕胜过广撒网：让一项技能长出复利，远胜十个浅尝辄止的方向',
        '把重复劳动产品化：可复用的课程、模板、工具，才是睡后收入的真身',
        '把健康视为第一本金——你才是自己最大的资产，别的都是衍生品',
      ],
    },
  },
  squirrel: {
    emoji: '🐿️',
    name: '松鼠型',
    tag: '焦虑驱动 · 储蓄狂',
    desc: '你的银行卡余额可能不算少，但你睡得不算好。刷到"35岁被优化"、看到同事买房、听说谁谁副业月入过万，你心里都会咯噔一下。存钱对你来说不是目标，是止疼药——只是这药效，越来越短。',
    advantages: [
      '你比别人更早为坏日子做准备：真出事的时候，你的应急金就是你的底气',
      '对债务天然警惕，你几乎不可能掉进网贷、裸贷这种坑',
      '危机意识让你持续学习搞钱技能，长期看这是笔隐形财富',
    ],
    traps: [
      '存款在涨，安全感没涨——因为焦虑的从来不是数字，是"不确定性"本身',
      '省出来的钱没有增值安排，等于用生活质量换一个跑不赢通胀的数字',
      '长期紧绷会让你错过该抓的机会：该跳的槽不敢跳、该投自己的钱不敢投',
    ],
    tips: ['算清"最低安全线"：到底需要多少存款才能安心？', '为焦虑设定"专属预算"：允许自己花一部分钱买心安', '配置保险（医疗、意外、重疾），用制度转移风险'],
    color: '#6b7280',
    rarity: '9%',
    lucky: { color: '大地棕', number: '4、0', habit: '睡前写下担忧', career: '储蓄打卡型内容' },
    wealthGuide: {
      short: [
        '写下一个具体数字回答"到底多少存款才安心"——模糊的恐惧最耗人，数字会还你平静（依据：具名化情绪可降低杏仁核活跃度）',
        '今天花50元买一次纯粹的快乐，并记录感受——练习"值得感"本身就是理财',
        '配置一份百万医疗险：几百元转移掉你最大的那个恐惧来源',
      ],
      month: [
        '练习"预算内挥霍"：每周一次，在预算里痛快花，不带愧疚',
        '把焦虑装进"担忧时间"：每天固定15分钟专门焦虑，其余时间出现就记下来留到那时候',
        '和一位信任的朋友聊一次彼此的金钱观——焦虑常在比较中生长，也在倾诉中瓦解',
      ],
      long: [
        '理解安全感的三根支柱：健康、关系、能力——存款只是其中一根',
        '建立多元支撑系统后，你会发现钱开始为你工作，而不是你为钱站岗',
        '允许自己享受已拥有的一切：守财的最高境界，是让守住的财真正滋养生活',
      ],
    },
  },
  face: {
    emoji: '👑',
    name: '面子富豪型',
    tag: '精致穷 · 社交达人',
    desc: '你出门永远体面：手机新款、穿搭有型、聚餐买单不眨眼。朋友圈里你是"混得不错"的那一个。只有你自己知道，账单日的花呗和信用卡分期，才是这份体面背后的真实成本。',
    advantages: [
      '形象就是竞争力——同样的能力，会打扮的人第一印象分天然更高，机会也更多',
      '饭局、圈子、人脉你都维护得好，很多机会就是饭桌上来的',
      '对品质有追求的人，做起跟"生活方式"相关的副业（探店、穿搭、带货）有天然优势',
    ],
    traps: [
      '收入 8 千过着 2 万的日子，中间的差额全在花呗和分期里——分期年化利率普遍 15% 起步，越滚越厚',
      '份子钱、请客、人情没有上限，一个月算下来可能吃掉小一半收入',
      '朋友圈点赞是真金白银换的，点赞换不来存款',
    ],
    tips: ['区分"我需要"和"别人觉得我需要有"', '建立"社交预算"：份子钱、饭局、礼物都有上限', '投资真正提升能力的项目，而不是外在标签'],
    color: '#f43f5e',
    rarity: '8%',
    lucky: { color: '香槟金', number: '5、6', habit: '消费前深呼吸', career: '探店与形象顾问' },
    wealthGuide: {
      short: [
        '本周聚餐主动提一次AA——你会发现真朋友根本不在意（依据：聚光灯效应——别人对你的关注远比你以为的少）',
        '盘点所有分期账单，算出真实年化利率——15%的分期不是分期，是负债',
        '取关3个制造焦虑的博主：你的"不够好"感，很多是被精心设计出来的',
      ],
      month: [
        '建立"社交预算"上限：份子钱、饭局、礼物的月度总额，超线即止',
        '练习一次诚实的拒绝："这个预算这个月满了"——世界不会因此崩塌',
        '把一笔原计划的面子消费转为定投——体面的最高级形式是账户余额',
      ],
      long: [
        '严格区分"我需要"和"人设需要"：前者滋养你，后者消耗你',
        '用能力建立身份而非消费：三年后人们记住的是你做成的事，不是你背的包',
        '理解长期主义是最大的体面：从容的财务状态，比任何logo都更有气场',
      ],
    },
  },
};

// ===== 状态 =====
let currentQuestionIndex = 0;
let answers = new Array(questions.length).fill(null);
let currentPassword = '';
let chartInstance = null;

// ===== DOM 元素 =====
const pages = {
  login: document.getElementById('login-page'),
  quiz: document.getElementById('quiz-page'),
  result: document.getElementById('result-page'),
  image: document.getElementById('image-page'),
};

const passwordInput = document.getElementById('password-input');
const startBtn = document.getElementById('start-btn');
const loginError = document.getElementById('login-error');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const progressText = document.getElementById('progress-text');
const progressPercent = document.getElementById('progress-percent');
const progressBar = document.getElementById('progress-bar');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const resultCard = document.getElementById('result-card');
const saveImgBtn = document.getElementById('save-img-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');
const retryBtn = document.getElementById('retry-btn');
const reviewBtn = document.getElementById('review-btn');
const reviewModal = document.getElementById('review-modal');
const closeReviewBtn = document.getElementById('close-review-btn');

const toast = document.getElementById('toast');

// ===== 页面切换 =====
function showPage(pageName) {
  Object.values(pages).forEach(page => page.classList.remove('active'));
  pages[pageName].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 密码验证 =====
const PASSWORD_MAX_USES = 3;
const PASSWORD_STORAGE_KEY = 'fortune_test_counts_v2';

function getPasswordCounts() {
  try {
    return JSON.parse(localStorage.getItem(PASSWORD_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function savePasswordCounts(counts) {
  localStorage.setItem(PASSWORD_STORAGE_KEY, JSON.stringify(counts));
}

function showLoginError(msg) {
  loginError.textContent = msg;
  loginError.classList.remove('hidden');
}

let isVerifying = false;

function checkPassword() {
  if (isVerifying) return;
  const pwd = passwordInput.value.trim();
  if (!pwd) {
    showLoginError('请输入密钥');
    return;
  }

  isVerifying = true;
  const originalText = startBtn.textContent;
  startBtn.textContent = '验证中...';
  startBtn.disabled = true;
  loginError.classList.add('hidden');

  Promise.resolve()
    .then(() => {
      if (getSupabaseClient()) {
        return verifyWithSupabase(pwd);
      }
      return verifyWithLocalStorage(pwd);
    })
    .then(ok => {
      if (ok) {
        currentPassword = pwd;
        enterQuiz();
      }
    })
    .catch(() => showLoginError('网络异常，请稍后重试'))
    .finally(() => {
      isVerifying = false;
      startBtn.textContent = originalText;
      startBtn.disabled = false;
    });
}

function enterQuiz() {
  // 重置答题状态
  currentQuestionIndex = 0;
  answers = new Array(questions.length).fill(null);

  showPage('quiz');
  renderQuestion();
}

// 在线模式：调用 Supabase use_card 原子验证并扣减次数
async function verifyWithSupabase(pwd) {
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('use_card', { p_code: pwd });
  if (error) {
    showLoginError('网络异常，请稍后重试');
    return false;
  }
  if (!data.ok) {
    showLoginError(data.message);
    return false;
  }
  return true;
}

// 降级模式：本地 localStorage 计数（Supabase 未配置/离线时）
function verifyWithLocalStorage(pwd) {
  const counts = getPasswordCounts();
  const used = counts[pwd] || 0;
  if (used >= PASSWORD_MAX_USES) {
    showLoginError('该密钥已使用 3 次，请更换新密钥或联系客服');
    return false;
  }
  counts[pwd] = used + 1;
  savePasswordCounts(counts);
  return true;
}

// ===== 答题渲染 =====
function renderQuestion() {
  const q = questions[currentQuestionIndex];
  questionText.textContent = `${currentQuestionIndex + 1}. ${q.text}`;
  
  optionsContainer.innerHTML = '';
  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    if (answers[currentQuestionIndex] === opt.value) {
      btn.classList.add('selected');
    }
    btn.innerHTML = `
      <span class="option-number">${idx + 1}</span>
      <span>${opt.label}</span>
    `;
    btn.addEventListener('click', () => selectOption(opt.value));
    optionsContainer.appendChild(btn);
  });

  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  progressText.textContent = `第 ${currentQuestionIndex + 1} / ${questions.length} 题`;
  progressPercent.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? '查看结果' : '下一题';
  nextBtn.disabled = answers[currentQuestionIndex] === null;
}

function selectOption(value) {
  answers[currentQuestionIndex] = value;
  renderQuestion(); // 更新选中状态
  
  // 自动进入下一题（最后一题不自动）
  if (currentQuestionIndex < questions.length - 1) {
    setTimeout(() => {
      currentQuestionIndex++;
      renderQuestion();
    }, 200);
  }
}

function goNext() {
  if (answers[currentQuestionIndex] === null) return;
  if (currentQuestionIndex === questions.length - 1) {
    showResult();
  } else {
    currentQuestionIndex++;
    renderQuestion();
  }
}

function goPrev() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
}

// ===== 计分与结果匹配 =====
function calculateScores() {
  const scores = {
    sav: 0, imp: 0, ris: 0, hus: 0, face: 0, anx: 0,
  };
  const counts = {
    sav: 0, imp: 0, ris: 0, hus: 0, face: 0, anx: 0,
  };

  questions.forEach((q, idx) => {
    const rawValue = answers[idx];
    const score = q.reverse ? (6 - rawValue) : rawValue;
    scores[q.dimension] += score;
    counts[q.dimension] += 1;
  });

  // 转换为百分比
  const percentScores = {};
  Object.keys(scores).forEach(key => {
    percentScores[key] = Math.round((scores[key] / (counts[key] * 5)) * 100);
  });

  return percentScores;
}

function matchType(scores) {
  // 规则：
  // 1. 如果 imp 和 face 都高，优先面子富豪
  // 2. 否则取最高维度匹配
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = sorted[0][0];
  const second = sorted[1][0];

  // 特殊组合判断
  if (scores.imp >= 60 && scores.face >= 60 && scores.imp + scores.face >= scores[top] * 1.5) {
    return 'face';
  }
  if (scores.sav >= 70 && scores.anx >= 60 && top === 'sav') {
    return 'squirrel';
  }
  if (scores.ris >= 60 && scores.hus >= 60 && (top === 'ris' || top === 'hus')) {
    return 'hunter';
  }
  if (scores.hus >= 60 && top === 'hus') {
    return 'hustler';
  }

  // 单一维度匹配
  switch (top) {
    case 'sav':
      return scores.sav >= 75 ? 'pixiu' : 'hoarder';
    case 'imp':
      return 'scatter';
    case 'ris':
      return 'hunter';
    case 'hus':
      return 'hustler';
    case 'anx':
      return 'squirrel';
    case 'face':
      return 'face';
    default:
      return 'hoarder';
  }
}

// ===== 结果展示 =====
const dimensionMeta = {
  sav: { label: '储蓄定力', color: '#8b5cf6', light: '#c4b5fd', comment: score => score >= 70 ? '存钱小能手，安全感自己给' : score >= 40 ? '储蓄基本盘稳定，还能再进化' : '钱留不住，先从强制储蓄开始' },
  imp: { label: '消费冲动', color: '#ec4899', light: '#f9a8d4', comment: score => score >= 70 ? '剁手达人，钱包需要冷静期' : score >= 40 ? '偶尔冲动，整体可控' : '消费理性，每一分都花在刀刃上' },
  ris: { label: '风险偏好', color: '#f59e0b', light: '#fcd34d', comment: score => score >= 70 ? '敢闯敢拼，记得系好安全带' : score >= 40 ? '进可攻退可守，均衡型选手' : '稳健至上，吃好睡好最重要' },
  hus: { label: '搞钱动力', color: '#3b82f6', light: '#93c5fd', comment: score => score >= 70 ? '搞钱永动机，注意别烧干自己' : score >= 40 ? '有想法有行动，差一个爆发点' : '躺平任嘲，其实你只差一次开始' },
  face: { label: '面子消费', color: '#eab308', light: '#fde047', comment: score => score >= 70 ? '为体面买单，记得给自己留条后路' : score >= 40 ? '人情消费有度，关系经营在线' : '实用主义者，不被目光绑架' },
  anx: { label: '金钱焦虑', color: '#6b7280', light: '#9ca3af', comment: score => score >= 70 ? '焦虑超标，先安顿好内心再谈理财' : score >= 40 ? '适度警觉是清醒，过度是内耗' : '心态松弛，和钱的关系很健康' },
};

const fortuneLevels = [
  { min: 85, name: '财气冲天 🎉', desc: '你的财运基本盘非常扎实。别飘，按自己的节奏走，钱会越来越听话。' },
  { min: 75, name: '财运亨通 ✨', desc: '钱在你手上是流动的、听话的。守住优势，补一块短板，指数还能再上一档。' },
  { min: 65, name: '稳中有升 📈', desc: '你处在上升通道里，这个阶段拼的不是爆发力，是把动作固定成习惯。' },
  { min: 0, name: '蓄势待发 🌱', desc: '现在的你是标准的潜力股。照着下面的指南做，90天后回来重测一次，对比一下。' },
];

function calculateFortuneIndex(scores) {
  // 储蓄、搞钱加分；冲动、焦虑扣分；风险与面子取"适度"得分（中等最佳）
  let index = 50;
  index += scores.sav * 0.15;
  index += scores.hus * 0.20;
  index += (100 - scores.imp) * 0.15;
  index += (100 - scores.anx) * 0.10;
  index += Math.max(0, 10 - Math.abs(scores.ris - 60) * 0.15);
  index += Math.max(0, 5 - Math.abs(scores.face - 40) * 0.08);
  return Math.min(98, Math.max(55, Math.round(index)));
}

function renderResult(scores, typeKey) {
  const type = resultTypes[typeKey];

  document.getElementById('type-emoji').textContent = type.emoji;
  document.getElementById('type-name').textContent = type.name;
  document.getElementById('type-tag').textContent = type.tag;
  document.getElementById('type-tag').style.color = type.color;
  document.getElementById('type-desc').textContent = type.desc;
  document.getElementById('type-rarity').textContent = `全网仅 ${type.rarity} 的人是这个体质`;

  // 综合财运指数
  const fortuneIndex = calculateFortuneIndex(scores);
  const level = fortuneLevels.find(l => fortuneIndex >= l.min) || fortuneLevels[fortuneLevels.length - 1];
  document.getElementById('fortune-number').textContent = fortuneIndex;
  document.getElementById('fortune-level').textContent = level.name;
  document.getElementById('fortune-level-desc').textContent = level.desc;
  renderFortuneChart(fortuneIndex, type.color);

  // 雷达图
  renderRadarChart(scores, type.color);

  // 评分条
  renderScoreBars(scores);

  // 解读
  fillList('type-advantages', type.advantages);
  fillList('type-traps', type.traps);

  // 财运提升指南
  fillList('guide-short', type.wealthGuide.short);
  fillList('guide-month', type.wealthGuide.month);
  fillList('guide-long', type.wealthGuide.long);

  // 开运锦囊
  document.getElementById('lucky-color').textContent = type.lucky.color;
  document.getElementById('lucky-number').textContent = type.lucky.number;
  document.getElementById('lucky-habit').textContent = type.lucky.habit;
  document.getElementById('lucky-career').textContent = type.lucky.career;
}

function showResult() {
  const scores = calculateScores();
  const typeKey = matchType(scores);
  renderResult(scores, typeKey);
  showPage('result');
}

function renderScoreBars(scores) {
  const container = document.getElementById('score-bars');
  container.innerHTML = '';
  Object.keys(dimensionMeta).forEach(key => {
    const meta = dimensionMeta[key];
    const score = scores[key];
    const item = document.createElement('div');

    const labelRow = document.createElement('div');
    labelRow.className = 'flex justify-between items-baseline mb-1.5';
    labelRow.innerHTML = `
      <span class="text-xs text-gray-600 font-medium">${meta.label}</span>
      <span class="text-xs font-bold" style="color:${meta.color}">${score} 分 · ${meta.comment(score)}</span>
    `;

    const track = document.createElement('div');
    track.className = 'score-bar-track';
    const fill = document.createElement('div');
    fill.className = 'score-bar-fill';
    fill.style.width = `${score}%`;
    fill.style.background = `linear-gradient(90deg, ${meta.light}, ${meta.color})`;
    track.appendChild(fill);

    item.appendChild(labelRow);
    item.appendChild(track);
    container.appendChild(item);
  });
}

let fortuneChartInstance = null;

function renderFortuneChart(fortuneIndex, color) {
  const ctx = document.getElementById('fortune-chart').getContext('2d');
  if (fortuneChartInstance) {
    fortuneChartInstance.destroy();
  }

  fortuneChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [fortuneIndex, 100 - fortuneIndex],
        backgroundColor: [color, '#f0e8d2'],
        borderWidth: 0,
        circumference: 360,
        cutout: '78%',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      animation: { animateRotate: true, duration: 1000 },
    },
  });
}

function fillList(elementId, items) {
  const el = document.getElementById(elementId);
  el.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    el.appendChild(li);
  });
}

function renderRadarChart(scores, color) {
  const ctx = document.getElementById('radar-chart').getContext('2d');
  if (chartInstance) {
    chartInstance.destroy();
  }

  const c = color || '#8b5cf6';
  chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['储蓄', '消费冲动', '风险偏好', '搞钱动力', '面子消费', '金钱焦虑'],
      datasets: [{
        label: '财运体质',
        data: [scores.sav, scores.imp, scores.ris, scores.hus, scores.face, scores.anx],
        backgroundColor: c + '33',
        borderColor: c,
        pointBackgroundColor: c,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: c,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            display: false,
          },
          pointLabels: {
            font: { size: 11 },
            color: '#8a7a58',
          },
          grid: { color: '#eee3c8' },
          angleLines: { color: '#eee3c8' },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}

// ===== 保存图片 =====
async function generateResultImage() {
  showToast('正在生成图片，请稍候...');
  try {
    const canvas = await html2canvas(document.getElementById('result-card'), {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const container = document.getElementById('generated-image-container');
    container.innerHTML = `<img src="${dataUrl}" alt="财运体质测试结果" class="w-full h-auto">`;

    // 绑定下载按钮
    const downloadBtn = document.getElementById('download-img-btn');
    downloadBtn.onclick = () => {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `财运体质测试结果_${Date.now()}.png`;
      link.click();
    };

    showPage('image');
  } catch (err) {
    console.error(err);
    showToast('图片生成失败，请重试');
  }
}

// ===== 复制链接 =====
function copyResultLink() {
  const scores = calculateScores();
  const typeKey = matchType(scores);
  const type = resultTypes[typeKey];
  
  // 生成分享链接（如果是本地文件，则复制当前路径+参数）
  const url = new URL(window.location.href);
  url.searchParams.set('type', typeKey);
  url.searchParams.set('scores', `${scores.sav},${scores.imp},${scores.ris},${scores.hus},${scores.face},${scores.anx}`);
  
  const shareText = `我的财运体质是【${type.name}】${type.tag}，快来测测你是什么型！ ${url.toString()}`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      showToast('结果链接已复制，快去分享吧！');
    }).catch(() => {
      fallbackCopy(shareText);
    });
  } else {
    fallbackCopy(shareText);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showToast('结果链接已复制');
}

// ===== 再测一次 =====
function retryTest() {
  currentQuestionIndex = 0;
  answers = new Array(questions.length).fill(null);
  showPage('quiz');
  renderQuestion();
}

// ===== 问题反馈弹窗 =====
function openReviewModal() {
  reviewModal.classList.remove('hidden');
  reviewModal.classList.add('flex');
}

function closeReviewModal() {
  reviewModal.classList.add('hidden');
  reviewModal.classList.remove('flex');
}

// ===== Toast =====
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}

// ===== URL 参数读取（分享链接回显）=====
function loadFromUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const typeKey = params.get('type');
  const scoresStr = params.get('scores');
  
  if (typeKey && resultTypes[typeKey] && scoresStr) {
    const scoresArr = scoresStr.split(',').map(Number);
    if (scoresArr.length === 6) {
      const scores = {
        sav: scoresArr[0],
        imp: scoresArr[1],
        ris: scoresArr[2],
        hus: scoresArr[3],
        face: scoresArr[4],
        anx: scoresArr[5],
      };
      // 直接显示结果
      renderResult(scores, typeKey);
      showPage('result');
      return true;
    }
  }
  return false;
}

// ===== 事件绑定 =====
startBtn.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkPassword();
});

prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);

saveImgBtn.addEventListener('click', generateResultImage);
copyLinkBtn.addEventListener('click', copyResultLink);
retryBtn.addEventListener('click', retryTest);
reviewBtn.addEventListener('click', openReviewModal);
closeReviewBtn.addEventListener('click', closeReviewModal);
reviewModal.addEventListener('click', (e) => {
  if (e.target === reviewModal) closeReviewModal();
});

document.getElementById('back-result-btn').addEventListener('click', () => {
  showPage('result');
});

// ===== 初始化 =====
if (!loadFromUrlParams()) {
  showPage('login');
}
