// 统计面板：累计数据 + 近7天趋势（手绘 SVG）
import type { LearningStore } from '../types';
import { WORDS } from '../data/words';
import { getRetainedRatio, isRetained } from '../utils/plan';
import {
  formatDuration,
  frameworkAccuracy,
  last7Days,
  listeningAccuracy,
  passageAccuracy,
  totalPlayedLevels,
  totalLearned,
} from '../utils/stats';

interface Props {
  store: LearningStore;
  onBack: () => void;
}

/** 近7天学习时长柱状图 */
function TrendChart({ data }: { data: ReturnType<typeof last7Days> }): React.JSX.Element {
  const W = 280;
  const H = 90;
  const gap = 8;
  const barW = (W - gap * 6) / 7;
  const max = Math.max(60, ...data.map((d) => d.seconds));

  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} width="100%" role="img" aria-label="近7天学习时长">
      {data.map((d, i) => {
        const h = Math.max(2, (d.seconds / max) * H);
        const x = i * (barW + gap);
        return (
          <g key={d.date}>
            <rect
              x={x}
              y={H - h}
              width={barW}
              height={h}
              rx={3}
              fill={d.seconds > 0 ? 'var(--primary)' : 'var(--border)'}
            />
            <text
              x={x + barW / 2}
              y={H + 13}
              textAnchor="middle"
              fontSize="10"
              fill="var(--text-light)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Stats({ store, onBack }: Props): React.JSX.Element {
  const learned = totalLearned(store);
  // 与首页口径一致：巩固 = stage≥3（隔一周还记得）。
  // 不展示 mastered（stage 8）—— 那需要 239 天，60 天计划里恒为 0，报出来只会误导。
  const retainedPct = Math.round(getRetainedRatio(store.words) * 100);
  const retainedCount = Object.values(store.words).filter(isRetained).length;
  const fwAcc = Math.round(frameworkAccuracy(store) * 100);
  const fwAttempts = store.stats.totalFrameworkAttempts;
  const lsAcc = Math.round(listeningAccuracy(store) * 100);
  const pgAcc = Math.round(passageAccuracy(store) * 100);
  const trend = last7Days(store.stats.dailyStudyTime);

  return (
    <div className="app">
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          ‹
        </button>
        <div className="title">📊 学习统计</div>
      </div>

      <div className="card">
        <div className="stat-grid">
          <div className="stat-item">
            <div className="stat-value">
              {learned}
              <span style={{ fontSize: 14, color: 'var(--text-light)' }}>/{WORDS.length}</span>
            </div>
            <div className="stat-label">累计学习单词</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{retainedPct}%</div>
            <div className="stat-label">词汇巩固率（{retainedCount} 词）</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{fwAttempts}</div>
            <div className="stat-label">框架练习次数（正确率 {fwAcc}%）</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {Math.round(store.stats.averageShadowingAccuracy * 100)}%
            </div>
            <div className="stat-label">
              Shadowing 平均（{store.shadowing.totalAttempts} 次）
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {Math.round(store.shadowing.bestAccuracy * 100)}%
            </div>
            <div className="stat-label">Shadowing 最佳</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{lsAcc}%</div>
            <div className="stat-label">
              听辨正确率（{store.listening.totalAttempts} 次）
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{pgAcc}%</div>
            <div className="stat-label">
              连续听力理解（{store.passage.completed.length} 篇）
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{store.dialogue.totalTurns}</div>
            {/* 对话不判对错，故不报正确率；只记接话次数与练过的场景数 */}
            <div className="stat-label">
              对话接话（练过 {store.dialogue.practiced.length} 个场景）
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{store.plan.cleared.length}</div>
            <div className="stat-label">已通关</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{totalPlayedLevels(store)}</div>
            <div className="stat-label">练过的关卡数</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ marginBottom: 8 }}>
          <strong>累计学习时长</strong>
          <span className="tag">{formatDuration(store.stats.totalStudyTime)}</span>
        </div>
        <div className="muted" style={{ marginBottom: 8 }}>
          近 7 天学习时长趋势
        </div>
        <TrendChart data={trend} />
      </div>
    </div>
  );
}
