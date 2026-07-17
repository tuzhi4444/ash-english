// 词库浏览：搜索 / 筛选 / 字母索引 / 收藏 / 难词
import { useMemo, useRef, useState } from 'react';
import type { LearningStore, Word } from '../types';
import { WORDS } from '../data/words';
import { useTTS } from '../hooks/useTTS';
import { emptyRecord } from '../utils/srs';

type PosFilter = 'all' | 'v.' | 'n.' | 'adj.' | 'other';
type StatusFilter = 'all' | 'new' | 'learning' | 'mastered' | 'favorite' | 'difficult';

const POS_LABELS: Record<PosFilter, string> = {
  all: '全部',
  'v.': '动词',
  'n.': '名词',
  'adj.': '形容词',
  other: '其他',
};

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: '全部',
  new: '未学',
  learning: '学习中',
  mastered: '已掌握',
  favorite: '收藏',
  difficult: '难词',
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface Props {
  store: LearningStore;
  onUpdate: (fn: (prev: LearningStore) => LearningStore) => void;
  onBack: () => void;
}

export default function WordBrowser({ store, onUpdate, onBack }: Props): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState<PosFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const { speak } = useTTS(store.settings.speechRate, store.settings.preferredVoice);

  const difficultCount = Object.values(store.words).filter((r) => r.markedDifficult).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WORDS.filter((w) => {
      if (q && !w.en.toLowerCase().includes(q) && !w.zh.includes(q)) return false;

      if (pos === 'other') {
        if (['v.', 'n.', 'adj.'].includes(w.pos)) return false;
      } else if (pos !== 'all' && w.pos !== pos) {
        return false;
      }

      const r = store.words[w.en.toLowerCase()];
      switch (status) {
        case 'new':
          return !r?.seen && !r?.testSkipped;
        case 'learning':
          return Boolean(r?.seen) && !r?.mastered;
        case 'mastered':
          return Boolean(r?.mastered);
        case 'favorite':
          return Boolean(r?.favorite);
        case 'difficult':
          return Boolean(r?.markedDifficult);
        default:
          return true;
      }
    });
  }, [query, pos, status, store.words]);

  /** 翻转某个词的收藏 / 难词标记 */
  function toggleFlag(en: string, flag: 'favorite' | 'markedDifficult'): void {
    const key = en.toLowerCase();
    onUpdate((prev) => {
      const rec = prev.words[key] ?? emptyRecord();
      return {
        ...prev,
        words: { ...prev.words, [key]: { ...rec, [flag]: !rec[flag] } },
      };
    });
  }

  function jumpTo(letter: string): void {
    const el = listRef.current?.querySelector(`[data-initial="${letter}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function statusTag(w: Word): React.JSX.Element {
    const r = store.words[w.en.toLowerCase()];
    if (r?.mastered) return <span className="tag green">已掌握</span>;
    if (r?.seen) return <span className="tag orange">学习中</span>;
    return <span className="tag grey">未学</span>;
  }

  return (
    <div className="app">
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          ‹
        </button>
        <div className="title">📖 词库浏览</div>
      </div>

      <input
        className="input"
        style={{ marginBottom: 12 }}
        placeholder="搜索英文或中文"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {difficultCount > 0 && status !== 'difficult' && (
        <button
          className="btn btn-block btn-secondary"
          style={{ marginBottom: 12 }}
          onClick={() => setStatus('difficult')}
        >
          ⚠ 只看难词（{difficultCount}）
        </button>
      )}

      <div className="filter-bar">
        {(Object.keys(POS_LABELS) as PosFilter[]).map((p) => (
          <button
            key={p}
            className={`chip ${pos === p ? 'active' : ''}`}
            onClick={() => setPos(p)}
          >
            {POS_LABELS[p]}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((s) => (
          <button
            key={s}
            className={`chip ${status === s ? 'active' : ''}`}
            onClick={() => setStatus(s)}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="alpha-index">
        {ALPHABET.map((l) => (
          <button key={l} onClick={() => jumpTo(l)}>
            {l}
          </button>
        ))}
      </div>

      <div className="muted" style={{ marginBottom: 8 }}>
        共 {filtered.length} 个词
      </div>

      <div ref={listRef}>
        {filtered.length === 0 ? (
          <div className="empty">
            <span className="emoji">🔍</span>
            没有匹配的词
          </div>
        ) : (
          // 只渲染前 200 条，避免一次性铺 1423 个节点拖慢滚动
          filtered.slice(0, 200).map((w) => {
            const key = w.en.toLowerCase();
            const rec = store.words[key];
            const open = expanded === key;
            return (
              <div className="word-row" key={key} data-initial={w.en[0].toUpperCase()}>
                <div className="word-head" onClick={() => setExpanded(open ? null : key)}>
                  <span className="en">{w.en}</span>
                  <span className="tag grey">{w.pos}</span>
                  <span className="zh">{w.zh}</span>
                  {statusTag(w)}
                  <button
                    className={`icon-btn ${rec?.favorite ? 'on' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFlag(w.en, 'favorite');
                    }}
                  >
                    ⭐
                  </button>
                  <button
                    className={`icon-btn ${rec?.markedDifficult ? 'on' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFlag(w.en, 'markedDifficult');
                    }}
                  >
                    ⚠
                  </button>
                </div>

                {open && (
                  <div className="word-detail">
                    <p>{w.example}</p>
                    <p className="muted">{w.exampleZh}</p>
                    <button
                      className="btn btn-secondary"
                      style={{ height: 36, marginTop: 8 }}
                      onClick={() => speak(w.example)}
                    >
                      🔊 朗读例句
                    </button>
                    {w.forms && (
                      <div className="forms-table">
                        <span>原形：{w.forms.infinitive}</span>
                        <span>三单：{w.forms.present}</span>
                        <span>现在分词：{w.forms.ing}</span>
                        <span>过去式：{w.forms.past}</span>
                        <span>过去分词：{w.forms.pastParticiple}</span>
                        {w.defaultObject && <span>常见搭配：{w.defaultObject}</span>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        {filtered.length > 200 && (
          <div className="muted center" style={{ padding: 12 }}>
            仅显示前 200 条，用搜索或筛选缩小范围
          </div>
        )}
      </div>
    </div>
  );
}
