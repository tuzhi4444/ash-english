// 短文的紧凑写法 + 选项打乱
import type { Passage, PassageQuestion } from '../../types';

/** 一句：[英文, 中文] */
export type Line = [string, string];
/** 一题：[题干, [正确选项, 干扰1, 干扰2, 干扰3]] —— 正确的永远写在第一个 */
export type Quiz = [string, string[]];

/**
 * 造一篇短文。
 *
 * 约定：题目选项的第一个永远是正确答案，写的时候不用操心顺序。
 * 展示前会由 shuffleOptions 打乱——正确答案恒在首位是致命的，
 * 一路点第一个就能满分，听力测试直接失效。
 */
export function p(phase: 1 | 2 | 3, id: string, title: string, lines: Line[], quizzes: Quiz[]): Passage {
  return {
    id,
    phase,
    title,
    lines: lines.map((l) => l[0]),
    linesZh: lines.map((l) => l[1]),
    source: 'builtin',
    questions: quizzes.map(([q, options]) => ({ q, options, answer: 0 })),
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 打乱一篇短文里每道题的选项，并把 answer 重新指向正确项。
 *
 * 在选中篇目时调用（而不是模块加载时）：这样同一篇重练也会换顺序，
 * 记住的是"哪句对"而不是"点第几个"。
 */
export function shuffleOptions(passage: Passage): Passage {
  return {
    ...passage,
    questions: passage.questions.map((q): PassageQuestion => {
      const correct = q.options[q.answer];
      const options = shuffle(q.options);
      return { ...q, options, answer: options.indexOf(correct) };
    }),
  };
}
