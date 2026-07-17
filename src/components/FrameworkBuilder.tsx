// 框架造句：模板 + 中文提示 → 填正确词形，答错走三级渐进提示
import { useCallback, useEffect, useState } from 'react';
import type { Framework, LearningStore, Word } from '../types';
import { WORDS } from '../data/words';
import { useTTS } from '../hooks/useTTS';
import { getUnlockedFrameworks, todayStr } from '../utils/plan';
import {
  buildFormOptions,
  fillTemplate,
  fillTemplateZh,
  getCorrectAnswer,
  selectFramework,
  selectWordForFramework,
} from '../utils/framework';

const SENTENCE_LABELS: Record<Framework['sentenceType'], string> = {
  declarative: '陈述句',
  interrogative: '疑问句',
  imperative: '祈使句',
};

const SLOT_LABELS: Record<Framework['slotType'], string> = {
  infinitive: '动词原形',
  present: '第三人称单数',
  ing: '现在分词',
  past: '过去式',
  pastParticiple: '过去分词',
  noun: '名词',
  adjective: '形容词',
};

interface Props {
  store: LearningStore;
  onUpdate: (fn: (prev: LearningStore) => LearningStore) => void;
  onTaskDone: () => void;
  onBack: () => void;
}

interface Question {
  framework: Framework;
  word: Word;
  answer: string;
}

export default function FrameworkBuilder({
  store,
  onUpdate,
  onTaskDone,
  onBack,
}: Props): React.JSX.Element {
  const [q, setQ] = useState<Question | null>(null);
  const [input, setInput] = useState('');
  /** 0=未答，1/2=已错次数，3=公布答案 */
  const [wrongCount, setWrongCount] = useState(0);
  const [solved, setSolved] = useState(false);
  const [formOptions, setFormOptions] = useState<string[]>([]);
  const [done, setDone] = useState(0);

  const { speak } = useTTS(store.settings.speechRate, store.settings.preferredVoice);

  const nextQuestion = useCallback((): void => {
    const pool = getUnlockedFrameworks(store.plan.currentPhase);
    // 个别框架可能选不到词，最多重试 10 次
    for (let i = 0; i < 10; i++) {
      // 按 box 加权：答错多的框架更常出现
      const framework = selectFramework(pool, store.framework);
      if (!framework) break;
      const word = selectWordForFramework(
        framework,
        WORDS,
        store.words,
        store.plan.currentPhase
      );
      if (word) {
        setQ({ framework, word, answer: getCorrectAnswer(word, framework.slotType) });
        setInput('');
        setWrongCount(0);
        setSolved(false);
        setFormOptions([]);
        return;
      }
    }
    setQ(null);
  }, [store.plan.currentPhase, store.words, store.framework]);

  useEffect(() => {
    nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 写入框架练习记录 */
  function record(framework: Framework, word: Word, correct: boolean): void {
    onUpdate((prev) => {
      const old = prev.framework[framework.id] ?? {
        attempts: 0,
        correct: 0,
        lastPracticed: '',
        wordsUsed: [],
        box: 1,
      };
      return {
        ...prev,
        framework: {
          ...prev.framework,
          [framework.id]: {
            attempts: old.attempts + 1,
            correct: old.correct + (correct ? 1 : 0),
            lastPracticed: todayStr(),
            wordsUsed: Array.from(new Set([...old.wordsUsed, word.en])),
            box: correct ? Math.min(old.box + 1, 5) : 1,
          },
        },
        stats: {
          ...prev.stats,
          totalFrameworkAttempts: prev.stats.totalFrameworkAttempts + 1,
        },
      };
    });
  }

  function check(value: string): void {
    if (!q) return;
    const correct = value.trim().toLowerCase() === q.answer.toLowerCase();
    if (correct) {
      setSolved(true);
      record(q.framework, q.word, wrongCount === 0);
      speak(fillTemplate(q.framework.template, q.answer));
      return;
    }

    const nextWrong = wrongCount + 1;
    setWrongCount(nextWrong);
    if (nextWrong === 2) {
      setFormOptions(buildFormOptions(q.word, q.framework.slotType));
    }
    if (nextWrong >= 3) {
      setSolved(true);
      record(q.framework, q.word, false);
      speak(fillTemplate(q.framework.template, q.answer));
    }
  }

  function goNext(): void {
    const n = done + 1;
    setDone(n);
    onTaskDone();
    nextQuestion();
  }

  if (!q) {
    return (
      <div className="app">
        <div className="header">
          <button className="back-btn" onClick={onBack}>
            ‹
          </button>
          <div className="title">框架造句</div>
        </div>
        <div className="empty">
          <span className="emoji">🤔</span>
          暂时选不出合适的词，去学几个新词再回来。
        </div>
      </div>
    );
  }

  const filled = fillTemplate(q.framework.template, solved ? q.answer : '________');
  const isRight = solved && wrongCount === 0;

  return (
    <div className="app">
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          ‹
        </button>
        <div className="title">框架造句</div>
        <span className="muted">已完成 {done}</span>
      </div>

      <div className="card">
        <div className="row" style={{ marginBottom: 8 }}>
          <span className="tag">{SENTENCE_LABELS[q.framework.sentenceType]}</span>
          <span className="tag grey">{SLOT_LABELS[q.framework.slotType]}</span>
        </div>
        <div className="muted" style={{ marginBottom: 12 }}>
          语法点：{q.framework.grammarPoint}
        </div>

        <p style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>{filled}</p>
        <p className="muted" style={{ marginBottom: 12 }}>
          提示：{q.word.zh}
        </p>

        {!solved && wrongCount < 2 && (
          <>
            <input
              className="input"
              value={input}
              placeholder="填入正确词形"
              autoCapitalize="none"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && check(input)}
            />
            <button className="btn btn-block" style={{ marginTop: 12 }} onClick={() => check(input)}>
              校验
            </button>
          </>
        )}

        {/* 第 2 次答错：三选一 */}
        {!solved && wrongCount === 2 && (
          <>
            <div className="hint" style={{ marginBottom: 12 }}>
              这个词是 <strong>{q.word.en}</strong>，请选择正确形态：
            </div>
            {formOptions.map((opt, oi) => (
              <button key={oi} className="option" onClick={() => check(opt)}>
                {opt}
              </button>
            ))}
          </>
        )}
      </div>

      {/* 第 1 次答错：首字母提示 */}
      {!solved && wrongCount === 1 && (
        <div className="hint">
          再试试：以 <strong>{q.answer[0]}</strong> 开头的{SLOT_LABELS[q.framework.slotType]}
        </div>
      )}

      {solved && (
        <>
          <div className={`feedback ${isRight ? 'correct' : 'wrong'}`}>
            <strong>{isRight ? '✅ 答对了' : `正确答案：${q.answer}`}</strong>
            <p style={{ marginTop: 6, fontSize: 17 }}>
              {fillTemplate(q.framework.template, q.answer)}
            </p>
            <p className="muted">
              {fillTemplateZh(q.framework.templateZh, q.word.zh, q.framework.slotType)}
            </p>
            {!isRight && (
              <p className="muted" style={{ marginTop: 6 }}>
                {q.framework.grammarPoint}
              </p>
            )}
          </div>
          <div className="btn-row" style={{ marginTop: 12 }}>
            <button
              className="btn btn-secondary"
              onClick={() => speak(fillTemplate(q.framework.template, q.answer))}
            >
              🔊 朗读
            </button>
            <button className="btn" onClick={goNext}>
              下一个
            </button>
          </div>
        </>
      )}
    </div>
  );
}
