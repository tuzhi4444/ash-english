// 对话场景总表
import type { Dialogue } from '../../types';
import { PHASE1_DIALOGUES } from './phase1';
import { PHASE2_DIALOGUES } from './phase2';
import { PHASE3_DIALOGUES } from './phase3';

export const DIALOGUES: Dialogue[] = [
  ...PHASE1_DIALOGUES,
  ...PHASE2_DIALOGUES,
  ...PHASE3_DIALOGUES,
];

/** 该阶段及之前解锁的所有对话——低阶场景不会因为升阶就用不上了 */
export function getUnlockedDialogues(phase: 1 | 2 | 3): Dialogue[] {
  return DIALOGUES.filter((dlg) => dlg.phase <= phase);
}

export { countYourTurns } from './builder';
