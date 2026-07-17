// 连续听力素材：150 篇内置短文 / 对话
//
// 手写而非拼接例句——词库里的例句彼此无关，串起来是语无伦次的。
// 选题按三阶段铺开，主语与句式刻意轮换，避免通篇同一个调子。
import type { Passage } from '../../types';
import { PHASE1 } from './phase1';
import { PHASE2 } from './phase2';
import { PHASE3 } from './phase3';

export { shuffleOptions } from './builder';

export const PASSAGES: Passage[] = [...PHASE1, ...PHASE2, ...PHASE3];

/** 取某阶段及之前解锁的所有短文 */
export function getUnlockedPassages(phase: 1 | 2 | 3): Passage[] {
  return PASSAGES.filter((p) => p.phase <= phase);
}
