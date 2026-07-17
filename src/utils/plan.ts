// 开放式训练计划（通关驱动，不设天数与关卡上限）
//
// 两个"天"的概念必须分开，不能合并：
//   calendarDay —— 真实天数，只喂 SRS 算复习到期，永远跟着日历走
//   planDay     —— 通关进度，做完四项任务才 +1，请假不推进也不倒退
// 若用通关数去算 SRS 间隔，"7 天后复习"会变成"7 次通关后复习"，
// 一天猛刷就把整周的复习压到当天，艾宾浩斯就废了。
//
// 关卡不设上限：进度由能力决定，而不是由日历倒数。词库发完即进入维持模式。
import type { DailyCompletion, Framework, LearningStore, WordRecord } from '../types';
import { FRAMEWORKS } from '../data/frameworks';

export interface DailyTarget {
  words: number;
  framework: number;
  shadowing: number;
  listening: number;
}

/**
 * 各阶段的输出类任务量（不含 words —— 单词量由当天队列决定，见 getDailyTarget）。
 *
 * 按"每天 1 小时"配平，每题耗时按 造句25s / 跟读30s / 听辨22s / 单词10s 估算：
 *   Phase 1 ≈ 46 分、Phase 2 ≈ 53 分、Phase 3 ≈ 58 分（含单词稳态的 30 分）
 *
 * 跟读量比初版（3/5/8）提高了一个数量级：本方法论的目标是"听懂与说出"，
 * 而 3 句跟读只有 1 分半，远达不到 shadowing 建立口腔肌肉记忆所需的剂量
 * （经典练法是连续 15-30 分钟）。现在 Phase 3 的 35 句约合 18 分钟。
 */
export const OUTPUT_TARGETS: Record<
  '1' | '2' | '3' | 'maintenance',
  Omit<DailyTarget, 'words'>
> = {
  '1': { framework: 8, shadowing: 20, listening: 8 },
  '2': { framework: 12, shadowing: 28, listening: 12 },
  '3': { framework: 15, shadowing: 35, listening: 12 },
  // 词库发完后不再有新词，省下的时间全部让给听说
  maintenance: { framework: 10, shadowing: 40, listening: 12 },
};

/**
 * "巩固"的门槛：stage 3 意味着这个词连续答对 3 次、间隔走到 1→2→4 天，
 * 下次复习在 7 天后——即"隔了一周还记得"。
 *
 * 不能用 mastered（stage 8）：那需要 1+2+4+7+15+30+60+120 = 239 天，
 * 早期用户几个月内一个词都毕不了业，掌握率恒等于"测试认识的词 / 学过的词"，
 * 学得越多反而越低，阶段门槛永远无法满足。
 */
export const RETAINED_STAGE = 3;

/**
 * 阶段推进的能力门槛：巩固词数 + 巩固率，双条件。
 *
 * 不能只看比率：开局只有入门测试认识的那几十个词，比率天然 100%，
 * 会在第一关就直接跳到 Phase 3。词数下限保证有足够的语料基础。
 *
 * 也不再看关卡数（原来是 planDay≥20 / ≥40）——那是把 60 天日历
 * 换了个名字，用户学快学慢都被同一把尺子卡住。
 */
export const PHASE_GATES: Record<1 | 2, { retainedWords: number; ratio: number }> = {
  1: { retainedWords: 300, ratio: 0.6 },
  2: { retainedWords: 700, ratio: 0.7 },
};

export const PHASE_NAMES: Record<1 | 2 | 3, string> = {
  1: '冷启动',
  2: '阻抗突围',
  3: '肌内固化',
};

/**
 * 取某关的任务目标。
 *
 * @param wordQuota 今天该做多少个词，由 srs.getWordQuota 按当天队列算出
 *   （= 到期复习 + 新词）。不能写死成常数：
 *   · 写死 20 而用户把每日新词量调到 5 → 队列只有 5 个词，永远做不满 20，死锁；
 *   · Phase 2/3 写死 0 → 不强制任何复习，Phase 1 学的词全部烂掉。
 *   用当天队列长度当目标，两个问题一起解决："今天该做的都做完"。
 */
