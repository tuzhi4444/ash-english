// 导入自己的连续听力材料：粘贴英文 → 自动断句 → 自动出题
import { useMemo, useState } from 'react';
import type { LearningStore, Passage } from '../types';
import { PASSAGES } from '../data/passages';
import { createPassage, MAX_CHARS, splitSentences } from '../utils/passageImport';

interface Props {
  store: LearningStore;
  onUpdate: (fn: (prev: LearningStore) => LearningStore) => void;
  /** 取消，不做改动 */
  onCancel: () => void;
  /**
   * 导入成功。把新材料直接交回去，让调用方拿它当当前练习篇目——
   * 不能让调用方自己重新随机挑：onUpdate 是异步的，那一刻 store 里
   * 还没有这篇新材料，随机只会挑到旧的。
   */
  onImported: (passage: Passage) => void;
}

export default function PassageImport({
  store,
  onUpdate,
  onCancel,
  onImported,
}: Props): React.JSX.Element {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [zh, setZh] = useState('');
  const [phase, setPhase] = useState<1 | 2 | 3>(store.plan.currentPhase);
  const [error, setError] = useState<string | null>(null);

  // 出题的干扰句来自所有已有材料
  const distractorPool = useMemo(
    () => [...PASSAGES, ...store.customPassages].flatMap((p) => p.lines),
    [store.customPassages]
  );

  const preview = useMemo(() => (text.trim() ? splitSentences(text) : []), [text]);

  function save(): void {
    const result = createPassage(title, text, zh, phase, distractorPool);
    if (!result.ok || !result.passage) {
      setError(result.error ?? '导入失败');
      return;
    }
    const passage = result.passage;
    onUpdate((prev) => ({ ...prev, customPassages: [...prev.customPassages, passage] }));
    onImported(passage);
  }

  function remove(id: string): void {
    onUpdate((prev) => ({
      ...prev,
      customPassages: prev.customPassages.filter((p) => p.id !== id),
      // 顺手清掉完成记录，否则删了再导入同名材料会被当成"做过的"
      passage: {
        ...prev.passage,
        completed: prev.passage.completed.filter((c) => c !== id),
      },
    }));
  }

  return (
    <>
      <div className="card">
        <strong>导入自己的材料</strong>
        <p className="muted" style={{ marginTop: 6 }}>
          粘贴任意英文段落——新闻、歌词、课本对话、电影台词都行。会自动断句、朗读，
          并出「哪句出现在录音里」的辨认题。内置材料只有 {PASSAGES.length} 篇，
          想一直有新东西听，就从这里加。
        </p>
      </div>

      <div className="card">
        <div className="muted" style={{ marginBottom: 4 }}>
          标题（可留空）
        </div>
        <input
          className="input"
          value={title}
          placeholder="例：BBC 新闻片段"
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="muted" style={{ margin: '12px 0 4px' }}>
          英文内容 · 必填（{text.trim().length}/{MAX_CHARS}）
        </div>
        <textarea
          className="input"
          style={{ height: 120, padding: 10, resize: 'vertical', lineHeight: 1.5 }}
          value={text}
          placeholder="粘贴英文段落，句子用 . ! ? 结尾即可自动断句"
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
        />

        <div className="muted" style={{ margin: '12px 0 4px' }}>
          中文对照 · 可留空（一行一句，行数要和英文句数一致）
        </div>
        <textarea
          className="input"
          style={{ height: 80, padding: 10, resize: 'vertical', lineHeight: 1.5 }}
          value={zh}
          placeholder="不填也能练，只是对照原文时没有中文"
          onChange={(e) => setZh(e.target.value)}
        />

        <div className="muted" style={{ margin: '12px 0 4px' }}>
          语速档位
        </div>
        <div className="tabs" style={{ marginBottom: 0 }}>
          {([1, 2, 3] as const).map((p) => (
            <button
              key={p}
              className={`tab ${phase === p ? 'active' : ''}`}
              onClick={() => setPhase(p)}
            >
              {p === 1 ? '慢 0.85x' : p === 2 ? '中 0.95x' : '正常 1.0x'}
            </button>
          ))}
        </div>
      </div>

      {preview.length > 0 && (
        <div className="card">
          <div className="muted" style={{ marginBottom: 8 }}>
            断句预览（{preview.length} 句）—— 断错了就调整标点
          </div>
          {preview.map((line, i) => (
            <div key={`${i}-${line.slice(0, 12)}`} style={{ fontSize: 14, padding: '4px 0' }}>
              <span className="tag grey" style={{ marginRight: 6 }}>
                {i + 1}
              </span>
              {line}
            </div>
          ))}
        </div>
      )}

      {error && <div className="feedback error">{error}</div>}

      <div className="btn-row">
        <button className="btn btn-ghost" onClick={onCancel}>
          取消
        </button>
        <button className="btn" disabled={preview.length < 2} onClick={save}>
          保存并练习
        </button>
      </div>

      {store.customPassages.length > 0 && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="muted" style={{ marginBottom: 8 }}>
            我导入的材料（{store.customPassages.length} 篇）
          </div>
          {store.customPassages.map((p) => (
            <div className="task-item" key={p.id}>
              <span className="task-name">
                {p.title}
                <span className="muted"> · {p.lines.length} 句</span>
              </span>
              <button className="icon-btn on" onClick={() => remove(p.id)}>
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
