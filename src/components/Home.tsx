// 首页：当前关卡面板 + 功能入口
import type { DailyCompletion, LearningStore, View } from '../types';
import { WORDS } from '../data/words';
import { useMemo } from 'react';
import {
  canPlayActiveLevel,
  checkPhaseProgression,
  getDailyTarget,
  getRetainedRatio,
  hasClearedToday,
  isLevelComplete,
  isTaskDone,
  PHASE_NAMES,
} from '../utils/plan';
import { getDueCount, getWordQuota } from '../utils/srs';
import { totalLearned } from '../utils/stats';

interface Props {
  store: LearningStore;
  onNavigate: (v: View) => void;
}

interface TaskRow {
  key: keyof DailyCompletion;
  emoji: string;
  name: string;
  view: View;
  target: number;
}

export default function Home({ store, onNavigate }: Props): React.JSX.Element {
  const { plan } = store;
  const level = plan.activeLevel;
  const isReplay = level < plan.planDay;
  // 阶段一律取 currentPhase（受巩固率门槛约束），不按关卡号推——
  // 否则第 21 关会显示 Phase 2 的目标，而框架仍是 Phase 1 的，对不上
  const phase = plan.currentPhase;
  // 今日单词量 = 到期复习 + 新词，由当天队列决定；词库发完后配额即纯复习量
  const wordQuota = useMemo(
    () =>
      getWordQuota(
        WORDS,
        store.words,
        plan.calendarDay,
        store.settings.dailyNewWords,
        store.settings.maxReviewPerDay
      ),
    [store.words, plan.calendarDay, store.settings]
  );
  const target = getDailyTarget(phase, plan.mode, wordQuota);
  const completion = plan.levels[level];
  const retained = getRetainedRatio(store.words);
  const phaseHint =
    plan.mode === 'training' ? checkPhaseProgression(phase, store.words).reason : '';
  // SRS 用真实天数，不用通关数
  const dueCount = getDueCount(store.words, plan.calendarDay);
  const learned = totalLearned(store);
  const cleared = plan.cleared.length;
  const canPlay = canPlayActiveLevel(plan);
  const clearedToday = hasClearedToday(plan);
  const levelDone = isLevelComplete(completion, target);

  const tasks: TaskRow[] = [
    { key: 'words', emoji: '📚', name: '单词学习', view: 'words', target: target.words },
    { key: 'framework', emoji: '🏗️', name: '框架造句', view: 'framework', target: target.framework },
    { key: 'shadowing', emoji: '🎤', name: 'Shadowing', view: 'shadowing', target: target.shadowing },
    { key: 'listening', emoji: '👂', name: '听辨训练', view: 'listening', target: target.listening },
    { key: 'dialogue', emoji: '💬', name: '对话模拟', view: 'dialogue', target: target.dialogue },
  ];

  const remaining = tasks.filter(
    (t) => !isTaskDone(completion?.[t.key] ?? 0, t.target)
  ).length;
  // 开放式计划没有"总关数"，真实进度是词库覆盖了多少
  const progressPct = Math.min(100, (learned / WORDS.length) * 100);

  return (
    <div className="app">
      <div className="header">
        <div>
          <div className="title">Ash英语</div>
          <div className="subtitle">听说一体 · 每天一关</div>
        </div>
      </div>

      {/* 关卡面板 */}
      <div className="card">
        <div className="row" style={{ marginBottom: 8 }}>
          <strong>
            {plan.mode === 'maintenance'
              ? '维持模式 · 保持练习'
              : `第 ${level} 关 · ${PHASE_NAMES[phase]}`}
          </strong>
          <span className="tag orange">🏆 已通关 {cleared}</span>
        </div>

        <div className="progress">
          <div className="progress-fill success" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="muted" style={{ marginTop: 4 }}>
          词库进度 {learned}/{WORDS.length}
          {isReplay && ' · 正在回刷旧关'}
        </div>

        <div className="muted" style={{ marginTop: 8 }}>
          词汇巩固率 {Math.round(retained * 100)}%
          {phaseHint && ` · ${phaseHint}`}
        </div>

        {/* 卡关状态 */}
        {isReplay ? (
          <div className="hint" style={{ marginTop: 8 }}>
            回刷第 {level} 关巩固中，练多少都不影响进度。
            <button
              className="btn btn-secondary btn-block"
              style={{ marginTop: 8 }}
              onClick={() => onNavigate('levels')}
            >
              回到第 {plan.planDay} 关
            </button>
          </div>
        ) : clearedToday && levelDone ? (
          <div className="feedback correct" style={{ marginTop: 8 }}>
            <strong>🎉 今天通关了</strong>
            <p className="muted" style={{ marginTop: 4 }}>
              第 {plan.planDay} 关明天解锁。想再练可以回刷已通关的关卡，
              {dueCount > 0 ? `或把 ${dueCount} 个到期复习词清掉。` : '不占新词额度。'}
            </p>
          </div>
        ) : !canPlay ? (
          <div className="hint" style={{ marginTop: 8 }}>
            今天已经通过一关了，新关明天开。一天一关是为了让复习间隔跟得上。
          </div>
        ) : (
          <div className="hint" style={{ marginTop: 8 }}>
            <strong>还差 {remaining} 项通关</strong>
            <p className="muted" style={{ marginTop: 4 }}>
              四项全做完才算过关，做不完不解锁下一关。
            </p>
          </div>
        )}

        {dueCount > 0 && !clearedToday && (
          <div className="muted" style={{ marginTop: 8 }}>
            今天有 {dueCount} 个词到期复习。
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          {tasks.map((t) => {
            const raw = completion?.[t.key] ?? 0;
            const skipped = t.target === 0;
            const done = isTaskDone(raw, t.target);
            const locked = !canPlay && !done;
            // 钳到目标值再显示：超额完成不必显示 12/8，
            // 更要紧的是旧存档迁移时用大数当"已达标"哨兵，不钳会露出 9999/4
            const count = Math.min(raw, t.target);
            return (
              <div
                key={t.key}
                className="task-item"
                onClick={() => !skipped && !locked && onNavigate(t.view)}
                style={{
                  cursor: skipped || locked ? 'default' : 'pointer',
                  opacity: locked ? 0.45 : 1,
                }}
              >
                <span>{t.emoji}</span>
                <span className="task-name">{t.name}</span>
                {skipped ? (
                  <span className="tag grey">本阶段无需</span>
                ) : done ? (
                  <span className="tag green">✅ {count}/{t.target}</span>
                ) : locked ? (
                  <span className="tag grey">🔒 明天</span>
                ) : (
                  <span className="tag grey">
                    {count}/{t.target}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        className="btn btn-block btn-secondary"
        style={{ marginBottom: 12 }}
        onClick={() => onNavigate('levels')}
      >
        🗺️ 关卡列表
      </button>

      {/* 功能入口 */}
      <div className="entry-grid">
        <button className="entry" onClick={() => onNavigate('words')}>
          <span className="emoji">📚</span>单词学习
        </button>
        <button className="entry" onClick={() => onNavigate('framework')}>
          <span className="emoji">🏗️</span>框架造句
        </button>
        <button className="entry" onClick={() => onNavigate('shadowing')}>
          <span className="emoji">🎤</span>Shadowing
        </button>
        <button className="entry" onClick={() => onNavigate('listening')}>
          <span className="emoji">👂</span>听辨训练
        </button>
        <button className="entry" onClick={() => onNavigate('dialogue')}>
          <span className="emoji">💬</span>对话模拟
        </button>
      </div>

      {/* 学习概览 */}
      <div className="card">
        <div className="row">
          <span className="muted">累计学习单词</span>
          <strong>
            {learned} / {WORDS.length}
          </strong>
        </div>
      </div>

      <div className="entry-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <button className="entry" onClick={() => onNavigate('stats')}>
          <span className="emoji">📊</span>统计
        </button>
        <button className="entry" onClick={() => onNavigate('browser')}>
          <span className="emoji">📖</span>词库
        </button>
        <button className="entry" onClick={() => onNavigate('settings')}>
          <span className="emoji">⚙️</span>设置
        </button>
      </div>
    </div>
  );
}
