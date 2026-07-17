// 连续听力：听整段短文/对话 → 答理解题 → 对照原文
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LearningStore, Passage } from '../types';
import { getUnlockedPassages, shuffleOptions } from '../data/passages';
import { useTTS } from '../hooks/useTTS';
import { todayStr } from '../utils/plan';
import PassageImport from './PassageImport';

interface Props {
  store: LearningStore;
  onUpdate: (fn: (prev: LearningStore) => LearningStore) => void;
  /** @param amount 计入听辨任务的题数 */
  onTaskDone: (amount?: number) => void;
}

/** 阶段决定语速：越往后越接近真实语速 */
function rateFor(phase: 1 | 2 | 3): number {
  if (phase === 1) return 0.85;
  if (phase === 2) return 0.95;
  return 1.0;
}

const MAX_PLAYS = 3;

export default function PassageListening({
  store,
  onUpdate,
  onTaskDone,
}: Props): React.JSX.Element {
  const [passage, setPassage] = useState<Passage | null>(null);
  const [plays, setPlays] = useState(0);
  const [stage, setStage] = useState<'listen' | 'quiz' | 'review'>('listen');
  /** 每题选了哪个下标，null = 未答 */
  const [picked, setPicked] = useState<(number | null)[]>([]);
  const [showImport, setShowImport] = useState(false);

  const rate = rateFor(store.plan.currentPhase);
  const { speak, cancel } = useTTS(store.settings.speechRate, store.settings.preferredVoice);

  // 内置（按阶段解锁）+ 用户导入的（不分阶段，用户自己挑的难度自己负责）
  const pool = useMemo(
    () => [...getUnlockedPassages(store.plan.currentPhase), ...store.customPassages],
    [store.plan.currentPhase, store.customPassages]
  );
  const unseenCount = pool.filter((p) => !store.passage.completed.includes(p.id)).length;

  /** 优先挑没做过的，全做过了就随机重来（重来不计配额，见 submit） */
  const pick = useCallback((): void => {
    const unseen = pool.filter((p) => !store.passage.completed.includes(p.id));
    const source = unseen.length > 0 ? unseen : pool;
    if (source.length === 0) {
      setPassage(null);
      return;
    }
    const next = source[Math.floor(Math.random() * source.length)];
    // 每次选中都重新打乱选项：素材里正确项固定写在第一个，
    // 不打乱就等于"一路点第一个必满分"；重练时也换顺序，
    // 记住的才是"哪句对"而不是"点第几个"
    const prepared = shuffleOptions(next);
    setPassage(prepared);
    setPicked(new Array(prepared.questions.length).fill(null));
    setPlays(0);
    setStage('listen');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, store.passage.completed]);

  useEffect(() => {
    pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 离开时别让 TTS 继续念
  useEffect(() => cancel, [cancel]);

  /** 导入成功后直接练这一篇 */
  function startImported(p: Passage): void {
    setShowImport(false);
    setPassage(p);
    setPicked(new Array(p.questions.length).fill(null));
    setPlays(0);
    setStage('listen');
  }

  if (showImport) {
    return (
      <PassageImport
        store={store}
        onUpdate={onUpdate}
        onCancel={() => setShowImport(false)}
        onImported={startImported}
      />
    );
  }

  if (!passage) {
    return (
      <>
        <div className="empty">
          <span className="emoji">📭</span>
          还没有可练的材料
        </div>
        <button className="btn btn-block" onClick={() => setShowImport(true)}>
          ➕ 导入材料
        </button>
      </>
    );
  }

  const fullText = passage.lines.join(' ');
  // 做过的篇目重练不计入今日目标：答案早知道了，再计等于白拿配额
  const isReplay = store.passage.completed.includes(passage.id);
  const answered = picked.every((p) => p !== null);
  const score = picked.reduce<number>(
    (s, p, i) => s + (p === passage.questions[i].answer ? 1 : 0),
    0
  );

  function playAll(): void {
    if (!passage) return;
    speak(fullText, rate);
    setPlays((p) => p + 1);
  }

  function choose(qi: number, oi: number): void {
    if (picked[qi] !== null) return;
    const next = [...picked];
    next[qi] = oi;
    setPicked(next);
  }

  /** 交卷：记分并进入对照原文 */
  function submit(): void {
    if (!passage) return;
    const correct = picked.reduce<number>(
      (s, p, i) => s + (p === passage.questions[i].answer ? 1 : 0),
      0
    );
    onUpdate((prev) => ({
      ...prev,
      passage: {
        totalAttempts: prev.passage.totalAttempts + passage.questions.length,
        correctCount: prev.passage.correctCount + correct,
        completed: Array.from(new Set([...prev.passage.completed, passage.id])),
        history: [
          ...prev.passage.history.slice(-49),
          {
            passageId: passage.id,
            score: correct,
            total: passage.questions.length,
            date: todayStr(),
          },
        ],
      },
    }));
    // 只有首次做这一篇才计入配额。
    // 否则 15 篇内置材料做完后，答案已经背熟，点几下就能白拿满今天的听辨目标——
    // 硬卡关会被这条路绕过去。重练仍然有听力价值，所以不禁止，只是不给配额。
    if (isReplay) {
      setStage('review');
      return;
    }
    // 按题数计入，而非整篇算 1：一篇短文含 2-3 道理解题，
    // 花的时间和脑力都远超一道单句题，算 1 会让人宁可去刷单句
    onTaskDone(passage.questions.length);
    setStage('review');
  }

  // ---- 第一步：只听，不给文字 ----
  if (stage === 'listen') {
    return (
      <>
        <div className="card">
          <div className="row" style={{ marginBottom: 8 }}>
            <strong>{passage.title}</strong>
            <span className="tag grey">
              {passage.lines.length} 句
              {passage.source === 'imported' && ' · 我导入的'}
            </span>
          </div>
          <p className="muted" style={{ marginBottom: 12 }}>
            先完整听一遍，别看文字。听懂大意就行，不用每个词都抓住。
          </p>
          <button
            className="btn btn-block"
            disabled={plays >= MAX_PLAYS}
            onClick={playAll}
          >
            🔊 {plays === 0 ? '播放全文' : `再听一遍（剩 ${MAX_PLAYS - plays} 次）`}
          </button>
        </div>

        {isReplay && (
          <div className="hint">
            这篇你做过了，重听只当练习，<strong>不计入今日目标</strong>
            （答案已知，再计等于白拿）。想要新材料就导入一篇。
          </div>
        )}

        <div className="row" style={{ marginBottom: 12 }}>
          <span className="muted">未做过的材料还剩 {unseenCount} 篇</span>
          <button
            className="btn btn-ghost"
            style={{ height: 36 }}
            onClick={() => setShowImport(true)}
          >
            ➕ 导入材料
          </button>
        </div>

        {plays > 0 && (
          <button className="btn btn-block btn-success" onClick={() => setStage('quiz')}>
            听好了，开始答题
          </button>
        )}
      </>
    );
  }

  // ---- 第二步：答理解题 ----
  if (stage === 'quiz') {
    return (
      <>
        <div className="card">
          <div className="row">
            <strong>{passage.title}</strong>
            <button
              className="btn btn-secondary"
              style={{ height: 36 }}
              disabled={plays >= MAX_PLAYS}
              onClick={playAll}
            >
              🔊 再听（剩 {MAX_PLAYS - plays}）
            </button>
          </div>
        </div>

        {/* key 用下标而非题干：导入材料的题目题干全都一样
            （"下面哪一句出现在刚才的录音里？"），用题干当 key 会重复，
            React 会认错组件身份，点一题的选项可能串到另一题上 */}
        {passage.questions.map((question, qi) => (
          <div className="card" key={qi}>
            <p style={{ marginBottom: 10 }}>
              {qi + 1}. {question.q}
            </p>
            {question.options.map((opt, oi) => (
              <button
                key={oi}
                className={`option ${picked[qi] === oi ? 'correct' : ''}`}
                onClick={() => choose(qi, oi)}
              >
                {opt}
              </button>
            ))}
          </div>
        ))}

        <button className="btn btn-block" disabled={!answered} onClick={submit}>
          {answered ? '交卷' : `还有 ${picked.filter((p) => p === null).length} 题没答`}
        </button>
      </>
    );
  }

  // ---- 第三步：对照原文 ----
  const pct = Math.round((score / passage.questions.length) * 100);
  const level = pct >= 80 ? 'high' : pct >= 60 ? 'mid' : 'low';

  return (
    <>
      <div className="card center">
        <div className={`accuracy ${level}`}>
          {score}/{passage.questions.length}
        </div>
        <div className="muted">听力理解得分</div>
      </div>

      {passage.questions.map((question, qi) => {
        const ok = picked[qi] === question.answer;
        return (
          <div className={`feedback ${ok ? 'correct' : 'error'}`} key={qi}>
            <strong>
              {ok ? '✅' : '❌'} {question.q}
            </strong>
            {!ok && (
              <p className="muted" style={{ marginTop: 4 }}>
                正确答案：{question.options[question.answer]}
              </p>
            )}
          </div>
        );
      })}

      <div className="card" style={{ marginTop: 12 }}>
        <div className="muted" style={{ marginBottom: 8 }}>
          对照原文（点任意一句可单独重听）
        </div>
        {/* key 用下标：导入的材料完全可能有重复句（歌词尤其常见） */}
        {passage.lines.map((line, i) => (
          <div
            key={i}
            style={{
              padding: '8px 0',
              borderBottom:
                i < passage.lines.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: 'pointer',
            }}
            onClick={() => speak(line, rate)}
          >
            <p style={{ fontSize: 16 }}>🔊 {line}</p>
            <p className="muted">{passage.linesZh[i]}</p>
          </div>
        ))}
      </div>

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={playAll}>
          🔊 重听全文
        </button>
        <button className="btn" onClick={pick}>
          下一篇
        </button>
      </div>
    </>
  );
}
