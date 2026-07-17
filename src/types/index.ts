// 全局类型定义

/** 框架占位符需要填入的词形 */
export type SlotType =
  | 'infinitive'
  | 'present'
  | 'ing'
  | 'past'
  | 'pastParticiple'
  | 'noun'
  | 'adjective';

/** 句式类型 */
export type SentenceType = 'declarative' | 'interrogative' | 'imperative';

/** 动词变形表 */
export interface WordForms {
  infinitive: string;
  present: string;
  ing: string;
  past: string;
  pastParticiple: string;
}

/** 词条 */
export interface Word {
  en: string;
  zh: string;
  pos: string;
  example: string;
  exampleZh: string;
  /** 仅动词有值，非动词为 null */
  forms: WordForms | null;
  /** 动词默认搭配宾语，仅动词有值 */
  defaultObject: string | null;
  tags: string[];
  /** 难度 1-5，按词频五等分得出 */
  difficulty: number;
  /** 适用的框架模板 ID */
  frameworks: string[];
  /** SUBTLEX 口语词频名次，1 = 最高频；999999 = 词频表中查无此词 */
  rank: number;
}

/** 框架模板 */
export interface Framework {
  id: string;
  /** 含 {} 占位符 */
  template: string;
  templateZh: string;
  slotType: SlotType;
  slotPos: string;
  example: string;
  exampleZh: string;
  /** 难度 1-5 */
  difficulty: number;
  grammarPoint: string;
  phase: 1 | 2 | 3;
  /** 固定主语/上下文词 */
  subject: string;
  /** 选词时的语义过滤标签 */
  compatibleTags: string[];
  /**
   * 选词白名单（word.en 列表）。给"主语/语义写死"的框架用——
   * 天气只能配 nice/cold 之类，不能配 tough；有它就无视 compatibleTags。
   */
  slotWhitelist?: string[];
  sentenceType: SentenceType;
  /** 人称：1=第一人称，2=第二人称，3=第三人称 */
  person: 1 | 2 | 3;
}

/** 连续听力短文的一道理解题 */
export interface PassageQuestion {
  q: string;
  options: string[];
  /** 正确选项在 options 中的下标 */
  answer: number;
}

/** 连续听力素材：分级短文 / 对话 */
export interface Passage {
  id: string;
  phase: 1 | 2 | 3;
  title: string;
  lines: string[];
  /** 中文对照；用户导入的材料可能没有，此时为空字符串 */
  linesZh: string[];
  questions: PassageQuestion[];
  /** builtin = 内置 15 篇；imported = 用户自己导入的材料 */
  source: 'builtin' | 'imported';
}

/** 对话里的一轮 */
export interface DialogueTurn {
  /** partner = 对方说（TTS 播）；you = 你说（张嘴接话） */
  speaker: 'partner' | 'you';
  en: string;
  zh: string;
  /**
   * 仅 you 轮有值：提示你此刻要表达什么（中文），比 zh 更像"意图"而非"译文"。
   * 分开是因为对话没有标准答案——提示的是"你要干什么"，
   * 而 en/zh 只是一种参考说法，不是唯一正确答案。
   */
  intent?: string;
}

/** 对话场景：你扮演其中一方，听对方说、然后接话 */
export interface Dialogue {
  id: string;
  phase: 1 | 2 | 3;
  /** 场景名，如「在药店买感冒药」 */
  title: string;
  /** 情境交代（中文），给你开口前的上下文 */
  scene: string;
  turns: DialogueTurn[];
}

/** 单条单词学习记录 */
export interface WordRecord {
  seen: boolean;
  /** SRS 阶段 0-8 */
  stage: number;
  /** 到期日（day number） */
  due: number | null;
  mastered: boolean;
  /** Leitner 盒子 1-5 */
  box: number;
  favorite: boolean;
  markedDifficult: boolean;
  /** 入门测试标记为掌握，跳过学习 */
  testSkipped: boolean;
}

