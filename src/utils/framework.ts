// 框架造句：选词与答案校验
import type { Framework, FrameworkRecord, SlotType, Word, WordRecord } from '../types';
import { getIngForm, getPastForm, getPresentForm } from './inflect';
import { EXCLUDED_FRAMEWORK_VERBS } from '../data/frameworks';

/** 根据 slotType 取该词的正确形态 */
export function getCorrectAnswer(word: Word, slotType: SlotType): string {
  switch (slotType) {
    case 'infinitive':
      return word.forms?.infinitive ?? word.en;
    case 'present':
      return word.forms?.present ?? getPresentForm(word.en);
    case 'ing':
      return word.forms?.ing ?? getIngForm(word.en);
    case 'past':
      return word.forms?.past ?? getPastForm(word.en);
    case 'pastParticiple':
      return word.forms?.pastParticiple ?? getPastForm(word.en);
    case 'noun':
    case 'adjective':
      return word.en;
  }
}

/**
 * 为框架选一个语义合适的词。
 * 依次按词性 → compatibleTags → 排除已掌握 → 难度上限过滤，逐层放宽以保证有词可选。
 */
export function selectWordForFramework(
  framework: Framework,
  words: Word[],
  records: Record<string, WordRecord>,
  currentPhase: number
): Word | null {
  // 1. 词性过滤
  let candidates = words.filter((w) => w.pos === framework.slotPos);
  if (candidates.length === 0) return null;

  // 1.5 动词框架：剔除被当成独立词条的变位形式（was/goes/made…）与
  //     无法命令、无法"喜欢做"的静态动词（seem/belong/exist…）
  if (framework.slotPos === 'v.') {
    const usable = candidates.filter((w) => !EXCLUDED_FRAMEWORK_VERBS.has(w.en));
    if (usable.length > 0) candidates = usable;
  }

  // 2. 选词收窄：优先用白名单（主语/语义写死的框架），否则退回标签
  //    白名单是人工按语义域策展的，能杜绝"The weather is tough"这类废句
  if (framework.slotWhitelist && framework.slotWhitelist.length > 0) {
    const wl = new Set(framework.slotWhitelist);
    const listed = candidates.filter((w) => wl.has(w.en));
    if (listed.length > 0) candidates = listed;
  } else if (framework.compatibleTags.length > 0) {
    const tagged = candidates.filter((w) =>
      w.tags.some((t) => framework.compatibleTags.includes(t))
    );
    if (tagged.length > 0) candidates = tagged;
  }

  // 3. 排除已掌握的词（全掌握时不收窄）
  const notMastered = candidates.filter((w) => !records[w.en.toLowerCase()]?.mastered);
  if (notMastered.length > 0) candidates = notMastered;

  // 4. 难度不超过当前阶段（无匹配则不收窄）
  const leveled = candidates.filter((w) => w.difficulty <= currentPhase + 1);
  if (leveled.length > 0) candidates = leveled;

  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * 把答案填进模板，并修正不定冠词 a→an。
 * 模板里的冠词是写死的（"There is a {}."），填进元音开头的词就成了
 * "a egg"，得在成句后统一纠正。词库里没有 university/hour 这类
 * "元音字母辅音音"或"辅音字母元音音"的反例，故按首字母判断即可。
 */
export function fillTemplate(template: string, answer: string): string {
  const filled = template.replace('{}', answer);
  return filled.replace(/\b([Aa]) (?=[aeiou])/g, (_m, a: string) =>
    a === 'A' ? 'An ' : 'an '
  );
}

/**
 * 填中文模板。形容词的释义多半带"的"（美丽的 / 奇怪的），
 * 套进"天气很{}。"就成了"天气很美丽的。"——去掉这个多余的"的"。
 * 只对形容词槽处理：名词/动词的释义不该动。
 */
export function fillTemplateZh(templateZh: string, zh: string, slotType: SlotType): string {
  const cleaned = slotType === 'adjective' ? zh.replace(/的$/, '') : zh;
  return templateZh.replace('{}', cleaned);
}

/**
 * 按 Leitner 盒子反向加权抽一个框架：box 越低（越常答错）越容易被抽到。
 *
 * 这里不用 9 级 SRS：SRS_GAPS 走到毕业需要 239 天，而整个计划只有 60 天，
 * 36 个框架每天练 5-10 题本来两三天就轮一遍，长间隔在这个盘子里是空转的。
 * 加权抽取能拿到"薄弱的多练、熟的少练"这个主要收益，且不引入调度机器。
 */
export function selectFramework(
  pool: Framework[],
  records: Record<string, FrameworkRecord>
): Framework | null {
  if (pool.length === 0) return null;

  // box 1..5 → 权重 5..1；没练过的按 box 1 处理，优先亮相
  const weights = pool.map((f) => {
    const box = records[f.id]?.box ?? 1;
    return Math.max(1, 6 - Math.min(5, box));
  });

  const total = weights.reduce((s, w) => s + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/** 第 2 级提示用的形态三选一（含正确答案） */
export function buildFormOptions(word: Word, slotType: SlotType): string[] {
  const correct = getCorrectAnswer(word, slotType);
  const pool = word.forms
    ? [
        word.forms.infinitive,
        word.forms.present,
        word.forms.ing,
        word.forms.past,
        word.forms.pastParticiple,
      ]
    : [word.en, getPresentForm(word.en), getIngForm(word.en)];

  const distractors = Array.from(new Set(pool)).filter((f) => f !== correct);
  // 洗牌后取两个干扰项
  for (let i = distractors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }
  const options = [correct, ...distractors.slice(0, 2)];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}
