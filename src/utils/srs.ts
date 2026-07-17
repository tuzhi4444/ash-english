// 艾宾浩斯间隔复习算法（含过载保护）
import type { Word, WordRecord } from '../types';

/** SRS 间隔天数，索引对应 stage */
export const SRS_GAPS = [1, 2, 4, 7, 15, 30, 60, 120, 240];
export const MAX_STAGE = SRS_GAPS.length - 1; // 8

/** 新建一条空记录 */
export function emptyRecord(): WordRecord {
  return {
    seen: false,
    stage: 0,
    due: null,
    mastered: false,
    box: 1,
    favorite: false,
    markedDifficult: false,
    testSkipped: false,
  };
}

/** 取记录，不存在则返回空记录 */
export function getRecord(
  records: Record<string, WordRecord>,
  en: string
): WordRecord {
  return records[en.toLowerCase()] ?? emptyRecord();
}

/** 标记为难词时，复习间隔打的折扣（间隔减半，最少 1 天） */
export const DIFFICULT_GAP_FACTOR = 0.5;

/**
 * 答题后推进记录。
 * 答对 stage+1（到顶则 mastered），答错 stage 归零、明天重来。
 *
 * 用户标记的难词走同一套 stage 推进，但复习间隔减半——它会更频繁地回到队列里，
 * 而不是只在积压超过 maxReviewPerDay 时才被优先照顾（那种情况几个月才出现一次）。
 */
export function reviewWord(
  record: WordRecord,
  correct: boolean,
  calendarDay: number
): WordRecord {
  const next: WordRecord = { ...record, seen: true };
  if (correct) {
    next.stage = Math.min(record.stage + 1, MAX_STAGE);
    next.box = Math.min(record.box + 1, 5);
    const gap = record.markedDifficult
      ? Math.max(1, Math.round(SRS_GAPS[next.stage] * DIFFICULT_GAP_FACTOR))
      : SRS_GAPS[next.stage];
    next.due = calendarDay + gap;
    // 毕业条件对难词一视同仁：mastered 参与掌握率、掌握率又卡阶段推进，
    // 若难词不能毕业，标记难词就会悄悄堵住 Phase 推进——那是用户想不到的副作用
    if (next.stage >= MAX_STAGE) next.mastered = true;
  } else {
    next.stage = 0;
    next.box = 1;
    next.mastered = false;
    next.due = calendarDay + 1;
  }
  return next;
}

/**
 * 词库里是否还有没学过的词。用来判断该不该进维持模式——
 * 维持模式的含义是"没有新词可发了，转为守成"，而不是"到了第 61 天"。
 */
export function hasFreshWords(
  allWords: Word[],
  records: Record<string, WordRecord>
): boolean {
  return allWords.some((w) => {
    const r = records[w.en.toLowerCase()];
    return !r || (!r.seen && !r.testSkipped && !r.mastered);
  });
}

/** 到期复习词数量（供首页显示） */
export function getDueCount(
  records: Record<string, WordRecord>,
  calendarDay: number
): number {
  return Object.values(records).filter(
    (r) => r.seen && !r.mastered && r.due !== null && r.due <= calendarDay
  ).length;
}

/** Fisher-Yates 洗牌 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface QueueResult {
  queue: Word[];
  /** 因超过上限被顺延的复习词数量 */
  deferredCount: number;
  /** 实际引入的新词数量 */
  newCount: number;
  /** 队列中的复习词数量 */
  reviewCount: number;
  /** 需要写回 store 的顺延记录（due 已改为明天） */
  deferredUpdates: Record<string, WordRecord>;
}

/**
 * 今日新词投放量。
 *
 * 只在真的还不完债时才少发新词——即到期量超过了复习上限、有词被顺延。
 * 早先的写法是 `dailyNewLimit - floor(min(due, cap) / 3)`，把新词投放挂在了
 * 复习上限上，导致上限调得越高新词越少（cap=999、due≥60 时直接发 0 个），
 * 20 关下来只发得出一百多个词，远达不到设计的 400。
 */
function computeNewCount(
  dailyNewLimit: number,
  dueCount: number,
  maxReviewPerDay: number
): number {
  const backlog = Math.max(0, dueCount - maxReviewPerDay);
  return Math.max(0, dailyNewLimit - backlog);
}

/**
 * 今日单词任务量 = 实际要做的复习数 + 新词数。
 * 纯计算，不产生顺延写回，供首页与通关判定取"今天该做多少词"。
 *
 * 关键：Phase 2/3 传 dailyNewLimit=0，配额就等于当天的到期复习数——
 * 这样"不发新词"不等于"不用复习"。原先把 Phase 2/3 的 words 目标写死成 0，
 * 结果第 21-60 关一次复习都不强制，Phase 1 学的词到第 60 关全部逾期一个月。
 */
export function getWordQuota(
  allWords: Word[],
  records: Record<string, WordRecord>,
  calendarDay: number,
  dailyNewLimit: number,
  maxReviewPerDay: number
): number {
  let dueCount = 0;
  let freshCount = 0;
  for (const w of allWords) {
    const r = records[w.en.toLowerCase()];
    if (!r) {
      freshCount++;
      continue;
    }
    if (r.mastered || r.testSkipped) continue;
    if (!r.seen) freshCount++;
    else if (r.due !== null && r.due <= calendarDay) dueCount++;
  }
  const reviews = Math.min(dueCount, maxReviewPerDay);
  const news = Math.min(
    freshCount,
    computeNewCount(dailyNewLimit, dueCount, maxReviewPerDay)
  );
  return reviews + news;
}

/**
 * 构建今日学习队列：到期复习词优先，新词补足。
 * 复习词超过 maxReviewPerDay 时顺延到明天。
 */
export function buildQueue(
  allWords: Word[],
  records: Record<string, WordRecord>,
  calendarDay: number,
  dailyNewLimit: number,
  maxReviewPerDay: number
): QueueResult {
  const due: Word[] = [];
  const fresh: Word[] = [];

  for (const w of allWords) {
    const r = records[w.en.toLowerCase()];
    if (!r) {
      fresh.push(w);
      continue;
    }
    if (r.mastered || r.testSkipped) continue;
    if (!r.seen) {
      fresh.push(w);
    } else if (r.due !== null && r.due <= calendarDay) {
      due.push(w);
    }
  }

  // 过载保护：超出上限的到期词顺延到明天
  const takenDue = due.slice(0, maxReviewPerDay);
  const deferred = due.slice(maxReviewPerDay);
  const deferredUpdates: Record<string, WordRecord> = {};
  for (const w of deferred) {
    const key = w.en.toLowerCase();
    deferredUpdates[key] = { ...getRecord(records, key), due: calendarDay + 1 };
  }

  // 只有真的还不完债（有词被顺延）才少发新词
  const newCount = computeNewCount(dailyNewLimit, due.length, maxReviewPerDay);
  // 新词按口语词频从高到低引入，保证先学的是日常真会听到的词
  const takenNew = [...fresh].sort((a, b) => a.rank - b.rank).slice(0, newCount);

  return {
    queue: shuffle([...takenDue, ...takenNew]),
    deferredCount: deferred.length,
    newCount: takenNew.length,
    reviewCount: takenDue.length,
    deferredUpdates,
  };
}
