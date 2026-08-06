// 入门测试：50 词翻卡，快速评估水平
import { useMemo, useState } from 'react';
import type { LearningStore, Word } from '../types';
import { WORDS } from '../data/words';
import { emptyRecord, MAX_STAGE } from '../utils/srs';
import { todayStr } from '../utils/plan';

const SAMPLE_SIZE = 50;

interface Props {
  onFinish: (patch: Partial<LearningStore>) => void;
}

/** 按词性比例抽样，保证测试覆盖各类词 */
function sampleWords(size: number): Word[] {
  const byPos = new Map<string, Word[]>();
  for (const w of WORDS) {
    const list = byPos.get(w.pos) ?? [];
    list.push(w);
    byPos.set(w.pos, list);
  }
  const picked: Word[] = [];
  for (const [, list] of byPos) {
    const quota = Math.round((list.length / WORDS.length) * size);
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    picked.push(...shuffled.slice(0, quota));
  }
  // 四舍五入可能凑不满，用剩余词补齐
  if (picked.length < size) {
    const rest = WORDS.filter((w) => !picked.includes(w)).sort(() => Math.random() - 0.5);
    picked.push(...rest.slice(0, size - picked.length));
  }
  return picked.sort(() => Math.random() - 0.5).slice(0, size);
}

export default function Assessment({ onFinish }: Props): React.JSX.Element {
  const [stage, setStage] = useState<'intro' | 'testing' | 'result'>('intro');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<string[]>([]);
  const words = useMemo(() => sampleWords(SAMPLE_SIZE), []);

  const current = words[index];
  const ratio = known.length / SAMPLE_SIZE;

  /** 把测试结果写回 store */
  function commit(knownList: string[]): void {
    const records: LearningStore['words'] = {};
    for (const en of knownList) {
      records[en.toLowerCase()] = {
        ...emptyRecord(),
        mastered: true,
        testSkipped: true,
        stage: MAX_STAGE,
      };
    }
    onFinish({
      words: records,
      assessment: {
        completed: true,
        testDate: todayStr(),
        sampleSize: SAMPLE_SIZE,
        knownCount: knownList.length,
        masteryRatio: knownList.length / SAMPLE_SIZE,
      },
    });
  }

  function answer(isKnown: boolean): void {
    const nextKnown = isKnown ? [...known, current.en] : known;
    setKnown(nextKnown);
    setFlipped(false);
    if (index + 1 >= words.length) {
      setStage('result');
    } else {
      setIndex(index + 1);
    }
  }

  function skipTest(): void {
    onFinish({
      assessment: {
        completed: true,
        testDate: todayStr(),
        sampleSize: 0,
        knownCount: 0,
        masteryRatio: 0,
      },
    });
  }

  if (stage === 'intro') {
    return (
      <div className="app">
        <div className="header">
          <div className="title">Ash英语 · 入门测试</div>
        </div>
        <div className="card">
          <p style={{ marginBottom: 12 }}>
            欢迎！这套训练用「听音 → 建反射 → 框架输出」代替背单词扣语法。
          </p>
          <p style={{ marginBottom: 12 }}>
            每天一组，五项任务做满才算完成。不限期限——进度由你的掌握程度决定，
            练到词库学完为止。
          </p>
          <p style={{ marginBottom: 12 }}>
            先花 2 分钟做个小测试：我们会抽 {SAMPLE_SIZE} 个词让你判断认不认识。
            标记为「认识」的词会被跳过，不再占用你的学习时间。
          </p>
          <p className="muted">测试结果只影响学习节奏，答得诚实一点效果最好。</p>
        </div>
        <button className="btn btn-block" onClick={() => setStage('testing')}>
          开始测试
        </button>
        <button
          className="btn btn-block btn-ghost"
          style={{ marginTop: 8 }}
          onClick={skipTest}
        >
          跳过测试（所有词从头学）
        </button>
      </div>
    );
  }

  if (stage === 'result') {
    const pct = Math.round(ratio * 100);
    return (
      <div className="app">
        <div className="header">
          <div className="title">测试完成</div>
        </div>
        <div className="card center">
          <div className="accuracy high">{pct}%</div>
          <p style={{ marginTop: 8 }}>
            你大约已掌握 {pct}% 的词汇（{known.length}/{SAMPLE_SIZE}）
          </p>
        </div>
        {ratio > 0.8 && (
          <div className="feedback correct">
            你基础不错！可以在设置里把每日新词量调高一些，进度会更快。
          </div>
        )}
        {ratio < 0.3 && (
          <div className="hint">
            基础词还有空间，别急——Phase 1 就是为你设计的，每天十来个词稳步来。
          </div>
        )}
        <button
          className="btn btn-block"
          style={{ marginTop: 12 }}
          onClick={() => commit(known)}
        >
          进入首页
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <div className="title">认识这个词吗？</div>
        <span className="muted">
          {index + 1}/{words.length}
        </span>
      </div>
      <div className="progress" style={{ marginBottom: 12 }}>
        <div
          className="progress-fill"
          style={{ width: `${((index + 1) / words.length) * 100}%` }}
        />
      </div>

      <div className="card flashcard" onClick={() => setFlipped(!flipped)}>
        <div className="word-zh">{current.zh}</div>
        <span className="tag grey">{current.pos}</span>
        {flipped ? (
          <div className="word-en">{current.en}</div>
        ) : (
          <div className="muted">点击卡片查看英文</div>
        )}
      </div>

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={() => answer(false)}>
          不认识
        </button>
        <button className="btn btn-success" onClick={() => answer(true)}>
          认识
        </button>
      </div>
    </div>
  );
}
