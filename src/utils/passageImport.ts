// 用户导入的连续听力材料：断句 + 自动出题
//
// 为什么需要这个：内置短文只有 15 篇，而听辨每天要 12 题（一篇约 2.4 题），
// 三天就做完了。要想让连续听力"不重复"地撑完整个计划得有约 1550 篇——
// 手写不现实，编出来的假课文也没价值。真正的解法是把素材来源交给用户：
// 想听什么就粘什么（新闻、歌词、课本对话），素材从此无限。
import type { Passage, PassageQuestion } from '../types';

/** 单篇材料的长度上限，防止有人整本书粘进来把 localStorage 撑爆 */
export const MAX_CHARS = 4000;
export const MIN_SENTENCES = 2;
export const MAX_SENTENCES = 12;

/** 保护缩写点用的哨兵：正常英文里不会出现，且是可见字符（避免不可见字符引发的诡异 bug） */
const DOT_SENTINEL = '<<DOT>>';

/**
 * 把一段英文断成句子。
 *
 * 缩写里的点必须先保护起来，否则会在缩写处断错。但缩写分两类，不能一视同仁：
 *
 * · 称谓类（Mr. / Dr. / Prof.）后面永远跟名字，绝不会结句 —— 无条件保护。
 * · 可结句类（a.m. / etc. / U.S.）末尾那个点，可能同时就是句号：
 *   "at 9 a.m. They talked" 里它是句号，"the U.S. economy" 里不是。
 *   用"后面是否跟着空格+大写字母"来判断。
 *
 * 这是启发式，不可能完美（"the U.S. Congress" 会被误断成两句）。
 * 所以导入界面上给了断句预览，让用户自己核对——这才是真正的兜底。
 */
export function splitSentences(text: string): string[] {
  const TITLES = /\b(Mr|Mrs|Ms|Dr|Prof|St|Jr|Sr|vs)\./gi;
  // 注意这里不能加 i 标志：i 会让 [A-Z] 连小写一起匹配，
  // "后面不是大写字母"这个判断就永远为假，整条规则失效。
  // 所以大小写写进候选项里，而不是靠 i。
  const TERMINAL =
    /\b(etc|Etc|e\.g|E\.g|i\.e|I\.e|U\.S|U\.K|a\.m|p\.m|A\.M|P\.M)\.(?!\s+[A-Z])/g;
  const protect = (m: string): string => m.split('.').join(DOT_SENTINEL);

  return text
    .replace(TITLES, protect)
    .replace(TERMINAL, protect)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.split(DOT_SENTINEL).join('.').trim())
    .filter((s) => s.length > 0);
}

/** 按行切中文对照（用户可留空） */
export function splitZhLines(text: string, count: number): string[] {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  // 对不齐就整体留空，宁可不显示也不错位
  if (lines.length !== count) return new Array<string>(count).fill('');
  return lines;
}

/** 洗牌 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 自动出题：句子辨认。
 * "下面哪句出现在刚才的录音里？" —— 正确项来自本篇，干扰项来自别的材料。
 *
 * 内置短文用的是人工写的中文理解题，导入材料没有译文，只能出这种。
 * 这不是凑数：听完整段后判断某句是否出现过，本身就是标准的听力测试形式。
 * 干扰项必须来自别的材料——若取自本篇，四个选项就都在录音里出现过，无解。
 */
export function buildRecognitionQuestions(
  lines: string[],
  distractorPool: string[],
  count: number
): PassageQuestion[] {
  const pool = distractorPool.filter((s) => !lines.includes(s));
  const picked = shuffle(lines).slice(0, Math.min(count, lines.length));

  return picked.map((correct) => {
    const distractors = shuffle(pool).slice(0, 3);
    const options = shuffle([correct, ...distractors]);
    return {
      q: '下面哪一句出现在刚才的录音里？',
      options,
      answer: options.indexOf(correct),
    };
  });
}

export interface ImportResult {
  ok: boolean;
  passage?: Passage;
  error?: string;
}

/**
 * 从用户粘贴的文本造一篇连续听力材料。
 * @param distractorPool 其它材料的句子，用来当干扰项
 */
export function createPassage(
  title: string,
  text: string,
  zhText: string,
  phase: 1 | 2 | 3,
  distractorPool: string[]
): ImportResult {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: '请先粘贴英文内容' };
  if (trimmed.length > MAX_CHARS) {
    return { ok: false, error: `内容 ${trimmed.length} 字，超过 ${MAX_CHARS} 字上限，请分段导入` };
  }

  const lines = splitSentences(trimmed);
  if (lines.length < MIN_SENTENCES) {
    return {
      ok: false,
      error: `只断出 ${lines.length} 句，至少要 ${MIN_SENTENCES} 句（句子要有 . ! ? 结尾）`,
    };
  }
  if (lines.length > MAX_SENTENCES) {
    return { ok: false, error: `断出 ${lines.length} 句，超过 ${MAX_SENTENCES} 句上限，请分段导入` };
  }
  // 干扰项不够就出不了题——至少得有 3 句来自别处
  if (distractorPool.filter((s) => !lines.includes(s)).length < 3) {
    return { ok: false, error: '可用的干扰句不足，无法出题' };
  }

  const questionCount = Math.min(3, Math.max(2, Math.floor(lines.length / 2)));
  return {
    ok: true,
    passage: {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      phase,
      title: title.trim() || '我导入的材料',
      lines,
      linesZh: splitZhLines(zhText, lines.length),
      questions: buildRecognitionQuestions(lines, distractorPool, questionCount),
      source: 'imported',
    },
  };
}
