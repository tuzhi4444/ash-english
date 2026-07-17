// 听辨训练：只听整句，选正确中文意思
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LearningStore, Word } from '../types';
import { WORDS } from '../data/words';
import { useTTS } from '../hooks/useTTS';
import { buildMeaningOptions } from '../utils/options';
import { todayStr } from '../utils/plan';
import PassageListening from './PassageListening';

type Mode = 'single' | 'passage';

interface Props {
  store: LearningStore;
  onUpdate: (fn: (prev: LearningStore) => LearningStore) => void;
  /** @param amount 计入听辨任务的题数（连续听力一篇多题） */
  onTaskDone: (amount?: number) => void;
  onBack: () => void;
}

/** 难度随阶段递进：句长上限与语速 */
function phaseRule(phase: 1 | 2 | 3): { maxWords: number; rate: number } {
  if (phase === 1) return { maxWords: 6, rate: 0.9 };
  if (phase === 2) return { maxWords: 10, rate: 1.0 };
  return { maxWords: Infinity, rate: 1.0 };
}

export default function Listening({
  store,
  onUpdate,
  onTaskDone,
  onBack,
}: Props): React.JSX.Element {
  const [mode, setMode] = useState<Mode>('single');
  const [word, setWord] = useState<Word | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [replays, setReplays] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(0);

  const rule = phaseRule(store.plan.currentPhase);
  const { speak } = useTTS(store.settings.speechRate, store.settings.preferredVoice);

  const pick = useCallback((): void => {
    const learned = WORDS.filter((w) => store.words[w.en.toLowerCase()]?.seen);
    const base = learned.length > 0 ? learned : WORDS;
    // 按阶段限制句长，太严则放宽
    const fit = base.filter((w) => w.example.split(/\s+/).length <= rule.maxWords);
    const pool = fit.length > 0 ? fit : base;
    setWord(pool[Math.floor(Math.random() * pool.length)]);
    setPicked(null);
    setReplays(0);
  }, [store.words, rule.maxWords]);

  useEffect(() => {
    pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 新题自动播一次
  useEffect(() => {
    if (word && picked === null && replays === 0) speak(word.example, rule.rate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  const options = useMemo(() => (word ? buildMeaningOptions(word) : []), [word]);

  function choose(opt: string): void {
    if (!word || picked !== null) return;
    const correct = opt === word.exampleZh;
    setPicked(opt);
    // 每次重听扣 1 分，最低 0 分
    if (correct) setScore((s) => s + Math.max(0, 10 - replays));
    speak(word.example, rule.rate);

    onUpdate((prev) => ({
      ...prev,
      listening: {
        totalAttempts: prev.listening.totalAttempts + 1,
        correctCount: prev.listening.correctCount + (correct ? 1 : 0),
        history: [
          ...prev.listening.history.slice(-49),
          { text: word.example, correct, date: todayStr() },
        ],
      },
    }));
    setDone((d) => d + 1);
    onTaskDone();
  }

  const isCorrect = Boolean(word) && picked === word?.exampleZh;

  // 头部与模式切换对两种模式通用
  const chrome = (
    <>
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          ‹
        </button>
        <div className="title">听辨训练</div>
        {mode === 'single' && (
          <span className="muted">
            {done} 题 · {score} 分
          </span>
        )}
      </div>

      <div className="tabs">
        <button
          className={`tab ${mode === 'single' ? 'active' : ''}`}
          onClick={() => setMode('single')}
        >
          单句听辨
        </button>
        <button
          className={`tab ${mode === 'passage' ? 'active' : ''}`}
          onClick={() => setMode('passage')}
        >
          连续听力
        </button>
      </div>
    </>
  );

  // 连续听力：听整段短文/对话再答理解题
  if (mode === 'passage') {
    return (
      <div className="app">
        {chrome}
        <PassageListening store={store} onUpdate={onUpdate} onTaskDone={onTaskDone} />
      </div>
    );
  }

  if (!word) {
    return (
      <div className="app">
        {chrome}
        <div className="empty">加载中…</div>
      </div>
    );
  }

  return (
    <div className="app">
      {chrome}

      <div className="card">
        <p className="muted" style={{ marginBottom: 12 }}>
          只听声音，选出这句话的意思
        </p>
        <button
          className="btn btn-block btn-secondary"
          disabled={picked !== null || replays >= 3}
          onClick={() => {
            speak(word.example, rule.rate);
            setReplays((r) => r + 1);
          }}
        >
          🔊 再听一次（剩 {Math.max(0, 3 - replays)} 次，每次扣 1 分）
        </button>
      </div>

      <div className="card">
        {options.map((opt, oi) => (
          <button
            key={oi}
            className={`option ${
              picked === null
                ? ''
                : opt === word.exampleZh
                  ? 'correct'
                  : opt === picked
                    ? 'wrong'
                    : ''
            }`}
            disabled={picked !== null}
            onClick={() => choose(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {picked !== null && (
        <>
          <div className={`feedback ${isCorrect ? 'correct' : 'error'}`}>
            <strong>{isCorrect ? '✅ 听对了' : '❌ 再听听看'}</strong>
            <p style={{ marginTop: 6, fontSize: 17 }}>{word.example}</p>
            <p className="muted">{word.exampleZh}</p>
          </div>
          <div className="btn-row" style={{ marginTop: 12 }}>
            <button
              className="btn btn-secondary"
              onClick={() => speak(word.example, rule.rate)}
            >
              🔊 重听
            </button>
            <button className="btn" onClick={pick}>
              下一句
            </button>
          </div>
        </>
      )}
    </div>
  );
}
