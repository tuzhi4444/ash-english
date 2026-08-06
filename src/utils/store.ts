// 学习数据的初始值
import type { LearningStore } from '../types';
import { todayStr } from './plan';

export function defaultStore(): LearningStore {
  return {
    words: {},
    framework: {},
    shadowing: { totalAttempts: 0, bestAccuracy: 0, practicedWords: [], history: [] },
    listening: { totalAttempts: 0, correctCount: 0, history: [] },
    passage: { totalAttempts: 0, correctCount: 0, completed: [], history: [] },
    dialogue: { totalTurns: 0, practiced: [], history: [] },
    customPassages: [],
    assessment: {
      completed: false,
      testDate: null,
      sampleSize: 0,
      knownCount: 0,
      masteryRatio: 0,
    },
    plan: {
      startDate: todayStr(),
      calendarDay: 1,
      planDay: 1,
      currentPhase: 1,
      phaseReady: false,
      levels: {},
      cleared: [],
      lastClearedDate: null,
      activeLevel: 1,
      mode: 'training',
    },
    stats: {
      totalStudyTime: 0,
      dailyStudyTime: {},
      totalWordsLearned: 0,
      totalFrameworkAttempts: 0,
      totalShadowingAttempts: 0,
      averageShadowingAccuracy: 0,
    },
    settings: {
      autoSpeak: true,
      speechRate: 1.0,
      preferredVoice: null,
      // 单词改成四模式串联（翻卡→听写→语境→听辨）后，每个词约 45 秒、
      // 是原来单模式的四倍，原先按 10 秒/词配的 20 新词 + 180 上限已经不成立：
      // 模拟 300 天，峰值 120 词 ≈ 106 分钟，有 69 天超过 1.5 小时。
      dailyNewWords: 12,
      // 上限 180 形同虚设——断更五天积压 140 个也够不着，于是全砸在回来那天。
      // 降到 60 才让"过载保护"真正生效：超出的顺延到明天，且新词自动暂停到还完债。
      // 断 5 天回来：180 词/151 分 → 64 词/64 分，峰值不再失控。
      maxReviewPerDay: 60,
      notificationEnabled: false,
      notificationTime: '20:00',
    },
  };
}
