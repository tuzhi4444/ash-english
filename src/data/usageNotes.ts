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
};

/** 取某词的用法详解，没有则 null */
export function getUsageNote(en: string): UsageNote | null {
  return USAGE_NOTES[en.toLowerCase()] ?? null;
}