/** 单条框架练习记录 */
export interface FrameworkRecord {
  attempts: number;
  correct: number;
  lastPracticed: string;
  wordsUsed: string[];
  box: number;
}

/**
 * 关卡内各项任务的完成量（做了几个，不是做没做）。
 * 用计数而非布尔：布尔会让"做 1 题"和"做满 5 题"无法区分，
 * 而每个练习模块每答一次就上报一次，结果就是一题过关。
 */
export interface DailyCompletion {
  words: number;
  framework: number;
  shadowing: number;
  listening: number;
  /** 对话接话轮数（不是对话篇数）——一篇对话你要接好几次话 */
  dialogue: number;
}

/** 学习总存储 */
export interface LearningStore {
  words: Record<string, WordRecord>;
  framework: Record<string, FrameworkRecord>;
  shadowing: {
    totalAttempts: number;
    bestAccuracy: number;
    practicedWords: string[];
    history: { text: string; accuracy: number; date: string }[];
  };
  listening: {
    totalAttempts: number;
    correctCount: number;
    history: { text: string; correct: boolean; date: string }[];
  };
  /** 连续听力（短文/对话）记录 */
  passage: {
    totalAttempts: number;
    correctCount: number;
    /** 做过的短文 id；再做同一篇不计入每日配额（答案已知，否则等于白拿） */
    completed: string[];
    history: { passageId: string; score: number; total: number; date: string }[];
  };
  /**
   * 对话场景记录。
   *
   * 没有 completed 列表（短文有）：短文是理解题，做过就知道答案，重做等于白拿配额；
   * 对话是输出练习，同一个场景说第二遍第三遍才是建反射的正道，重复必须计数。
   */
  dialogue: {
    totalTurns: number;
    /** 练过的对话 id，只用于展示"练过几个场景" */
    practiced: string[];
    history: { dialogueId: string; accuracy: number; date: string }[];
  };
  /** 用户导入的连续听力材料。放进主 store，因此会随「导出进度」一起备份 */
  customPassages: Passage[];
  assessment: {
    completed: boolean;
    testDate: string | null;
    sampleSize: number;
    knownCount: number;
    masteryRatio: number;
  };
  plan: {
    startDate: string;
    /**
     * 真实天数（从 startDate 算起，第一天为 1）。只喂给 SRS 算复习到期。
     * 必须跟着日历走：间隔重复的前提是真实时间流逝，用通关数代替会让
     * "7 天后复习"变成"7 次通关后复习"，一天猛刷就会把复习全压到当天。
     */
    calendarDay: number;
    /** 通关进度（第几关）。只有做完五项任务才 +1，请假不推进也不倒退。 */
    planDay: number;
    currentPhase: 1 | 2 | 3;
    phaseReady: boolean;
    /** 各关卡完成情况，键是关卡号（不是日期）——请假不会让某一关永远错过 */
    levels: Record<number, DailyCompletion>;
    /** 已通关的关卡号 */
    cleared: number[];
    /** 最近一次通关发生在哪个日历日（YYYY-MM-DD），用于"一天只通一关" */
    lastClearedDate: string | null;
    /** 正在做哪一关：等于 planDay 时是闯新关，小于则是回刷已通关的 */
    activeLevel: number;
    mode: 'training' | 'maintenance';
  };
  stats: {
    totalStudyTime: number;
    dailyStudyTime: Record<string, number>;
    totalWordsLearned: number;
    totalFrameworkAttempts: number;
    totalShadowingAttempts: number;
    averageShadowingAccuracy: number;
  };
  settings: {
    autoSpeak: boolean;
    speechRate: number;
    preferredVoice: string | null;
    dailyNewWords: number;
    maxReviewPerDay: number;
    notificationEnabled: boolean;
    notificationTime: string;
  };
}

/** 应用视图 */
export type View =
  | 'home'
  | 'levels'
  | 'assessment'
  | 'words'
  | 'framework'
  | 'shadowing'
  | 'listening'
  | 'dialogue'
  | 'stats'
  | 'settings'
  | 'browser';
