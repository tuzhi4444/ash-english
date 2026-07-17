// 单词学习：翻卡 / 听写 / 语境 / 听辨 四种模式
import { useEffect, useMemo, useRef, useState } from 'react';
import type { LearningStore, Word } from '../types';
import { WORDS } from '../data/words';
import { useTTS } from '../hooks/useTTS';
import { buildQueue, getRecord, reviewWord } from '../utils/srs';
import { findFormInSentence } from '../utils/inflect';
import { buildMeaningOptions } from '../utils/options';

type Mode = 'flip' | 'dictation' | 'context' | 'listening';

const MODE_LABELS: Record<Mode, string> = {
  flip: '翻卡',
  dictation: '听写',
  context: '语境',
  listening: '听辨',
};

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
  const [mode, setMode] = useState<Mode>('flip');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<'none' | 'right' | 'wrong'>('none');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [replays, setReplays] = useState(0);
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

  const options = useMemo(
    () => (current && mode === 'listening' ? buildMeaningOptions(current) : []),
    [current, mode]
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

  // 听写/听辨模式进入新题时自动播报
  useEffect(() => {
    if (!current || result !== 'none') return;
    if (mode === 'dictation') speak(current.en);
    if (mode === 'listening') speak(current.example);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, mode]);

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
              <div className="stat-value">{knownCount}</div>
              <div className="stat-label">答对</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{queue.length - knownCount}</div>
              <div className="stat-label">答错</div>
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

  /** 记录答题结果并推进队列 */
  function submit(correct: boolean): void {
    if (!current) return;
    const key = current.en.toLowerCase();
    onUpdate((prev) => ({
      ...prev,
      words: {
        ...prev.words,
        [key]: reviewWord(getRecord(prev.words, key), correct, prev.plan.calendarDay),
      },
    }));

    if (correct) {
      setScore((s) => s + 10 + combo * 2);
      setCombo((c) => {
        const next = c + 1;
        setBestCombo((b) => Math.max(b, next));
        return next;
      });
      setKnownCount((k) => k + 1);
    } else {
      setCombo(0);
    }
    setResult(correct ? 'right' : 'wrong');
    // 每答一个词记一笔，达到今日目标才算这项通关（原来整队做完只报一次，
    // 等于答 1 个词就打勾）
    onTaskDone();
    speak(current.example);
  }

  function next(): void {
    setResult('none');
    setFlipped(false);
    setInput('');
    setReplays(0);
    if (index + 1 >= queue.length) {
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
  }

  const blank = findFormInSentence(current.en, current.example);
  const contextSentence = blank
    ? current.example.replace(blank.form, '________')
    : current.example;

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

      {index === 0 && result === 'none' && (
        <div className="hint" style={{ marginBottom: 12 }}>
          你回来啦！今天有 {built.reviewCount} 个复习 + {built.newCount} 个新词，慢慢来。
          {built.deferredCount > 0 && ` 另有 ${built.deferredCount} 个已顺延到明天。`}
        </div>
      )}

      <div className="tabs">
        {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
          <button
            key={m}
            className={`tab ${mode === m ? 'active' : ''}`}
            onClick={() => {
              setMode(m);
              setResult('none');
              setFlipped(false);
              setInput('');
              setReplays(0);
            }}
          >
            {MODE_LABELS[m]}
          </button>
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

      {/* ---- 翻卡模式 ---- */}
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
          {flipped && result === 'none' && (
            <div className="btn-row">
              <button className="btn btn-secondary" onClick={() => submit(false)}>
                不认识
              </button>
              <button className="btn btn-success" onClick={() => submit(true)}>
                认识
              </button>
            </div>
          )}
        </>
      )}

      {/* ---- 听写模式 ---- */}
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
            disabled={result !== 'none'}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && result === 'none') {
                submit(input.trim().toLowerCase() === current.en.toLowerCase());
              }
            }}
          />
          {result === 'none' && (
            <button
              className="btn btn-block"
              style={{ marginTop: 12 }}
              onClick={() => submit(input.trim().toLowerCase() === current.en.toLowerCase())}
            >
              校验
            </button>
          )}
        </div>
      )}

      {/* ---- 语境模式 ---- */}
      {mode === 'context' && (
        <div className="card">
          <p style={{ fontSize: 18, marginBottom: 8 }}>{contextSentence}</p>
          <p className="muted" style={{ marginBottom: 12 }}>
            {current.exampleZh}　提示：{current.zh}
          </p>
          <input
            className="input"
            value={input}
            placeholder="填入正确词形"
            disabled={result !== 'none'}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && result === 'none' && blank) {
                submit(input.trim().toLowerCase() === blank.form.toLowerCase());
              }
            }}
          />
          {result === 'none' && (
            <button
              className="btn btn-block"
              style={{ marginTop: 12 }}
              onClick={() =>
                submit(!!blank && input.trim().toLowerCase() === blank.form.toLowerCase())
              }
            >
              校验
            </button>
          )}
        </div>
      )}

      {/* ---- 听辨模式 ---- */}
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
                result === 'none'
                  ? ''
                  : opt === current.exampleZh
                    ? 'correct'
                    : 'wrong'
              }`}
              disabled={result !== 'none'}
              onClick={() => submit(opt === current.exampleZh)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* ---- 反馈 ---- */}
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
            <button className="btn" onClick={next}>
              下一个
            </button>
          </div>
        </>
      )}
    </div>
  );
}