export function getDailyTarget(
  phase: 1 | 2 | 3,
  mode: 'training' | 'maintenance',
  wordQuota: number
): DailyTarget {
  const out =
    mode === 'maintenance'
      ? OUTPUT_TARGETS.maintenance
      : OUTPUT_TARGETS[String(phase) as '1' | '2' | '3'];
  return { ...out, words: Math.max(0, wordQuota) };
}

/** 本地日期字符串 YYYY-MM-DD（不用 toISOString，避免时区偏移） */
export function todayStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 真实天数：从开始日期到今天（第一天为 1） */
export function calculateCalendarDay(startDate: string): number {
  const start = new Date(startDate + 'T00:00:00');
  const now = new Date(todayStr() + 'T00:00:00');
  const diff = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return Math.max(1, diff + 1);
}

/** 一个词是否算"已巩固"：走到 stage 3（隔一周还记得）或已彻底掌握 */
export function isRetained(r: WordRecord): boolean {
  return r.mastered || r.testSkipped || r.stage >= RETAINED_STAGE;
}

/** 已巩固的词数 */
export function getRetainedCount(records: Record<string, WordRecord>): number {
  return Object.values(records).filter(isRetained).length;
}

/**
 * 已学词中已巩固的比例。阶段推进就卡这个值。
 * 用 stage≥3 而非 mastered 的原因见 RETAINED_STAGE 的注释。
 */
export function getRetainedRatio(records: Record<string, WordRecord>): number {
  const all = Object.values(records);
  const learned = all.filter((r) => r.seen || r.testSkipped);
  if (learned.length === 0) return 0;
  return learned.filter(isRetained).length / learned.length;
}

/** 进入下一阶段的门槛；Phase 3 已是最高阶段，返回 null */
export function getPhaseGate(phase: 1 | 2 | 3): { retainedWords: number; ratio: number } | null {
  return phase === 3 ? null : PHASE_GATES[phase];
}

/**
 * 检查阶段推进：巩固词数与巩固率双达标，与学了多少天无关。
 * 学得快的人几周就能进 Phase 2，学得慢的人多练几关，尺子是同一把——能力。
 */
export function checkPhaseProgression(
  currentPhase: 1 | 2 | 3,
  records: Record<string, WordRecord>
): { shouldAdvance: boolean; reason: string } {
  const gate = getPhaseGate(currentPhase);
  if (!gate) return { shouldAdvance: false, reason: '' };

  const ratio = getRetainedRatio(records);
  const count = getRetainedCount(records);
  const pct = Math.round(ratio * 100);
  const nextPhase = currentPhase + 1;

  if (count >= gate.retainedWords && ratio >= gate.ratio) {
    return { shouldAdvance: true, reason: `已巩固 ${count} 词、巩固率 ${pct}%，进入 Phase ${nextPhase}` };
  }
  if (count < gate.retainedWords) {
    return {
      shouldAdvance: false,
      reason: `已巩固 ${count}/${gate.retainedWords} 词，再积累一些就能进 Phase ${nextPhase}`,
    };
  }
  return {
    shouldAdvance: false,
    reason: `巩固率 ${pct}%，达到 ${Math.round(gate.ratio * 100)}% 就能进 Phase ${nextPhase}`,
  };
}

/**
 * 应用阶段门槛：满足条件才升一级。
 * 抽出来是因为通关和每日刷新两处都要用——早先只有刷新处走门槛，
 * 而 completeTask 直接按关卡号设 currentPhase，等于把门槛绕过去了。
 */
export function applyPhaseGate(
  plan: LearningStore['plan'],
  records: Record<string, WordRecord>
): LearningStore['plan'] {
  if (plan.mode === 'maintenance') return { ...plan, currentPhase: 3 };
  const { shouldAdvance } = checkPhaseProgression(plan.currentPhase, records);
  if (shouldAdvance && plan.currentPhase < 3) {
    return {
      ...plan,
      currentPhase: (plan.currentPhase + 1) as 1 | 2 | 3,
      phaseReady: true,
    };
  }
  return { ...plan, phaseReady: shouldAdvance };
}

/** 该阶段及之前解锁的所有框架 */
export function getUnlockedFrameworks(phase: 1 | 2 | 3): Framework[] {
  return FRAMEWORKS.filter((f) => f.phase <= phase);
}

