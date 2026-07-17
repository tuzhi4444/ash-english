// 统计计算
import type { LearningStore } from '../types';
import { todayStr } from './plan';

/** 秒 → "X小时Y分钟" */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}小时${m}分钟`;
  if (m > 0) return `${m}分钟`;
  return `${Math.floor(seconds)}秒`;
}

/** 近 7 天学习时长（从 6 天前到今天） */
export function last7Days(
  dailyStudyTime: Record<string, number>
): { date: string; label: string; seconds: number }[] {
  const labels = ['日', '一', '二', '三', '四', '五', '六'];
  const out: { date: string; label: string; seconds: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = todayStr(d);
    out.push({ date: key, label: labels[d.getDay()], seconds: dailyStudyTime[key] ?? 0 });
  }
  return out;
}

/** 累计学过的词数（不含入门测试跳过的） */
export function totalLearned(store: LearningStore): number {
  return Object.values(store.words).filter((r) => r.seen && !r.testSkipped).length;
}

/** 框架练习正确率 */
export function frameworkAccuracy(store: LearningStore): number {
  const recs = Object.values(store.framework);
  const attempts = recs.reduce((s, r) => s + r.attempts, 0);
  if (attempts === 0) return 0;
  return recs.reduce((s, r) => s + r.correct, 0) / attempts;
}

/** 听辨正确率 */
export function listeningAccuracy(store: LearningStore): number {
  if (store.listening.totalAttempts === 0) return 0;
  return store.listening.correctCount / store.listening.totalAttempts;
}

/** 连续听力理解正确率 */
export function passageAccuracy(store: LearningStore): number {
  if (store.passage.totalAttempts === 0) return 0;
  return store.passage.correctCount / store.passage.totalAttempts;
}

/** 有过练习记录的关卡数（含未通关的） */
export function totalPlayedLevels(store: LearningStore): number {
  return Object.keys(store.plan.levels).length;
}

/** 把一段学习时长累加进 stats */
export function addStudyTime(
  stats: LearningStore['stats'],
  seconds: number
): LearningStore['stats'] {
  const key = todayStr();
  return {
    ...stats,
    totalStudyTime: stats.totalStudyTime + seconds,
    dailyStudyTime: {
      ...stats.dailyStudyTime,
      [key]: (stats.dailyStudyTime[key] ?? 0) + seconds,
    },
  };
}
