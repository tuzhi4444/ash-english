// 文本比对工具（Shadowing 跟读匹配用）

/** Levenshtein 编辑距离 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[b.length];
}

/** 分词并去掉标点、转小写 */
export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"'()]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

export interface DiffResult {
  accuracy: number;
  words: { word: string; hit: boolean }[];
}

/**
 * 逐词比对原句与识别结果，编辑距离 ≤1 视为匹配（容忍识别误差）。
 * 每个转写词只能被消耗一次，避免重复词虚高。
 */
export function compareSpeech(original: string, spoken: string): DiffResult {
  const oWords = tokenize(original);
  const sWords = tokenize(spoken);
  const used = new Array<boolean>(sWords.length).fill(false);
  const words: { word: string; hit: boolean }[] = [];
  let hits = 0;

  for (const ow of oWords) {
    let matched = -1;
    for (let i = 0; i < sWords.length; i++) {
      if (used[i]) continue;
      if (levenshtein(ow, sWords[i]) <= 1) {
        matched = i;
        break;
      }
    }
    if (matched >= 0) {
      used[matched] = true;
      hits++;
      words.push({ word: ow, hit: true });
    } else {
      words.push({ word: ow, hit: false });
    }
  }

  return {
    accuracy: oWords.length === 0 ? 0 : hits / oWords.length,
    words,
  };
}
