// 应用组装：视图切换、每日刷新、学习时长统计
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DailyCompletion, LearningStore, View } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNotification } from './hooks/useNotification';
import { STORAGE_KEY } from './utils/backup';
import { defaultStore } from './utils/store';
import { applyPhaseGate, completeTask, refreshPlan, todayStr } from './utils/plan';
import { getWordQuota, hasFreshWords } from './utils/srs';
import { WORDS } from './data/words';
import { migrateStore } from './utils/migrate';
import { addStudyTime, totalLearned } from './utils/stats';

import Home from './components/Home';
import Levels from './components/Levels';
import Assessment from './components/Assessment';
import WordLearning from './components/WordLearning';
import FrameworkBuilder from './components/FrameworkBuilder';
import Shadowing from './components/Shadowing';
import Listening from './components/Listening';
import DialoguePractice from './components/Dialogue';
import Stats from './components/Stats';
import Settings from './components/Settings';
import WordBrowser from './components/WordBrowser';

const NAV: { view: View; icon: string; label: string }[] = [
  { view: 'home', icon: '🏠', label: '首页' },
  { view: 'words', icon: '📚', label: '单词' },
  { view: 'framework', icon: '🏗️', label: '框架' },
  { view: 'shadowing', icon: '🎤', label: '跟读' },
  { view: 'stats', icon: '📊', label: '更多' },
];

export default function App(): React.JSX.Element {
  const [store, setStore] = useLocalStorage<LearningStore>(
    STORAGE_KEY,
    defaultStore(),
    migrateStore
  );
  const [view, setView] = useState<View>('home');
  const notification = useNotification();
  const sessionStart = useRef(Date.now());
  const refreshed = useRef(false);

  const update = useCallback(
    (fn: (prev: LearningStore) => LearningStore) => setStore(fn),
    [setStore]
  );

  // 每天首次打开：刷新天数 / 阶段推进 / 维持模式
  useEffect(() => {
    if (refreshed.current || !store.assessment.completed) return;
    refreshed.current = true;
    update((prev) => ({
      ...prev,
      plan: refreshPlan(prev, hasFreshWords(WORDS, prev.words)),
      stats: { ...prev.stats, totalWordsLearned: totalLearned(prev) },
    }));
  }, [store.assessment.completed, update]);

  // 开启提醒时挂上定时器
  useEffect(() => {
    if (store.settings.notificationEnabled) {
      notification.scheduleReminder(store.settings.notificationTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.settings.notificationEnabled, store.settings.notificationTime]);

  // 学习时长：每分钟落一次盘，防止直接关页面丢数据
  useEffect(() => {
    const flush = (): void => {
      const seconds = Math.round((Date.now() - sessionStart.current) / 1000);
      sessionStart.current = Date.now();
      if (seconds < 1) return;
      setStore((prev) => ({ ...prev, stats: addStudyTime(prev.stats, seconds) }));
    };
    window.addEventListener('beforeunload', flush);
    const timer = window.setInterval(flush, 60000);
    return () => {
      window.removeEventListener('beforeunload', flush);
      window.clearInterval(timer);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 给当前关卡的某项任务记一笔完成量（每答一题调一次）。
   * 四项都做满目标时 completeTask 会自动通关并推进 planDay。
   */
  const markTask = useCallback(
    (key: keyof DailyCompletion, amount = 1) => {
      update((prev) => {
        const quota = getWordQuota(
          WORDS,
          prev.words,
          prev.plan.calendarDay,
          // 新词全程投放，直到词库发完（发完 getWordQuota 自然只剩复习）
          prev.settings.dailyNewWords,
          prev.settings.maxReviewPerDay
        );
        const plan = completeTask(prev.plan, prev.plan.activeLevel, key, amount, quota);
        // 通关可能跨过阶段线，这里补一次门槛判定；
        // 否则要等到下次打开 app 才升级
        return { ...prev, plan: applyPhaseGate(plan, prev.words) };
      });
    },
    [update]
  );

  /** 从关卡列表选一关：只允许已通关的（回刷）或当前关 */
  const selectLevel = useCallback(
    (level: number) => {
      update((prev) => {
        if (level !== prev.plan.planDay && !prev.plan.cleared.includes(level)) return prev;
        return { ...prev, plan: { ...prev.plan, activeLevel: level } };
      });
      setView('home');
    },
    [update]
  );

  /** 入门测试完成：写结果并从第 1 关开始 */
  function finishAssessment(patch: Partial<LearningStore>): void {
    update((prev) => ({
      ...prev,
      ...patch,
      words: { ...prev.words, ...(patch.words ?? {}) },
      plan: {
        ...prev.plan,
        startDate: todayStr(),
        calendarDay: 1,
        planDay: 1,
        activeLevel: 1,
        lastClearedDate: null,
      },
    }));
    setView('home');
  }

  /** 重新测试：清掉测试跳过标记 */
  function retakeTest(): void {
    update((prev) => {
      const words: LearningStore['words'] = {};
      for (const [k, r] of Object.entries(prev.words)) {
        words[k] = r.testSkipped
          ? { ...r, testSkipped: false, mastered: false, stage: 0, due: null }
          : r;
      }
      return { ...prev, words, assessment: { ...prev.assessment, completed: false } };
    });
    setView('assessment');
  }

  function resetAll(): void {
    localStorage.clear();
    window.location.reload();
  }

  // 未做入门测试：先测试
  if (!store.assessment.completed) {
    return <Assessment onFinish={finishAssessment} />;
  }

  const back = (): void => setView('home');

  return (
    <>
      {view === 'home' && <Home store={store} onNavigate={setView} />}
      {view === 'levels' && (
        <Levels store={store} onSelect={selectLevel} onBack={back} />
      )}
      {view === 'assessment' && <Assessment onFinish={finishAssessment} />}
      {view === 'words' && (
        <WordLearning
          store={store}
          onUpdate={update}
          onTaskDone={() => markTask('words')}
          onBack={back}
        />
      )}
      {view === 'framework' && (
        <FrameworkBuilder
          store={store}
          onUpdate={update}
          onTaskDone={() => markTask('framework')}
          onBack={back}
        />
      )}
      {view === 'shadowing' && (
        <Shadowing
          store={store}
          onUpdate={update}
          onTaskDone={() => markTask('shadowing')}
          onBack={back}
        />
      )}
      {view === 'listening' && (
        <Listening
          store={store}
          onUpdate={update}
          onTaskDone={(amount) => markTask('listening', amount ?? 1)}
          onBack={back}
        />
      )}
      {view === 'dialogue' && (
        <DialoguePractice
          store={store}
          onUpdate={update}
          onTurnDone={() => markTask('dialogue')}
          onBack={back}
        />
      )}
      {view === 'stats' && <Stats store={store} onBack={back} />}
      {view === 'browser' && <WordBrowser store={store} onUpdate={update} onBack={back} />}
      {view === 'settings' && (
        <Settings
          store={store}
          onUpdate={update}
          onReplace={(s) => setStore(s)}
          onReset={resetAll}
          onRetakeTest={retakeTest}
          onBack={back}
        />
      )}

      <nav className="bottom-nav">
        {NAV.map((n) => (
          <button
            key={n.view}
            className={view === n.view ? 'active' : ''}
            onClick={() => setView(n.view)}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
    </>
  );
}
