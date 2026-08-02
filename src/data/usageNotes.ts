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
};

/** 取某词的用法详解，没有则 null */
export function getUsageNote(en: string): UsageNote | null {
  return USAGE_NOTES[en.toLowerCase()] ?? null;
}
