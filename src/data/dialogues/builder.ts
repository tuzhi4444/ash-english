// 对话的紧凑写法
import type { Dialogue, DialogueTurn } from '../../types';

/** 对方说的一句：[英文, 中文] */
export type P = ['p', string, string];
/** 你要说的一句：[英文参考说法, 中文, 你此刻要表达什么] */
export type Y = ['y', string, string, string];

export type T = P | Y;

/**
 * 造一个对话场景。
 *
 * 写法：d(phase, id, 标题, 情境, [ ['p', 英, 中], ['y', 英, 中, 意图], … ])
 *
 * 'y' 轮多一个「意图」字段，是给用户看的提示。之所以不直接把中文译文当提示：
 * 看着中文译英，练的是翻译；看着「答不用，你自己带了袋子」去组句，练的才是表达。
 * 英文只是一种参考说法，不是标准答案——对话本来就没有标准答案。
 */
export function d(
  phase: 1 | 2 | 3,
  id: string,
  title: string,
  scene: string,
  turns: T[]
): Dialogue {
  return {
    id,
    phase,
    title,
    scene,
    turns: turns.map((t): DialogueTurn =>
      t[0] === 'p'
        ? { speaker: 'partner', en: t[1], zh: t[2] }
        : { speaker: 'you', en: t[1], zh: t[2], intent: t[3] }
    ),
  };
}

/** 一个对话里你要接几次话 —— 配额按接话轮数算，不按篇数 */
export function countYourTurns(dlg: Dialogue): number {
  return dlg.turns.filter((t) => t.speaker === 'you').length;
}
