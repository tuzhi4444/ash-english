// Shadowing 跟读：播放原声 → 跟读 → 语音识别校验
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LearningStore, Word } from '../types';
import { WORDS } from '../data/words';
import { useTTS } from '../hooks/useTTS';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { compareSpeech, type DiffResult } from '../utils/text';
import { todayStr } from '../utils/plan';

/** 用户上传音频存这里，单独于主 store 以免撑爆学习数据 */
const AUDIO_KEY = 'ash_english_v2_audio';
const MAX_AUDIO_BYTES = 500 * 1024;

function loadAudioMap(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(AUDIO_KEY) ?? '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

interface Props {
  store: LearningStore;
  onUpdate: (fn: (prev: LearningStore) => LearningStore) => void;
  onTaskDone: () => void;
  onBack: () => void;
}

export default function Shadowing({
  store,
  onUpdate,
  onTaskDone,
  onBack,
}: Props): React.JSX.Element {
  const [word, setWord] = useState<Word | null>(null);
  const [rate, setRate] = useState(1.0);
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [audioMap, setAudioMap] = useState<Record<string, string>>(loadAudioMap);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [done, setDone] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { speak } = useTTS(store.settings.speechRate, store.settings.preferredVoice);
  const { isListening, transcript, start, stop, reset, isSupported, error } =
    useSpeechRecognition();

  /** 优先从今日学过的词里取句子，没有则从全库随机 */
  const pickWord = useCallback((): void => {
    const learned = WORDS.filter((w) => store.words[w.en.toLowerCase()]?.seen);
    const pool = learned.length > 0 ? learned : WORDS;
    setWord(pool[Math.floor(Math.random() * pool.length)]);
    setDiff(null);
    reset();
  }, [store.words, reset]);

  useEffect(() => {
    pickWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 识别停止后自动比对
  useEffect(() => {
    if (!isListening && transcript && word && !diff) {
      const d = compareSpeech(word.example, transcript);
      setDiff(d);
      saveResult(word, d.accuracy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  function saveResult(w: Word, accuracy: number): void {
    onUpdate((prev) => {
      const total = prev.shadowing.totalAttempts + 1;
      const avg =
        (prev.stats.averageShadowingAccuracy * prev.shadowing.totalAttempts + accuracy) /
        total;
      return {
        ...prev,
        shadowing: {
          totalAttempts: total,
          bestAccuracy: Math.max(prev.shadowing.bestAccuracy, accuracy),
          practicedWords: Array.from(new Set([...prev.shadowing.practicedWords, w.en])),
          history: [
            ...prev.shadowing.history.slice(-49),
            { text: w.example, accuracy, date: todayStr() },
          ],
        },
        stats: {
          ...prev.stats,
          totalShadowingAttempts: total,
          averageShadowingAccuracy: avg,
        },
      };
    });
    setDone((d) => d + 1);
    onTaskDone();
  }

  /** 有用户上传音频就放真人发音，否则用 TTS */
  function play(): void {
    if (!word) return;
    const data = audioMap[word.en.toLowerCase()];
    if (data) {
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = data;
      audioRef.current.playbackRate = rate;
      void audioRef.current.play();
      return;
    }
    speak(word.example, rate);
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file || !word) return;
    setUploadError(null);
    if (file.size > MAX_AUDIO_BYTES) {
      setUploadError(`文件 ${Math.round(file.size / 1024)}KB，超过 500KB 上限`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const next = { ...audioMap, [word.en.toLowerCase()]: String(reader.result) };
      try {
        localStorage.setItem(AUDIO_KEY, JSON.stringify(next));
        setAudioMap(next);
      } catch {
        setUploadError('浏览器存储已满，无法保存音频');
      }
    };
    reader.readAsDataURL(file);
  }

  if (!word) {
    return (
      <div className="app">
        <div className="empty">加载中…</div>
      </div>
    );
  }

  const hasAudio = Boolean(audioMap[word.en.toLowerCase()]);
  const pct = diff ? Math.round(diff.accuracy * 100) : 0;
  const level = pct > 80 ? 'high' : pct >= 60 ? 'mid' : 'low';

  return (
    <div className="app">
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          ‹
        </button>
        <div className="title">Shadowing 跟读</div>
        <span className="muted">已完成 {done}</span>
      </div>

      <div className="card">
        <p style={{ fontSize: 19, marginBottom: 6 }}>{word.example}</p>
        <p className="muted">{word.exampleZh}</p>
        {hasAudio && (
          <span className="tag green" style={{ marginTop: 8 }}>
            已关联真人音频
          </span>
        )}
      </div>

      <div className="card">
        <button className="btn btn-block btn-secondary" onClick={play}>
          🔊 播放原声
        </button>
        <div className="tabs" style={{ marginTop: 12, marginBottom: 0 }}>
          {[0.8, 1.0].map((r) => (
            <button
              key={r}
              className={`tab ${rate === r ? 'active' : ''}`}
              onClick={() => setRate(r)}
            >
              {r}x
            </button>
          ))}
        </div>
        <button
          className="btn btn-block btn-ghost"
          style={{ marginTop: 12 }}
          onClick={() => fileRef.current?.click()}
        >
          📁 上传真人发音（&lt;500KB）
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="audio/mpeg,audio/wav,audio/mp3"
          style={{ display: 'none' }}
          onChange={onUpload}
        />
        {uploadError && <div className="feedback error">{uploadError}</div>}
      </div>

      {/* 支持语音识别：正常跟读校验 */}
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
            {isListening ? '⏹ 停止跟读' : '🎤 开始跟读'}
          </button>
          {isListening && (
            <div className="hint">
              正在听…… {transcript || '请对着麦克风朗读上面的句子'}
            </div>
          )}
          {error && <div className="feedback error">{error}</div>}
        </>
      ) : (
        <div className="card">
          <div className="hint" style={{ marginTop: 0, marginBottom: 12 }}>
            当前浏览器不支持语音识别，已切换为纯跟读模式：听原声 → 自己跟读 → 自评。
          </div>
          <div className="btn-row">
            <button
              className="btn btn-secondary"
              onClick={() => {
                saveResult(word, 0.5);
                pickWord();
              }}
            >
              再来一次
            </button>
            <button
              className="btn btn-success"
              onClick={() => {
                saveResult(word, 1);
                pickWord();
              }}
            >
              满意
            </button>
          </div>
        </div>
      )}

      {/* 匹配结果 */}
      {diff && (
        <div className="card">
          <div className="center">
            <div className={`accuracy ${level}`}>{pct}%</div>
            <div className="muted">词级匹配率</div>
          </div>
          <div className="word-diff">
            {diff.words.map((w, i) => (
              <span key={`${w.word}-${i}`} className={w.hit ? 'hit' : 'miss'}>
                {w.word}
              </span>
            ))}
          </div>
          {transcript && (
            <p className="muted" style={{ marginTop: 8 }}>
              识别到：{transcript}
            </p>
          )}
        </div>
      )}

      {diff && (
        <div className="btn-row">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setDiff(null);
              reset();
            }}
          >
            重读
          </button>
          <button className="btn" onClick={pickWord}>
            换一句
          </button>
        </div>
      )}
    </div>
  );
}