/** 空的关卡完成记录 */
export function emptyCompletion(): DailyCompletion {
  return { words: 0, framework: 0, shadowing: 0, listening: 0 };
}

/** 某一项是否达标（目标为 0 表示本阶段不需要做） */
export function isTaskDone(done: number, target: number): boolean {
  return target === 0 || done >= target;
}

/** 某关四项任务是否都做满了目标量 */
export function isLevelComplete(
  completion: DailyCompletion | undefined,
  target: DailyTarget
): boolean {
  if (!completion) return false;
  return (
    isTaskDone(completion.words, target.words) &&
    isTaskDone(completion.framework, target.framework) &&
    isTaskDone(completion.shadowing, target.shadowing) &&
    isTaskDone(completion.listening, target.listening)
  );
}

/** 今天是否已经通过一关（一天只能通一关，防止猛刷压垮 SRS） */
export function hasClearedToday(plan: LearningStore['plan']): boolean {
  return plan.lastClearedDate === todayStr();
}

export type LevelState = 'cleared' | 'active' | 'locked';

/** 某关的状态：已通关 / 当前可闯 / 未解锁 */
export function getLevelState(plan: LearningStore['plan'], level: number): LevelState {
  if (plan.cleared.includes(level)) return 'cleared';
  if (level === plan.planDay) return 'active';
  return 'locked';
}

/**
 * 是否允许现在闯 activeLevel 这一关的新内容。
 * 硬卡关：今天已经通关过就得等明天；回刷已通关的关卡不受此限。
 */
export function canPlayActiveLevel(plan: LearningStore['plan']): boolean {
  if (plan.activeLevel < plan.planDay) return true; // 回刷旧关，随时可以
  return !hasClearedToday(plan);
}

/**
 * 每次打开 app 时刷新：只更新真实天数与阶段，不碰 planDay。
 * planDay 只由通关推进，所以请假多久回来都还在原来那关。
 *
 * @param hasFreshWords 词库里还有没学过的词吗。没有了就进维持模式——
 *   维持模式的触发条件是"词库发完"，而不是"到了第 61 天"。
 */
export function refreshPlan(
  store: LearningStore,
  hasFreshWords: boolean
): LearningStore['plan'] {
  let plan = { ...store.plan };
  plan.calendarDay = calculateCalendarDay(plan.startDate);
  if (!hasFreshWords) plan.mode = 'maintenance';
  plan = applyPhaseGate(plan, store.words);
  return plan;
}

/**
 * 给某关的一项任务记一笔完成量；四项都做满目标才通关，planDay 前进一格。
 * 回刷已通关的旧关不会推进 planDay。
 *
 * @param amount 本次完成量，默认 1。单词模块清空队列时会一次性补满。
 */
export function completeTask(
  plan: LearningStore['plan'],
  level: number,
  key: keyof DailyCompletion,
  amount: number,
  wordQuota: number
): LearningStore['plan'] {
  // 用 currentPhase 而非关卡号：巩固率没到门槛时人还留在 Phase 1，
  // 内容也该是 Phase 1 的。按关卡号算会让第 21 关直接跳 Phase 2 目标，
  // 和实际解锁的框架对不上。
  const target = getDailyTarget(plan.currentPhase, plan.mode, wordQuota);
  const cur = plan.levels[level] ?? emptyCompletion();

  const nextCompletion: DailyCompletion = { ...cur, [key]: cur[key] + amount };
  const next: LearningStore['plan'] = {
    ...plan,
    levels: { ...plan.levels, [level]: nextCompletion },
  };

  const justCleared =
    isLevelComplete(nextCompletion, target) && !plan.cleared.includes(level);

  if (justCleared) {
    next.cleared = [...plan.cleared, level].sort((a, b) => a - b);
    next.lastClearedDate = todayStr();
    // 只有闯当前关才推进进度；回刷旧关不算。关卡数不设上限。
    if (level === plan.planDay) {
      next.planDay = plan.planDay + 1;
      next.activeLevel = plan.planDay + 1;
      // 注意：不在这里设 currentPhase 或 mode —— 那会绕过能力门槛。
      // 阶段推进一律走 applyPhaseGate，维持模式由"词库发完"触发（见 refreshPlan）。
    }
  }
  return next;
}
