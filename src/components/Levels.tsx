// 关卡列表：开放式，已通关可回刷，当前关高亮
import type { LearningStore } from '../types';
import { getLevelState, hasClearedToday, PHASE_NAMES } from '../utils/plan';

interface Props {
  store: LearningStore;
  onSelect: (level: number) => void;
  onBack: () => void;
}

const GROUP_SIZE = 10;

export default function Levels({ store, onSelect, onBack }: Props): React.JSX.Element {
  const { plan } = store;
  const clearedToday = hasClearedToday(plan);

  // 开放式：只画到当前关，不预留"未来 60 关"的空格子
  const lastLevel = Math.max(plan.planDay, ...plan.cleared, 1);
  const groupCount = Math.ceil(lastLevel / GROUP_SIZE);
  const groups = Array.from({ length: groupCount }, (_, g) => {
    const from = g * GROUP_SIZE + 1;
    const to = Math.min(from + GROUP_SIZE - 1, lastLevel);
    return { from, to };
  }).reverse(); // 最近的关放最上面

  return (
    <div className="app">
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          ‹
        </button>
        <div className="title">🗺️ 关卡列表</div>
        <span className="muted">已通关 {plan.cleared.length}</span>
      </div>

      <div className="card">
        <div className="row" style={{ marginBottom: 6 }}>
          <strong>
            {plan.mode === 'maintenance'
              ? '维持模式 · 保持练习'
              : `Phase ${plan.currentPhase} · ${PHASE_NAMES[plan.currentPhase]}`}
          </strong>
          <span className="tag">第 {plan.planDay} 关</span>
        </div>
        <div className="muted">
          这套计划不设总关数，练到词库通关为止；阶段由能力推进，不看天数。
          已通关的关卡可随时回刷巩固，<strong>不占新词额度、也不影响进度</strong>。
          {clearedToday
            ? ` 今天的新关已通过，第 ${plan.planDay} 关明天开。`
            : ` 当前可闯第 ${plan.planDay} 关。`}
        </div>
      </div>

      {groups.map(({ from, to }) => {
        const levels = Array.from({ length: to - from + 1 }, (_, i) => from + i);
        const clearedInGroup = levels.filter((l) => plan.cleared.includes(l)).length;
        return (
          <div className="card" key={from}>
            <div className="row" style={{ marginBottom: 10 }}>
              <strong>
                第 {from}-{to} 关
              </strong>
              <span className="tag grey">
                {clearedInGroup}/{levels.length}
              </span>
            </div>
            <div className="level-grid">
              {levels.map((lv) => {
                const state = getLevelState(plan, lv);
                const isActive = lv === plan.activeLevel;
                // 当前关今天已通关的话，点它也没新内容，标出来
                const waiting = state === 'active' && clearedToday;
                return (
                  <button
                    key={lv}
                    className={`level ${state} ${isActive ? 'selected' : ''}`}
                    disabled={state === 'locked'}
                    onClick={() => onSelect(lv)}
                  >
                    {state === 'locked' ? '🔒' : waiting ? '⏳' : lv}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="card">
        <div className="muted" style={{ fontSize: 13 }}>
          <div style={{ marginBottom: 4 }}>
            <span className="level cleared inline-legend">1</span> 已通关，可回刷
          </div>
          <div style={{ marginBottom: 4 }}>
            <span className="level active inline-legend">2</span> 当前可闯
          </div>
          <div>
            <span className="level locked inline-legend">🔒</span> 未解锁
          </div>
        </div>
      </div>
    </div>
  );
}
