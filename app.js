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
    desc: '你对金钱有天生的"占有欲"，账户余额上涨本身就是最大的快乐。你可以忍住不买新款手机，但看到存款数字增加会偷偷截图。',
    advantages: ['抗风险能力强，有应急储备', '不容易被消费主义洗脑', '长期复利效果显著'],
    traps: ['过度储蓄导致生活质量下降', '对风险投资过度排斥，财富增值慢', '可能因小失大（舍不得体检、学习、保险）'],
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
    desc: '钱在你手里仿佛有保质期，必须尽快变成好看的衣服、好吃的饭、好玩的体验。你相信"会花钱才会赚钱"，虽然账户经常见底，但生活永远热气腾腾。',
    advantages: ['生活体验丰富，不容易委屈自己', '社交活跃，人脉资源广', '对新鲜事物敏感，有消费趋势判断力'],
    traps: ['月光甚至负债（花呗/信用卡分期）', '囤积大量用不上的东西', '用消费代替真正的情绪调节'],
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
    desc: '你不满足于死工资，股票、基金、副业、币圈、知识付费……哪里有风口，你的眼睛就亮到哪里。你相信风险里藏着机会，亏了也能复盘再战。',
    advantages: ['信息敏感度高，善于发现机会', '敢想敢做，财富增长空间大', '抗挫折能力强，亏了能爬起来'],
    traps: ['把运气当实力，all in 单一标的', '频繁交易，被手续费和情绪收割', '忽视主业，副业变"负业"'],
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
    desc: '你不是不花钱，而是每一笔钱都要花得值。你会记账、做预算、比较收益率，目标是稳稳地过上好日子。买房、养娃、养老是你储蓄的核心动力。',
    advantages: ['规划能力强，家庭财务稳健', '能抵制短期诱惑，坚持长期目标', '适合管理家庭资产、教育金、养老金'],
    traps: ['过度规划导致灵活性差', '对"享受当下"有罪恶感', '可能因过度保守错过合理杠杆机会'],
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
    desc: '你的收入来源永远不止一条：主业、兼职、自媒体、二手闲置、跑腿接单……你信奉"多管道收入"，讨厌把命运押在一份工资上。',
    advantages: ['抗失业能力强', '学习能力和执行力强', '对趋势敏感，容易抓住新机会'],
    traps: ['时间被切碎，主业受影响', '为"机会"支付大量学费和社交成本', '收入不稳定，缺乏安全感'],
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
    desc: '你存了很多钱，但并不快乐。你总是担心生病、失业、意外、通胀……钱对你而言更像"安全垫"，而不是"生活资源"。',
    advantages: ['风险意识极强，准备充分', '不容易陷入债务危机', '对家庭和未来的责任感强'],
    traps: ['焦虑程度与存款数量不成正比', '过度节俭影响身心健康', '可能错过合理消费和投资机会'],
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
    desc: '你看起来过得不错：牌子、打卡、精致生活。但只有自己知道，为了维持体面，信用卡账单和花呗分期有多重。',
    advantages: ['社交能力强，人脉资源丰富', '注重形象管理，容易获得机会', '对生活品质有追求'],
    traps: ['收入与消费水平严重倒挂', '人情支出无底线', '用外在体面掩盖内在焦虑'],
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
  { min: 85, name: '财气冲天 🎉', desc: '你的财运基本盘非常扎实，保持节奏，财富会主动靠近你。' },
  { min: 75, name: '财运亨通 ✨', desc: '财富能量流动顺畅，把优势坚持住，再把短板补一补，指数还能再涨。' },
  { min: 65, name: '稳中有升 📈', desc: '财运处于上升通道，重点是建立系统而不是追求爆发。' },
  { min: 0, name: '蓄势待发 🌱', desc: '现在的你是潜力股——按照指南行动，90天后的指数会让你惊喜。' },
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
        backgroundColor: [color, '#f3f4f6'],
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
            color: '#6b7280',
          },
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

// ===== 好评有礼弹窗 =====
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
