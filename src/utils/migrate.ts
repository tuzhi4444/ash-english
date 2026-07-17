// 旧存档迁移
//
// plan 从"日历驱动"改成了"通关驱动"，字段结构变了。useLocalStorage 的浅合并
// 只在顶层生效（plan 会被旧对象整个覆盖），所以这里得逐字段搬。
import type { DailyCompletion, LearningStore } from '../types';
import { defaultStore } from './store';
import { calculateCalendarDay } from './plan';

/** 旧版任务完成情况：布尔（做没做），新版是计数（做了几个） */
interface LegacyCompletion {
  words?: boolean;
  framework?: boolean;
  shadowing?: boolean;
  listening?: boolean;
}

/** 旧版 plan 结构（v1：日历驱动 + 布尔完成度） */
interface LegacyPlan {
  startDate?: string;
  currentDay?: number;
  currentPhase?: 1 | 2 | 3;
  phaseReady?: boolean;
  dailyCompleted?: Record<string, LegacyCompletion>;
  streak?: number;
  mode?: 'training' | 'maintenance';
}

/**
 * 布尔完成度转计数。旧数据只知道"做过"，不知道做了几个，
 * 所以 true 折算成一个大数（视为已达标），false 折算成 0——
 * 宁可把过去的努力算足，也别让用户回来发现旧关卡凭空退回未完成。
 */
const DONE_ENOUGH = 9999;
function toCounts(c: LegacyCompletion): DailyCompletion {
  // 对话是后加的任务：老关卡若四项都做完了（即已通关），
  // 把 dialogue 也置为已达标——总不能因为新增了任务，
  // 就让用户已经通关的旧关卡凭空退回未完成。没通关的置 0。
  const wasCleared = Boolean(c.words && c.framework && c.shadowing && c.listening);
  return {
    words: c.words ? DONE_ENOUGH : 0,
    framework: c.framework ? DONE_ENOUGH : 0,
    shadowing: c.shadowing ? DONE_ENOUGH : 0,
    listening: c.listening ? DONE_ENOUGH : 0,
    dialogue: wasCleared ? DONE_ENOUGH : 0,
  };
}

/**
 * 给 v2 存档（有 planDay，但没 dialogue 字段）的关卡完成记录补上 dialogue。
 *
 * 不补的后果是硬 bug：completeTask 会算 `cur.dialogue + amount` = NaN，
 * 该关的对话任务永远做不满、卡死通关。
 * 已通关的关卡补 DONE_ENOUGH（回刷时不显示为未完成），其余补 0。
 */
function backfillDialogue(
  levels: Record<number, Partial<DailyCompletion>>,
  cleared: number[]
): Record<number, DailyCompletion> {
  const out: Record<number, DailyCompletion> = {};
  for (const [k, c] of Object.entries(levels)) {
    const level = Number(k);
    out[level] = {
      words: c.words ?? 0,
      framework: c.framework ?? 0,
      shadowing: c.shadowing ?? 0,
      listening: c.listening ?? 0,
      dialogue: c.dialogue ?? (cleared.includes(level) ? DONE_ENOUGH : 0),
    };
  }
  return out;
}

/** 是否是尚未迁移的旧存档 */
function isLegacy(plan: unknown): plan is LegacyPlan {
  return (
    typeof plan === 'object' &&
    plan !== null &&
    !('planDay' in plan) &&
    ('currentDay' in plan || 'dailyCompleted' in plan)
  );
}

/**
 * 把任意版本的存档补齐成当前结构。
 * 原则：宁可保守（进度算少一点），也不能凭空多给通关数。
 */
export function migrateStore(raw: Partial<LearningStore>): LearningStore {
  const base = defaultStore();
  const merged: LearningStore = {
    ...base,
    ...raw,
    // 这几个是后加的字段，旧存档里没有，用默认值兜底
    passage: { ...base.passage, ...(raw.passage ?? {}) },
    dialogue: { ...base.dialogue, ...(raw.dialogue ?? {}) },
    customPassages: raw.customPassages ?? [],
    stats: { ...base.stats, ...(raw.stats ?? {}) },
    settings: { ...base.settings, ...(raw.settings ?? {}) },
    assessment: { ...base.assessment, ...(raw.assessment ?? {}) },
    plan: base.plan,
  };

  const rawPlan: unknown = raw.plan;

  if (isLegacy(rawPlan)) {
    const startDate = rawPlan.startDate ?? base.plan.startDate;
    // 旧的 dailyCompleted 按日期存，新的按关卡号存。
    // 按日期先后把完成过的天依次映射成第 1、2、3… 关。
    const dates = Object.keys(rawPlan.dailyCompleted ?? {}).sort();
    const levels: Record<number, DailyCompletion> = {};
    const cleared: number[] = [];
    dates.forEach((d, i) => {
      const c = rawPlan.dailyCompleted?.[d];
      if (!c) return;
      const level = i + 1;
      levels[level] = toCounts(c);
      // 只把"四项全做完"的天算作已通关，避免白送进度
      if (c.words && c.framework && c.shadowing && c.listening) cleared.push(level);
    });
    // 关卡不设上限，直接接着已通关数往下走
    const planDay = cleared.length + 1;

    merged.plan = {
      startDate,
      calendarDay: calculateCalendarDay(startDate),
      planDay,
      // 阶段一律回落到 1，由 applyPhaseGate 按巩固词数/巩固率重新判定：
      // 旧存档的 currentPhase 是按关卡号推的，那把尺子已经废弃了
      currentPhase: 1,
      phaseReady: false,
      levels,
      cleared,
      // 旧存档没有这个概念，置空表示"今天还没通关"，不平白卡住用户
      lastClearedDate: null,
      activeLevel: planDay,
      mode: rawPlan.mode ?? 'training',
    };
    return merged;
  }

  // 已是新结构：补齐可能缺失的字段
  const p = (rawPlan ?? {}) as Partial<LearningStore['plan']>;
  const startDate = p.startDate ?? base.plan.startDate;
  const planDay = p.planDay ?? 1;
  const cleared = p.cleared ?? [];
  merged.plan = {
    startDate,
    calendarDay: calculateCalendarDay(startDate),
    planDay,
    currentPhase: p.currentPhase ?? 1,
    phaseReady: p.phaseReady ?? false,
    // 关卡完成记录补 dialogue 字段——不补会让 completeTask 算出 NaN、卡死通关
    levels: backfillDialogue(
      (p.levels ?? {}) as Record<number, Partial<DailyCompletion>>,
      cleared
    ),
    cleared,
    lastClearedDate: p.lastClearedDate ?? null,
    activeLevel: p.activeLevel ?? planDay,
    mode: p.mode ?? 'training',
  };
  return merged;
}
