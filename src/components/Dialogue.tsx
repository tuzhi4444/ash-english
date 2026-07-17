// 对话场景模拟：听对方说 → 轮到你接话 → 对照参考说法
//
// 跟 Shadowing 的关键区别：对话没有标准答案。
// 参考说法只是"一种"说法，匹配率只做提示、绝不判对错、绝不卡关——
// 逼你说出跟脚本一字不差的句子，那是默写，不是对话。
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Dialogue, LearningStore } from '../types';
import { getUnlockedDialogues } from '../data/dialogues';
import { pickPartnerVoice, useTTS } from '../hooks/useTTS';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { compareSpeech, type DiffResult } from '../utils/text';
import { todayStr } from '../utils/plan';

interface Props {
  store: LearningStore;
  onUpdate: (fn: (prev: LearningStore) => LearningStore) => void;
  /** 每接一次话上报一次（对话配额按接话轮数算） */
  onTurnDone: () => void;
  onBack: () => void;
}

/** 阶段决定对方的语速：越往后越接近真实语速 */
function rateFor(phase: 1 | 2 | 3): number {
  if (phase === 1) return 0.9;
  if (phase === 2) return 0.95;
  return 1.0;
}

export default function DialoguePractice({
  store,
  onUpdate,
  onTurnDone,
  onBack,
}: Props): React.JSX.Element {
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [cursor, setCursor] = useState(0);
  /** 对方轮：是否显示原文；你的轮：是否显示参考说法 */
  const [revealed, setRevealed] = useState(false);
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [finished, setFinished] = useState(false);
  /** 已计入配额的"你的轮"下标，避免同一轮重说重复计数 */
  const counted = useRef<Set<number>>(new Set());
  /** 本场对话你说过的匹配率，用于结束时存平均分 */
  const accuracies = useRef<number[]>([]);

  const rate = rateFor(store.plan.currentPhase);
  const { speak, cancel, voices } = useTTS(
    store.settings.speechRate,
    store.settings.preferredVoice
  );
  const { isListening, transcript, start, stop, reset, isSupported, error } =
    useSpeechRecognition();

  // 对方用一个跟主语音不同的声音，才像两个人在对话
  const partnerVoice = useMemo(
    () => pickPartnerVoice(voices, store.settings.preferredVoice)?.name ?? null,
    [voices, store.settings.preferredVoice]
  );

  const pool = useMemo(
    () => getUnlockedDialogues(store.plan.currentPhase),
    [store.plan.currentPhase]
  );

  const pick = useCallback((): void => {
    if (pool.length === 0) {
      setDialogue(null);
      return;
    }
    // 优先挑没练过的，全练过就随机重来（重来照常计配额——输出练习重复才有价值）
    const fresh = pool.filter((dlg) => !store.dialogue.practiced.includes(dlg.id));
    const source = fresh.length > 0 ? fresh : pool;
    const next = source[Math.floor(Math.random() * source.length)];
    setDialogue(next);
    setCursor(0);
    setRevealed(false);
    setDiff(null);
    setFinished(false);
    counted.current = new Set();
    accuracies.current = [];
    reset();
  }, [pool, store.dialogue.practiced, reset]);

  useEffect(() => {
    pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 离开时停掉 TTS
  useEffect(() => cancel, [cancel]);

  const turn = dialogue?.turns[cursor] ?? null;

  // 进入"对方轮"自动播一遍
  useEffect(() => {
    if (turn?.speaker === 'partner') {
      speak(turn.en, rate, partnerVoice);
      setRevealed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, dialogue]);

  // 识别停止后自动比对参考说法（仅提示，不判对错）
  useEffect(() => {
    if (!isListening && transcript && turn?.speaker === 'you' && !diff) {
      const d = compareSpeech(turn.en, transcript);
      setDiff(d);
      accuracies.current.push(d.accuracy);
      setRevealed(true);
      countTurn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  /** 把当前"你的轮"计入配额（每轮只计一次） */
  function countTurn(): void {
    if (!dialogue || turn?.speaker !== 'you') return;
    if (counted.current.has(cursor)) return;
    counted.current.add(cursor);
    onUpdate((prev) => ({
      ...prev,
      dialogue: {
        ...prev.dialogue,
        totalTurns: prev.dialogue.totalTurns + 1,
        practiced: Array.from(new Set([...prev.dialogue.practiced, dialogue.id])),
      },
    }));
    onTurnDone();
  }

  function advance(): void {
    if (!dialogue) return;
    stop();
    reset();
    setDiff(null);
    // 必须复位：否则上一轮"看原文/看参考"留下的 revealed=true 会带进下一轮，
    // 你的轮会直接把参考答案亮出来，逼你先自己说的意义就没了
    setRevealed(false);
    if (cursor + 1 >= dialogue.turns.length) {
      finish();
    } else {
      setCursor((c) => c + 1);
    }
  }

  function finish(): void {
    if (!dialogue) return;
    const accs = accuracies.current;
    if (accs.length > 0) {
      const avg = accs.reduce((a, b) => a + b, 0) / accs.length;
      onUpdate((prev) => ({
        ...prev,
        dialogue: {
          ...prev.dialogue,
          history: [
            ...prev.dialogue.history.slice(-49),
            { dialogueId: dialogue.id, accuracy: avg, date: todayStr() },
          ],
        },
      }));
    }
    setFinished(true);
  }

  // ---- 没有可练的（理论上不会，内置 36 篇；防御 ----
  if (!dialogue) {
    return (
      <div className="app">
        <div className="header">
          <button className="back-btn" onClick={onBack}>
            ‹
          </button>
          <div className="title">对话模拟</div>
        </div>
        <div className="empty">
          <span className="emoji">💬</span>
          本阶段暂无对话场景
        </div>
      </div>
    );
  }

  const youTurns = dialogue.turns.filter((t) => t.speaker === 'you').length;
  const doneTurns = counted.current.size;

  // ---- 结束页 ----
  if (finished) {
    const accs = accuracies.current;
    const avgPct =
      accs.length > 0
        ? Math.round((accs.reduce((a, b) => a + b, 0) / accs.length) * 100)
        : null;
    return (
      <div className="app">
        <div className="header">
          <button className="back-btn" onClick={onBack}>
            ‹
          </button>
          <div className="title">对话完成</div>
        </div>
        <div className="card center">
          <div className="emoji" style={{ fontSize: 40 }}>
            🎉
          </div>
          <p style={{ fontSize: 18, marginTop: 8 }}>{dialogue.title}</p>
          <p className="muted" style={{ marginTop: 4 }}>
            这一场你接了 {youTurns} 次话
            {avgPct !== null && ` · 平均贴合度 ${avgPct}%`}
          </p>
          {avgPct !== null && (
            <p className="hint" style={{ marginTop: 8 }}>
              贴合度只是跟参考说法的重合度，<strong>不代表对错</strong>。
              你用别的说法把意思讲清楚了，一样是对的。
            </p>
          )}
        </div>
        <button className="btn btn-block" onClick={pick}>
          换一个场景
        </button>
        <button
          className="btn btn-block btn-secondary"
          style={{ marginTop: 8 }}
          onClick={() => {
            const same = dialogue;
            setDialogue(null);
            setTimeout(() => {
              setDialogue(same);
              setCursor(0);
              setRevealed(false);
              setDiff(null);
              setFinished(false);
              counted.current = new Set();
              accuracies.current = [];
            }, 0);
          }}
        >
          再演一遍这个
        </button>
      </div>
    );
  }

  const pct = diff ? Math.round(diff.accuracy * 100) : 0;
  const level = pct > 80 ? 'high' : pct >= 60 ? 'mid' : 'low';
  const isYou = turn?.speaker === 'you';

  return (
    <div className="app">
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          ‹
        </button>
        <div className="title">{dialogue.title}</div>
        <span className="muted">
          你 {doneTurns}/{youTurns}
        </span>
      </div>

      {/* 情境交代 */}
      <div className="hint" style={{ marginTop: 0 }}>
        {dialogue.scene}
      </div>

      {/* 进度点 */}
      <div className="row" style={{ gap: 4, margin: '4px 0 12px', flexWrap: 'wrap' }}>
        {dialogue.turns.map((t, i) => (
          <span
            key={i}
            title={t.speaker === 'you' ? '你' : '对方'}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background:
                i < cursor
                  ? 'var(--success, #3aa76d)'
                  : i === cursor
                    ? 'var(--accent, #4a7bec)'
                    : 'var(--border, #ddd)',
            }}
          />
        ))}
      </div>

      {turn && turn.speaker === 'partner' && (
        <>
          <div className="card">
            <div className="row" style={{ marginBottom: 8 }}>
              <span className="tag grey">🔊 对方说</span>
              <button
                className="btn btn-secondary"
                style={{ height: 36 }}
                onClick={() => speak(turn.en, rate, partnerVoice)}
              >
                重听
              </button>
            </div>
            {revealed ? (
              <>
                <p style={{ fontSize: 18 }}>{turn.en}</p>
                <p className="muted" style={{ marginTop: 4 }}>
                  {turn.zh}
                </p>
              </>
            ) : (
              <button
                className="btn btn-block btn-ghost"
                onClick={() => setRevealed(true)}
              >
                听不清？看原文
              </button>
            )}
          </div>
          <button className="btn btn-block" onClick={advance}>
            轮到我了 →
          </button>
        </>
      )}

      {turn && isYou && (
        <>
          <div className="card">
            <span className="tag orange">🗣 轮到你</span>
            <p style={{ fontSize: 17, marginTop: 8 }}>
              {turn.intent}
            </p>
            <p className="muted" style={{ marginTop: 4 }}>
              用你自己的话说出来，不用照参考。
            </p>
          </div>

          {/* 支持语音识别：开口 → 比对参考 */}
          {isSupported ? (
            <>
              <button
                className={`btn btn-block ${isListening ? 'btn-danger' : ''}`}
                onClick={() => {
                  if (isListening) {
                    stop();
                  } else {
                    setDiff(null);
                    start();
                  }
                }}
              >
                {isListening ? '⏹ 停止' : '🎤 开始说'}
              </button>
              {isListening && (
                <div className="hint">
                  正在听…… {transcript || '对着麦克风把你的话说出来'}
                </div>
              )}
              {error && <div className="feedback error">{error}</div>}
            </>
          ) : (
            <div className="card">
              <div className="hint" style={{ marginTop: 0, marginBottom: 12 }}>
                当前浏览器不支持语音识别，已切换为自评模式：自己开口说 → 看参考 → 继续。
              </div>
              <button
                className="btn btn-block btn-success"
                onClick={() => {
                  setRevealed(true);
                  countTurn();
                }}
              >
                我说完了，看参考
              </button>
            </div>
          )}

          {/* 不想说也能看参考（但不开口就不计入配额，逼一下自己） */}
          {!revealed && isSupported && (
            <button
              className="btn btn-block btn-ghost"
              style={{ marginTop: 8 }}
              onClick={() => setRevealed(true)}
            >
              卡住了？看参考说法
            </button>
          )}

          {/* 贴合度（仅提示） */}
          {diff && (
            <div className="card">
              <div className="center">
                <div className={`accuracy ${level}`}>{pct}%</div>
                <div className="muted">跟参考说法的贴合度（不是对错）</div>
              </div>
              {transcript && (
                <p className="muted" style={{ marginTop: 8 }}>
                  听到你说：{transcript}
                </p>
              )}
            </div>
          )}

          {/* 参考说法 */}
          {revealed && (
            <div className="card">
              <div className="muted" style={{ marginBottom: 4 }}>
                一种参考说法（点可听）
              </div>
              <p
                style={{ fontSize: 17, cursor: 'pointer' }}
                onClick={() => speak(turn.en, rate)}
              >
                🔊 {turn.en}
              </p>
              <p className="muted" style={{ marginTop: 4 }}>
                {turn.zh}
              </p>
            </div>
          )}

          {revealed && (
            <button className="btn btn-block btn-success" onClick={advance}>
              {cursor + 1 >= dialogue.turns.length ? '完成对话' : '下一句 →'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
