// 听辨题的中文选项生成
import type { Word } from '../types';
import { WORDS } from '../data/words';

/**
 * 1 个正确释义 + 3 个同词性干扰项，打乱后返回。
 * 同词性词不够时用全库补足。
 */
export function buildMeaningOptions(target: Word, count = 4): string[] {
  const pool = WORDS.filter((w) => w.pos === target.pos && w.en !== target.en);
  const fallback = WORDS.filter((w) => w.en !== target.en);
  const source = pool.length >= count - 1 ? pool : fallback;

  const distractors = new Set<string>();
  let guard = 0;
  while (distractors.size < count - 1 && guard < 200) {
    const pick = source[Math.floor(Math.random() * source.length)];
    if (pick && pick.exampleZh !== target.exampleZh) distractors.add(pick.exampleZh);
    guard++;
  }

  const options = [target.exampleZh, ...distractors];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}
