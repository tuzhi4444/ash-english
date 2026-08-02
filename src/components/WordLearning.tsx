// 单词学习：每个词依次走 翻卡 → 听写 → 语境 → 听辨 四步，四步做完才进下一个词。
//
// 关键约定：SRS 与「今日单词」配额每词只结算一次（在第四步完成时），
// 四步汇总——错 ≤1 步算掌握。否则一个词一天会被 reviewWord 四次、
// 配额一个词顶四个，间隔算法和通关都会乱。
import { useEffect, useMemo, useRef, useState } from 'react';
import type { LearningStore, Word } from '../types';
import { WORDS } from '../data/words';
import { useTTS } from '../hooks/useTTS';
import { buildQueue, getRecord, reviewWord } from '../utils/srs';
import { findFormInSentence } from '../utils/inflect';
import { buildMeaningOptions } from '../utils/options';
import { getUsageNote } from '../data/usageNotes';

const STEP_MODES = ['flip', 'dictation', 'context', 'listening'] as const;
type StepMode = (typeof STEP_MODES)[number];
const STEP_LABELS: Record<StepMode, string> = {
  flip: '翻卡',
  dictation: '听写',
  context: '语境',
  listening: '听辨',
};
/** 四步里错几步之内仍算「掌握」（喂给 SRS 的单次结算） */
const MAX_MISSES_TO_PASS = 1;

interface Props {
  store: LearningStore;
  onUpdate: (fn: (prev: LearningStore) => LearningStore) => void;
  onTaskDone: () => void;
  onBack: () => void;
}

