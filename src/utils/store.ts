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
      dailyNewWords: 20,
      // 稳态复习量 = 8 × 每日新词数（每个词一生复习 8 次，稳态时投放与到期速率相等）。
      // 20 词/天 → 每天 160 次复习，上限低于此就会持续积压、反过来拖死新词投放。
      // 180 留了一点余量。每题约 10 秒 → 单词部分稳态约 30 分钟，占 1 小时的一半。
      maxReviewPerDay: 180,
      notificationEnabled: false,
      notificationTime: '20:00',
    },
  };
}
