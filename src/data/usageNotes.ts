// 多义词用法详解。单独成文件，便于逐批复审与扩充；键为 word.en 的小写。
// 只给高频多义词做（介词、核心动词、助词性副词、少数多义名词/形容词），
// 单义词（hospital / panda）不做——加了是噪音。
//
// 结构：core = 一句话核心意象；senses = 各义项，每项一个用法标签 + 例句 + 中文。
// 例句尽量给"词块"（thanks for / for now），因为母语者脑子里存的是块不是词。

export interface UsageSense {
  /** 用法标签，如「给谁 / 对象」 */
  use: string;
  en: string;
  zh: string;
}
export interface UsageNote {
  /** 核心意象：抓住它，各义项就串起来了 */
  core: string;
  senses: UsageSense[];
}

export const USAGE_NOTES: Record<string, UsageNote> = {
  for: {
    core: '指向一个对象 / 目标——指向谁、指向多久、指向为了什么',
    senses: [
      { use: '给谁 / 对象', en: 'This gift is for you.', zh: '这礼物是给你的。' },
      { use: '持续多久（和"为了"无关）', en: 'I waited for two hours.', zh: '我等了两个小时。' },
      { use: '目的 / 为了', en: 'I did it for money.', zh: '我为了钱才做的。' },
      { use: '换取 / 价格', en: 'I bought it for ten euros.', zh: '我花十欧买的。' },
      { use: '因为 / 就……而言', en: 'Thanks for your help.', zh: '谢谢你的帮忙。' },
    ],
  },
  to: {
    core: '朝向并到达一个终点——方向、对象、或程度的终点',
    senses: [
      { use: '去往 / 方向', en: 'I go to school.', zh: '我去学校。' },
      { use: '给谁', en: 'Give it to me.', zh: '给我。' },
      { use: '不定式标记（to + 动词原形）', en: 'I want to eat.', zh: '我想吃东西。' },
      { use: '到……为止', en: 'from nine to five', zh: '从九点到五点' },
      { use: '对……来说', en: "It's important to me.", zh: '这对我很重要。' },
    ],
  },
  on: {
    core: '附着在表面之上，引申为"进行中、关于"',
    senses: [
      { use: '在……上面', en: 'The book is on the table.', zh: '书在桌子上。' },
      { use: '某天 / 日期', en: 'on Monday', zh: '在周一' },
      { use: '关于', en: 'a book on animals', zh: '一本关于动物的书' },
      { use: '开着 / 进行中', en: 'The light is on.', zh: '灯开着。' },
      { use: '靠……维生 / 依赖', en: 'live on rice', zh: '靠米饭生活' },
    ],
  },
  get: {
    core: '获得，或"到达某个状态"——英语最万能的动词之一',
    senses: [
      { use: '得到 / 拿到', en: 'I got a new job.', zh: '我找到了新工作。' },
      { use: '变得（get + 形容词）', en: "It's getting cold.", zh: '天变冷了。' },
      { use: '到达', en: 'I get home at six.', zh: '我六点到家。' },
      { use: '听懂 / 明白', en: "I don't get it.", zh: '我没听懂。' },
      { use: '让……做 / 使', en: 'I got the car fixed.', zh: '我把车修好了。' },
    ],
  },
  take: {
    core: '拿取、带走，引申为"花费、接受、乘坐"',
    senses: [
      { use: '拿 / 带', en: 'Take your umbrella.', zh: '带上你的伞。' },
      { use: '花费（时间）', en: 'It takes an hour.', zh: '要花一个小时。' },
      { use: '乘坐', en: 'take the bus', zh: '坐公交车' },
      { use: '服用', en: 'take this medicine', zh: '吃这个药' },
      { use: '接受 / 承受', en: "He can't take a joke.", zh: '他开不起玩笑。' },
    ],
  },
  run: {
    core: '跑，引申为"运转、经营、流淌"',
    senses: [
      { use: '跑步', en: 'I run every morning.', zh: '我每天早上跑步。' },
      { use: '运转（机器）', en: 'The engine runs well.', zh: '发动机运转良好。' },
      { use: '经营', en: 'She runs a small shop.', zh: '她经营一家小店。' },
      { use: '流淌', en: 'My nose is running.', zh: '我在流鼻涕。' },
      { use: '要迟到 / 超时', en: "We're running late.", zh: '我们要迟到了。' },
    ],
  },

  // ===== 介词批 =====
  about: {
    core: '围绕一个话题或大致的范围',
    senses: [
      { use: '关于', en: 'a book about animals', zh: '一本关于动物的书' },
      { use: '大约', en: 'about ten people', zh: '大约十个人' },
      { use: '正要（be about to）', en: "I'm about to leave.", zh: '我正要走。' },
    ],
  },
  at: {
    core: '一个精确的点——地点、时刻或目标',
    senses: [
      { use: '在（某地点）', en: 'at the door', zh: '在门口' },
      { use: '在（某时刻）', en: 'at six o’clock', zh: '在六点' },
      { use: '朝向（目标）', en: 'Look at me.', zh: '看着我。' },
      { use: '擅长 / 在某方面', en: 'good at math', zh: '擅长数学' },
    ],
  },
  in: {
    core: '在某个范围之内——空间、时间段、状态',
    senses: [
      { use: '在……里', en: 'in the classroom', zh: '在教室里' },
      { use: '在（月份 / 年 / 长时段）', en: 'in July', zh: '在七月' },
      { use: '……之后（将来）', en: 'in ten minutes', zh: '十分钟后' },
      { use: '穿着 / 用某语言', en: 'in English', zh: '用英语' },
    ],
  },
  of: {
    core: '所属、构成、或与之相关',
    senses: [
      { use: '……的（所属）', en: 'the door of the room', zh: '房间的门' },
      { use: '由……构成 / ……之中', en: 'a cup of tea', zh: '一杯茶' },
      { use: '关于 / 想到', en: 'I often think of you.', zh: '我常想起你。' },
    ],
  },
  by: {
    core: '在旁边、经由某方式、或不迟于某时',
    senses: [
      { use: '在旁边', en: 'sit by the window', zh: '坐在窗边' },
      { use: '乘坐 / 用某方式', en: 'by bus', zh: '坐公交' },
      { use: '被（动作发出者）', en: 'written by her', zh: '由她写的' },
      { use: '不迟于 / 到……为止', en: 'by Friday', zh: '在周五前' },
    ],
  },
  from: {
    core: '一个起点——地点、时间、来源',
    senses: [
      { use: '从……（地点 / 时间）', en: 'from nine to five', zh: '从九点到五点' },
      { use: '来自 / 出自', en: 'a letter from Tom', zh: '汤姆寄来的信' },
      { use: '由……制成 / 区分', en: 'tell right from wrong', zh: '分辨对错' },
    ],
  },
  with: {
    core: '伴随——一起、用、或带有',
    senses: [
      { use: '和……一起', en: 'Come with me.', zh: '跟我来。' },
      { use: '用（工具）', en: 'cut it with a knife', zh: '用刀切' },
      { use: '带有 / 具有', en: 'a girl with long hair', zh: '长头发的女孩' },
    ],
  },
  over: {
    core: '在上方（常带跨越 / 覆盖）、超过、或结束',
    senses: [
      { use: '在……上方 / 越过', en: 'a bridge over the river', zh: '河上的桥' },
      { use: '超过', en: 'over fifty people', zh: '五十多人' },
      { use: '结束了', en: 'The game is over.', zh: '比赛结束了。' },
      { use: '遍及 / 在……期间', en: 'all over the world', zh: '全世界' },
    ],
  },
  under: {
    core: '在下方、少于、或处于某状态之下',
    senses: [
      { use: '在……下面', en: 'under the table', zh: '在桌子底下' },
      { use: '少于 / 未满', en: 'under ten euros', zh: '不到十欧' },
      { use: '处于……之下', en: 'under pressure', zh: '在压力之下' },
    ],
  },
  into: {
    core: '从外进入、发生变化、或撞上',
    senses: [
      { use: '进入', en: 'come into the room', zh: '进入房间' },
      { use: '变成', en: 'cut it into pieces', zh: '切成小块' },
      { use: '撞上', en: 'run into a car', zh: '撞上一辆车' },
    ],
  },
  through: {
    core: '从一端穿到另一端——空间、时间、或手段',
    senses: [
      { use: '穿过', en: 'walk through the park', zh: '穿过公园' },
      { use: '从头到尾', en: 'all through the night', zh: '整整一夜' },
      { use: '通过（手段）', en: 'I heard it through a friend.', zh: '我从一个朋友那儿听说的。' },
    ],
  },
  after: {
    core: '在……之后（时间、顺序），或追随',
    senses: [
      { use: '在……之后', en: 'after dinner', zh: '晚饭后' },
      { use: '追赶 / 追随', en: 'run after the bus', zh: '追公交车' },
      { use: '一个接一个', en: 'day after day', zh: '日复一日' },
    ],
  },
  before: {
    core: '在……之前——时间、位置、或顺序',
    senses: [
      { use: '在……之前（时间）', en: 'before dinner', zh: '晚饭前' },
      { use: '在……前面（位置）', en: 'stand before the class', zh: '站在全班面前' },
      { use: '排在……前', en: 'put family before work', zh: '把家庭放在工作前面' },
    ],
  },
  behind: {
    core: '在……后面——位置、进度、或立场',
    senses: [
      { use: '在……后面', en: 'behind the door', zh: '在门后面' },
      { use: '落后', en: 'behind schedule', zh: '落后于计划' },
      { use: '在背后支持', en: "We're behind you.", zh: '我们支持你。' },
    ],
  },
  around: {
    core: '围绕、在周围、或大约',
    senses: [
      { use: '围绕', en: 'sit around the table', zh: '围着桌子坐' },
      { use: '在附近 / 四处', en: 'look around', zh: '四处看看' },
      { use: '大约', en: 'around ten o’clock', zh: '大约十点' },
    ],
  },
  against: {
    core: '反方向的接触或对抗',
    senses: [
      { use: '反对', en: 'vote against the plan', zh: '投票反对这个计划' },
      { use: '靠着', en: 'lean against the wall', zh: '靠在墙上' },
      { use: '对阵', en: 'play against their team', zh: '和他们队比赛' },
    ],
  },
  along: {
    core: '沿着一条线，或一起（前进）',
    senses: [
      { use: '沿着', en: 'walk along the river', zh: '沿着河走' },
      { use: '一起 / 带着', en: 'bring your sister along', zh: '把你妹妹带上' },
    ],
  },
  across: {
    core: '从一边到另一边，或在对面',
    senses: [
      { use: '穿过', en: 'walk across the road', zh: '穿过马路' },
      { use: '在……对面', en: 'the shop across the street', zh: '街对面的店' },
    ],
  },
  above: {
    core: '在……上方 / 高于',
    senses: [
      { use: '在……上方', en: 'The bird flew above the tree.', zh: '鸟在树的上方飞。' },
      { use: '高于 / 超过', en: 'above average', zh: '高于平均' },
    ],
  },
  below: {
    core: '在……下方 / 低于',
    senses: [
      { use: '在……下方', en: 'the flat below mine', zh: '我楼下的那户' },
      { use: '低于', en: 'below zero', zh: '零度以下' },
    ],
  },
  between: {
    core: '在两者之间——位置或选择',
    senses: [
      { use: '（空间）在……之间', en: 'between the bank and the shop', zh: '在银行和商店之间' },
      { use: '（选择 / 关系）之间', en: 'choose between the two', zh: '在两者之间选' },
    ],
  },

  // ===== 核心动词批 =====
  make: {
    core: '做出、制造，引申"使得、赚得、凑成"',
    senses: [
      { use: '制作', en: 'make a cake', zh: '做蛋糕' },
      { use: '使得（make sb / sth + 形容词）', en: 'It made me happy.', zh: '这让我很开心。' },
      { use: '赚（钱）', en: 'make money', zh: '赚钱' },
      { use: '做出 / 凑成', en: 'make a decision', zh: '做决定' },
    ],
  },
  do: {
    core: '做（万能动作词），也当助动词',
    senses: [
      { use: '做（某事）', en: 'do your homework', zh: '做作业' },
      { use: '助动词（疑问 / 否定）', en: "Do you know? I don't.", zh: '你知道吗？我不知道。' },
      { use: '行 / 够了', en: 'That will do.', zh: '这样就行了。' },
      { use: '从事（工作）', en: 'What do you do?', zh: '你做什么工作？' },
    ],
  },
  have: {
    core: '拥有，引申"吃、经历、让……做"',
    senses: [
      { use: '拥有', en: 'I have a car.', zh: '我有辆车。' },
      { use: '吃 / 喝', en: 'have breakfast', zh: '吃早饭' },
      { use: '经历 / 进行', en: 'have a meeting', zh: '开会' },
      { use: '让 / 使（have sth done）', en: 'have the car fixed', zh: '把车修好' },
    ],
  },
  go: {
    core: '去、离开，引申"变成、进展、运转"',
    senses: [
      { use: '去', en: 'go to school', zh: '去上学' },
      { use: '变成（多指变坏）', en: 'The milk went bad.', zh: '牛奶坏了。' },
      { use: '进展', en: 'How is it going?', zh: '进展如何？' },
      { use: '消失 / 用完', en: 'My money is all gone.', zh: '我的钱都没了。' },
    ],
  },
  come: {
    core: '来（朝说话者），引申"变成、来自"',
    senses: [
      { use: '来', en: 'Come here.', zh: '过来。' },
      { use: '变成 / 实现', en: 'come true', zh: '成真' },
      { use: '来自 / 出自', en: 'She comes from China.', zh: '她来自中国。' },
    ],
  },
  give: {
    core: '给，引申"发出、让步"',
    senses: [
      { use: '给', en: 'Give me the book.', zh: '把书给我。' },
      { use: '发出（动作 / 表情）', en: 'give a speech', zh: '做演讲' },
      { use: '放弃（give up）', en: "Don't give up.", zh: '别放弃。' },
    ],
  },
  see: {
    core: '看见，引申"明白、会面、判断"',
    senses: [
      { use: '看见', en: 'I can see the sea.', zh: '我能看见大海。' },
      { use: '明白', en: 'I see.', zh: '我懂了。' },
      { use: '见（医生）/ 会面', en: 'see a doctor', zh: '看医生' },
      { use: '看看 / 判断', en: "Let's see.", zh: '我们看看吧。' },
    ],
  },
  look: {
    core: '主动地看，或显得',
    senses: [
      { use: '看（look at）', en: 'Look at me.', zh: '看着我。' },
      { use: '看起来 / 显得', en: 'You look tired.', zh: '你看起来很累。' },
      { use: '寻找（look for）', en: 'look for my keys', zh: '找我的钥匙' },
      { use: '当心（look out）', en: 'Look out!', zh: '小心！' },
    ],
  },
  put: {
    core: '放置，引申"表达、使处于某状态"',
    senses: [
      { use: '放', en: 'put it on the table', zh: '放桌上' },
      { use: '穿上（put on）', en: 'put on your coat', zh: '穿上外套' },
      { use: '推迟（put off）', en: 'put off the meeting', zh: '推迟会议' },
      { use: '表达', en: 'to put it simply', zh: '简单来说' },
    ],
  },
  keep: {
    core: '保持、留住',
    senses: [
      { use: '保持（某状态）', en: 'keep quiet', zh: '保持安静' },
      { use: '留着 / 保存', en: 'You can keep it.', zh: '你可以留着。' },
      { use: '继续（keep doing）', en: 'keep trying', zh: '不断尝试' },
      { use: '饲养', en: 'keep a dog', zh: '养狗' },
    ],
  },
  turn: {
    core: '转动、转向，引申"变成"',
    senses: [
      { use: '转 / 拐', en: 'turn left', zh: '左转' },
      { use: '开 / 关（turn on/off）', en: 'turn on the light', zh: '开灯' },
      { use: '变成（turn into）', en: 'turn red', zh: '变红' },
      { use: '轮到（名词）', en: "It's your turn.", zh: '轮到你了。' },
    ],
  },
  hold: {
    core: '握住、保持、容纳',
    senses: [
      { use: '拿着 / 握', en: 'Hold my hand.', zh: '握着我的手。' },
      { use: '容纳', en: 'The room holds fifty.', zh: '这房间能容纳五十人。' },
      { use: '举办', en: 'hold a party', zh: '办派对' },
      { use: '稍等（hold on）', en: 'Hold on a second.', zh: '稍等一下。' },
    ],
  },
  break: {
    core: '弄断、打破，引申"中断、违反"',
    senses: [
      { use: '弄坏 / 打破', en: 'break the glass', zh: '打碎玻璃杯' },
      { use: '休息（名词 a break）', en: 'take a break', zh: '休息一下' },
      { use: '违反', en: 'break the rules', zh: '违反规则' },
      { use: '出故障（break down）', en: 'The car broke down.', zh: '车抛锚了。' },
    ],
  },
  bring: {
    core: '带来（朝说话者），引申"导致"',
    senses: [
      { use: '带来', en: 'Bring your book tomorrow.', zh: '明天带上你的书。' },
      { use: '导致 / 带来（结果）', en: 'Spring brings warm weather.', zh: '春天带来温暖天气。' },
      { use: '抚养 / 提起（bring up）', en: 'bring up a child', zh: '抚养孩子' },
    ],
  },
  set: {
    core: '放置、设定',
    senses: [
      { use: '摆放', en: 'set the table', zh: '摆餐具' },
      { use: '设定', en: 'set the alarm', zh: '定闹钟' },
      { use: '（太阳）落下', en: 'The sun sets in the west.', zh: '太阳从西边落下。' },
      { use: '出发（set off / out）', en: 'We set off early.', zh: '我们很早出发。' },
    ],
  },
  call: {
    core: '呼喊、称呼、打电话',
    senses: [
      { use: '打电话', en: 'Call me later.', zh: '晚点打给我。' },
      { use: '称呼 / 叫作', en: 'They call him Tom.', zh: '他们叫他汤姆。' },
      { use: '喊 / 叫', en: 'call for help', zh: '呼救' },
    ],
  },
  leave: {
    core: '离开，引申"留下、剩下"',
    senses: [
      { use: '离开', en: 'I leave home at eight.', zh: '我八点出门。' },
      { use: '留下 / 忘带', en: 'I left my bag at home.', zh: '我把包落在家里了。' },
      { use: '剩下', en: 'There are two left.', zh: '还剩两个。' },
      { use: '让……保持', en: 'Leave the door open.', zh: '让门开着。' },
    ],
  },
  let: {
    core: '允许、让',
    senses: [
      { use: '让 / 允许', en: 'Let me help you.', zh: '让我帮你。' },
      { use: '提议（let’s）', en: "Let's go.", zh: '我们走吧。' },
      { use: '出租（英式）', en: 'a room to let', zh: '一间待租的房' },
    ],
  },
  mean: {
    core: '意思是、意味着、打算',
    senses: [
      { use: '意思是', en: 'What does it mean?', zh: '这是什么意思？' },
      { use: '意味着', en: 'This means trouble.', zh: '这意味着麻烦。' },
      { use: '打算（mean to）', en: 'I meant to call you.', zh: '我本想给你打电话。' },
      { use: '认真的', en: 'I mean it.', zh: '我是认真的。' },
    ],
  },
  mind: {
    core: '介意、当心（名词：头脑 / 想法）',
    senses: [
      { use: '介意', en: 'Do you mind if I sit here?', zh: '你介意我坐这吗？' },
      { use: '当心', en: 'Mind the step.', zh: '当心台阶。' },
      { use: '改变主意（名词）', en: 'I changed my mind.', zh: '我改主意了。' },
    ],
  },
  miss: {
    core: '错过、思念、没赶上',
    senses: [
      { use: '想念', en: 'I miss you.', zh: '我想你。' },
      { use: '错过 / 没赶上', en: 'miss the bus', zh: '错过公交' },
      { use: '没击中 / 没听清', en: "I missed what you said.", zh: '我没听清你说的。' },
    ],
  },
  move: {
    core: '移动，引申"搬家、感动"',
    senses: [
      { use: '移动', en: "Don't move.", zh: '别动。' },
      { use: '搬家', en: 'We moved to a new house.', zh: '我们搬进了新房子。' },
      { use: '感动', en: 'The story moved me.', zh: '这故事打动了我。' },
    ],
  },
  pass: {
    core: '经过、传递、通过',
    senses: [
      { use: '经过', en: 'We pass the school every day.', zh: '我们每天经过那所学校。' },
      { use: '递给', en: 'Pass me the salt.', zh: '把盐递给我。' },
      { use: '通过（考试）', en: 'pass the exam', zh: '通过考试' },
      { use: '（时间）流逝', en: 'Time passes quickly.', zh: '时间过得快。' },
    ],
  },
  play: {
    core: '玩、进行（运动）、演奏、扮演',
    senses: [
      { use: '玩', en: 'play games', zh: '玩游戏' },
      { use: '打（球）/ 比赛', en: 'play football', zh: '踢足球' },
      { use: '演奏', en: 'play the piano', zh: '弹钢琴' },
      { use: '扮演 / 播放', en: 'play a small role', zh: '演一个小角色' },
    ],
  },
  point: {
    core: '指向；名词：要点 / 分数 / 意义',
    senses: [
      { use: '指（point at / to）', en: 'point at the door', zh: '指向门' },
      { use: '要点（名词）', en: "That's the point.", zh: '这才是关键。' },
      { use: '分数（名词）', en: 'score five points', zh: '得五分' },
      { use: '意义（名词）', en: "What's the point?", zh: '这有什么意义？' },
    ],
  },
  catch: {
    core: '抓住、赶上、染上',
    senses: [
      { use: '抓住 / 接住', en: 'Catch the ball!', zh: '接住球！' },
      { use: '赶上（交通）', en: 'catch the last bus', zh: '赶上末班车' },
      { use: '染上（病）', en: 'catch a cold', zh: '感冒' },
      { use: '听清', en: "I didn't catch that.", zh: '我没听清。' },
    ],
  },
  pick: {
    core: '挑选、摘、捡（pick up）',
    senses: [
      { use: '挑选', en: 'Pick any card.', zh: '任选一张牌。' },
      { use: '捡起（pick up）', en: 'pick up the pen', zh: '捡起那支笔' },
      { use: '接（人）（pick up）', en: "I'll pick you up at six.", zh: '我六点来接你。' },
    ],
  },
  carry: {
    core: '携带、搬运、支撑',
    senses: [
      { use: '拿 / 提', en: 'carry a heavy bag', zh: '提一个重包' },
      { use: '运送', en: 'The truck carries goods.', zh: '卡车运货。' },
      { use: '继续（carry on）', en: 'carry on working', zh: '继续工作' },
    ],
  },
  fall: {
    core: '落下、倒下，引申"进入某状态"',
    senses: [
      { use: '落下 / 摔倒', en: 'She fell down the stairs.', zh: '她从楼梯上摔下来。' },
      { use: '下降', en: 'Prices fell last month.', zh: '上个月价格下跌了。' },
      { use: '进入某状态（fall asleep / ill）', en: 'fall asleep', zh: '睡着' },
    ],
  },
  stand: {
    core: '站立，引申"忍受"（名词：立场）',
    senses: [
      { use: '站', en: 'Please stand up.', zh: '请站起来。' },
      { use: '位于 / 立着', en: 'The tower stands on a hill.', zh: '塔立在山上。' },
      { use: '忍受（can’t stand）', en: "I can't stand the noise.", zh: '我受不了这噪音。' },
    ],
  },
  watch: {
    core: '观看、看守、当心（名词：手表）',
    senses: [
      { use: '看 / 观看', en: 'watch TV', zh: '看电视' },
      { use: '看守 / 照看', en: 'watch the kids', zh: '看着孩子' },
      { use: '当心', en: 'Watch your step.', zh: '当心脚下。' },
      { use: '手表（名词）', en: 'a new watch', zh: '一块新手表' },
    ],
  },
  meet: {
    core: '遇见、会面，引申"满足"',
    senses: [
      { use: '遇见 / 认识', en: 'Nice to meet you.', zh: '很高兴认识你。' },
      { use: '会合', en: "Let's meet at six.", zh: '我们六点见。' },
      { use: '满足（需求）', en: 'meet the needs', zh: '满足需求' },
    ],
  },
  feel: {
    core: '感觉、触摸、认为',
    senses: [
      { use: '感觉', en: 'I feel tired today.', zh: '我今天觉得累。' },
      { use: '摸起来', en: 'It feels soft.', zh: '摸起来很软。' },
      { use: '认为（feel that）', en: 'I feel you are right.', zh: '我觉得你是对的。' },
    ],
  },
  find: {
    core: '找到、发现、觉得',
    senses: [
      { use: '找到', en: "I can't find my keys.", zh: '我找不到钥匙。' },
      { use: '发现', en: 'I found a mistake.', zh: '我发现了一个错误。' },
      { use: '觉得（find sth + 形容词）', en: 'I find it hard.', zh: '我觉得这很难。' },
    ],
  },
  work: {
    core: '工作，引申"运转、奏效"',
    senses: [
      { use: '工作', en: 'I work in a bank.', zh: '我在银行工作。' },
      { use: '运转 / 好使', en: "The pen doesn't work.", zh: '这笔不好使。' },
      { use: '奏效 / 起作用', en: 'The medicine worked.', zh: '药起作用了。' },
    ],
  },
  change: {
    core: '改变、更换（名词：零钱 / 变化）',
    senses: [
      { use: '改变 / 变化', en: 'The weather changes fast.', zh: '天气变得快。' },
      { use: '更换', en: 'change your clothes', zh: '换衣服' },
      { use: '换乘', en: 'change trains', zh: '换乘火车' },
      { use: '零钱（名词）', en: 'Do you have any change?', zh: '你有零钱吗？' },
    ],
  },
  wear: {
    core: '穿戴（状态），引申"磨损"',
    senses: [
      { use: '穿 / 戴', en: 'wear a coat', zh: '穿外套' },
      { use: '磨损（wear out）', en: 'My shoes wore out.', zh: '我的鞋磨坏了。' },
    ],
  },
};

/** 取某词的用法详解，没有则 null */
export function getUsageNote(en: string): UsageNote | null {
  return USAGE_NOTES[en.toLowerCase()] ?? null;
}
