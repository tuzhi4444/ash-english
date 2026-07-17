// 应用组装：视图切换、每日刷新、学习时长统计
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DailyCompletion, LearningStore, View } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNotification } from './hooks/useNotification';
import { STORAGE_KEY } from './utils/backup';
import { defaultStore } from './utils/store';
import {
  applyPhaseGate,
  completeTask,
  emptyCompletion,
  getDailyTarget,
  refreshPlan,
  todayStr,
} from './utils/plan';
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

// 五项任务的固定顺序（= 首页面板顺序）。做满一项自动跳到下一项未完成的。
const TASK_ORDER: { key: keyof DailyCompletion; view: View; name: string }[] = [
  { key: 'words', view: 'words', name: '单词学习' },
  { key: 'framework', view: 'framework', name: '框架造句' },
  { key: 'shadowing', view: 'shadowing', name: 'Shadowing' },
  { key: 'listening', view: 'listening', name: '听辨训练' },
  { key: 'dialogue', view: 'dialogue', name: '对话模拟' },
];

// 底部栏 = 页面导航（去哪个页面），练习模式一律从首页的通关面板进。
// 早先这里放的是单词/框架/跟读，和面板里的任务重复了，故改成页面级入口。
const NAV: { view: View; icon: string; label: string }[] = [
  { view: 'home', icon: '🏠', label: '首页' },
  { view: 'levels', icon: '🗺️', label: '关卡' },
  { view: 'browser', icon: '📖', label: '词库' },
  { view: 'stats', icon: '📊', label: '统计' },
  { view: 'settings', icon: '⚙️', label: '设置' },
];

export default function App(): React.JSX.Element {
  const [store, setStore] = useLocalStorage<LearningStore>(
    STORAGE_KEY,
    defaultStore(),
    migrateStore
  );
  const [view, setView] = useState<View>('home');
  // 做满一项后的过渡提示：闪一下"✅ 本项完成"，再自动跳到下一项
  const [taskBanner, setTaskBanner] = useState<{
    finishedName: string;
    nextView: View;
    nextName: string | null;
  } | null>(null);
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
   * 五项都做满目标时 completeTask 会自动通关并推进 planDay。
   * 某一项刚好做满时，闪一下提示并自动跳到下一项未完成的练习。
   */
  const markTask = useCallback(
    (key: keyof DailyCompletion, amount = 1) => {
      const quota = getWordQuota(
        WORDS,
        store.words,
        store.plan.calendarDay,
        store.settings.dailyNewWords,
        store.settings.maxReviewPerDay
      );
      const target = getDailyTarget(store.plan.currentPhase, store.plan.mode, quota);
      const cur = store.plan.levels[store.plan.activeLevel] ?? emptyCompletion();
      const before = cur[key];
      const after = before + amount;

      update((prev) => {
        const q = getWordQuota(
          WORDS,
          prev.words,
          prev.plan.calendarDay,
          // 新词全程投放，直到词库发完（发完 getWordQuota 自然只剩复习）
          prev.settings.dailyNewWords,
          prev.settings.maxReviewPerDay
        );
        const plan = completeTask(prev.plan, prev.plan.activeLevel, key, amount, q);
        // 通关可能跨过阶段线，这里补一次门槛判定；
        // 否则要等到下次打开 app 才升级
        return { ...prev, plan: applyPhaseGate(plan, prev.words) };
      });

      // 本项从"没做满"变成"刚做满"→ 跳到下一项未完成的练习
      const justFinished = target[key] > 0 && before < target[key] && after >= target[key];
      if (justFinished) {
        const idx = TASK_ORDER.findIndex((t) => t.key === key);
        const isUnfinished = (t: (typeof TASK_ORDER)[number]): boolean => {
          const done = t.key === key ? after : (cur[t.key] ?? 0);
          return target[t.key] > 0 && done < target[t.key];
        };
        // 先往后找（顺着做下去），后面都做完了再回头找前面漏的，全做完则回首页
        const next =
          TASK_ORDER.slice(idx + 1).find(isUnfinished) ??
          TASK_ORDER.slice(0, idx).find(isUnfinished) ??
          null;
        setTaskBanner({
          finishedName: TASK_ORDER[idx]?.name ?? '本项',
          nextView: next ? next.view : 'home',
          nextName: next ? next.name : null,
        });
      }
    },
    [store, update]
  );

  // 过渡提示显示约 1.2 秒后自动跳转
  useEffect(() => {
    if (!taskBanner) return;
    const id = window.setTimeout(() => {
      setView(taskBanner.nextView);
      setTaskBanner(null);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [taskBanner]);

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
      {taskBanner && (
        <div className="task-done-overlay">
          <div className="task-done-card">
            <div className="task-done-check">✅</div>
            <div className="task-done-title">{taskBanner.finishedName} 完成</div>
            <div className="task-done-next">
              {taskBanner.nextName ? `进入 ${taskBanner.nextName} …` : '今日五项全部完成 🎉'}
            </div>
          </div>
        </div>
      )}
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