export default function WordLearning({
  store,
  onUpdate,
  onTaskDone,
  onBack,
}: Props): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0); // 0-3，当前词走到第几个模式
  const [flipped, setFlipped] = useState(false);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<'none' | 'right' | 'wrong'>('none');
  const [replays, setReplays] = useState(0);
  const [wordMisses, setWordMisses] = useState(0); // 当前词这四步里错了几步
  const [noteOpen, setNoteOpen] = useState(false); // 翻卡后「用法详解」是否展开
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [masteredCount, setMasteredCount] = useState(0); // 四步汇总算掌握的词数
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(Date.now());

  const { speak } = useTTS(store.settings.speechRate, store.settings.preferredVoice);

  // 队列只在进入页面时构建一次，避免答题过程中重排
  const built = useMemo(
    () =>
      buildQueue(
        WORDS,
        store.words,
        // SRS 一律用真实天数：用通关数会让"7 天后复习"变成"7 次通关后复习"
        store.plan.calendarDay,
        store.settings.dailyNewWords,
        store.settings.maxReviewPerDay
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const queue = built.queue;
  const current: Word | undefined = queue[index];
  const mode: StepMode = STEP_MODES[step];

  const options = useMemo(
    () => (current ? buildMeaningOptions(current) : []),
    [current]
  );
  const blank = useMemo(
    () => (current ? findFormInSentence(current.en, current.example) : null),
    [current]
  );

  // 顺延的复习词写回 store
  useEffect(() => {
    if (Object.keys(built.deferredUpdates).length === 0) return;
    onUpdate((prev) => ({
      ...prev,
      words: { ...prev.words, ...built.deferredUpdates },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 进入听写/听辨步骤时自动播报
  useEffect(() => {
    if (!current || result !== 'none') return;
    if (mode === 'dictation') speak(current.en);
    if (mode === 'listening') speak(current.example);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, step]);

  if (queue.length === 0) {
    return (
      <div className="app">
        <div className="header">
          <button className="back-btn" onClick={onBack}>
            ‹
          </button>
          <div className="title">单词学习</div>
        </div>
        <div className="empty">
          <span className="emoji">🎉</span>
          今天没有待学的词了，明天再来吧。
        </div>
      </div>
    );
  }

  if (finished || !current) {
    const minutes = Math.round((Date.now() - startedAt.current) / 60000);
    return (
      <div className="app">
        <div className="header">
          <div className="title">本局结算</div>
        </div>
        <div className="card">
          <div className="stat-grid">
            <div className="stat-item">
              <div className="stat-value">{score}</div>
              <div className="stat-label">得分</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{bestCombo}</div>
              <div className="stat-label">最高连击</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{masteredCount}</div>
              <div className="stat-label">掌握</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{queue.length - masteredCount}</div>
              <div className="stat-label">待巩固</div>
            </div>
          </div>
          <div className="muted" style={{ marginTop: 12 }}>
            学习时长约 {minutes} 分钟
          </div>
        </div>
        <button className="btn btn-block" onClick={onBack}>
          返回首页
        </button>
      </div>
    );
  }

  /** 记录当前这一步的对错（只做计分与反馈，不碰 SRS / 配额） */
  function recordStep(correct: boolean): void {
    if (correct) {
      setScore((s) => s + 10 + combo * 2);
      setCombo((c) => {
        const nextCombo = c + 1;
        setBestCombo((b) => Math.max(b, nextCombo));
        return nextCombo;
      });
    } else {
      setCombo(0);
      setWordMisses((m) => m + 1);
    }
    setResult(correct ? 'right' : 'wrong');
    if (current) speak(current.example);
  }

  /** 点「下一步 / 下一个词」：前三步只推进步骤；第四步完成时给这个词做唯一一次结算 */
  function advance(): void {
    if (!current) return;
    if (step < STEP_MODES.length - 1) {
      setStep(step + 1);
      setResult('none');
      setFlipped(false);
      setNoteOpen(false);
      setInput('');
      setReplays(0);
      return;
    }

    // 四步走完：汇总成一次对错，喂 SRS + 记一笔配额
    const passed = wordMisses <= MAX_MISSES_TO_PASS;
    const key = current.en.toLowerCase();
    onUpdate((prev) => ({
      ...prev,
      words: {
        ...prev.words,
        [key]: reviewWord(getRecord(prev.words, key), passed, prev.plan.calendarDay),
      },
    }));
    if (passed) setMasteredCount((k) => k + 1);
    onTaskDone(); // 每个词只上报一次，配额 = 词数

    // 进入下一个词
    setStep(0);
    setWordMisses(0);
    setResult('none');
    setFlipped(false);
    setInput('');
    setReplays(0);
    if (index + 1 >= queue.length) setFinished(true);
    else setIndex(index + 1);
  }

  const contextSentence = blank
    ? current.example.replace(blank.form, '________')
    : current.example;
  const isLastStep = step === STEP_MODES.length - 1;
  const note = getUsageNote(current.en);

  return (
    <div className="app">
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          ‹
        </button>
        <div className="title">单词学习</div>
        <span className="muted">
          {index + 1}/{queue.length}
        </span>
      </div>

      {/* 四步进度链：当前步高亮，已过的步打勾 */}
      <div className="tabs">
        {STEP_MODES.map((m, i) => (
          <div key={m} className={`tab ${i === step ? 'active' : ''}`} style={{ cursor: 'default' }}>
            {i < step ? '✓ ' : ''}
            {STEP_LABELS[m]}
          </div>
        ))}
      </div>

      <div className="progress" style={{ marginBottom: 12 }}>
        <div
          className="progress-fill"
          style={{ width: `${((index + 1) / queue.length) * 100}%` }}
        />
      </div>

      <div className="row" style={{ marginBottom: 12 }}>
        <span className="muted">得分 {score}</span>
        <span className="muted">连击 {combo}</span>
      </div>

      {/* ---- 翻卡 ---- */}
      {mode === 'flip' && (
        <>
          <div
            className="card flashcard"
            onClick={() => {
              setFlipped(true);
              if (!flipped && store.settings.autoSpeak) speak(current.en);
            }}
          >
            <div className="word-zh">{current.zh}</div>
            <span className="tag grey">{current.pos}</span>
            {flipped ? (
              <div className="word-en">{current.en}</div>
            ) : (
              <div className="muted">点击卡片翻牌</div>
            )}
          </div>

          {/* 翻卡后：多义词用法详解（有才显示，默认收起，可反复展开看） */}
          {flipped && note && (
            <div className="card" style={{ marginTop: 0 }}>
              <button
                className="btn btn-block btn-ghost"
                style={{ textAlign: 'left' }}
                onClick={() => setNoteOpen((o) => !o)}
              >
                📖 用法详解（{note.senses.length} 种用法）{noteOpen ? ' ▲' : ' ▼'}
              </button>
              {noteOpen && (
                <div style={{ marginTop: 10 }}>
                  <p className="muted" style={{ marginBottom: 10 }}>
                    核心：{note.core}
                  </p>
                  {note.senses.map((s, si) => (
                    <div key={si} className="usage-sense">
                      <span className="tag grey">{s.use}</span>
                      <p style={{ margin: '4px 0 0' }}>{s.en}</p>
                      <p className="muted" style={{ margin: 0 }}>
                        {s.zh}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {flipped && result === 'none' && (
            <div className="btn-row">
              <button className="btn btn-secondary" onClick={() => recordStep(false)}>
                不认识
              </button>
              <button className="btn btn-success" onClick={() => recordStep(true)}>
                认识
              </button>
            </div>
          )}
        </>
      )}

      {/* ---- 听写 ---- */}
      {mode === 'dictation' && (
        <div className="card">
          <p className="muted" style={{ marginBottom: 8 }}>
            听发音，拼出这个单词
          </p>
          <button
            className="btn btn-secondary btn-block"
            style={{ marginBottom: 12 }}
            onClick={() => speak(current.en)}
          >
            🔊 播放发音
          </button>
          <input
            className="input"
            value={input}
            placeholder="输入英文单词"
            autoCapitalize="none"
            disabled={result !== 'none'}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && result === 'none') {
                recordStep(input.trim().toLowerCase() === current.en.toLowerCase());
              }
            }}
          />
          {result === 'none' && (
            <button
              className="btn btn-block"
              style={{ marginTop: 12 }}
              onClick={() => recordStep(input.trim().toLowerCase() === current.en.toLowerCase())}
            >
              校验
            </button>
          )}
        </div>
      )}

      {/* ---- 语境 ---- */}
      {mode === 'context' && (
        <div className="card">
          <p style={{ fontSize: 18, marginBottom: 8 }}>{contextSentence}</p>
          <p className="muted" style={{ marginBottom: 12 }}>
            {current.exampleZh}　提示：{current.zh}
          </p>
          {blank ? (
            <>
              <input
                className="input"
                value={input}
                placeholder="填入正确词形"
                autoCapitalize="none"
                disabled={result !== 'none'}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && result === 'none') {
                    recordStep(input.trim().toLowerCase() === blank.form.toLowerCase());
                  }
                }}
              />
              {result === 'none' && (
                <button
                  className="btn btn-block"
                  style={{ marginTop: 12 }}
                  onClick={() => recordStep(input.trim().toLowerCase() === blank.form.toLowerCase())}
                >
                  校验
                </button>
              )}
            </>
          ) : (
            // 例句里找不到该词的形态（个别不规则变形）——跳过填空，不计错
            result === 'none' && (
              <button className="btn btn-block" onClick={() => recordStep(true)}>
                继续
              </button>
            )
          )}
        </div>
      )}

      {/* ---- 听辨 ---- */}
      {mode === 'listening' && (
        <div className="card">
          <p className="muted" style={{ marginBottom: 8 }}>
            听整句，选出正确的中文意思
          </p>
          <button
            className="btn btn-secondary btn-block"
            style={{ marginBottom: 12 }}
            disabled={replays >= 3}
            onClick={() => {
              speak(current.example);
              setReplays((r) => r + 1);
            }}
          >
            🔊 再听一次（剩 {Math.max(0, 3 - replays)} 次）
          </button>
          {options.map((opt, oi) => (
            <button
              key={oi}
              className={`option ${
                result === 'none' ? '' : opt === current.exampleZh ? 'correct' : 'wrong'
              }`}
              disabled={result !== 'none'}
              onClick={() => recordStep(opt === current.exampleZh)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* ---- 反馈 + 推进 ---- */}
      {result !== 'none' && (
        <>
          <div className={`feedback ${result === 'right' ? 'correct' : 'wrong'}`}>
            <strong>
              {result === 'right' ? '✅ 答对了' : `❌ 正确答案：${current.en}`}
            </strong>
            <p style={{ marginTop: 6 }}>{current.example}</p>
            <p className="muted">{current.exampleZh}</p>
          </div>
          <div className="btn-row" style={{ marginTop: 12 }}>
            <button className="btn btn-secondary" onClick={() => speak(current.example)}>
              🔊 重听
            </button>
            <button className="btn" onClick={advance}>
              {isLastStep ? '下一个词' : '下一步'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
