// 词形变化引擎
import type { WordForms } from '../types';

/** 不规则动词变形表 */
export const IRREGULAR_VERBS: Record<
  string,
  { present: string; ing: string; past: string; pastParticiple: string }
> = {
  be: { present: 'is', ing: 'being', past: 'was', pastParticiple: 'been' },
  go: { present: 'goes', ing: 'going', past: 'went', pastParticiple: 'gone' },
  do: { present: 'does', ing: 'doing', past: 'did', pastParticiple: 'done' },
  have: { present: 'has', ing: 'having', past: 'had', pastParticiple: 'had' },
  say: { present: 'says', ing: 'saying', past: 'said', pastParticiple: 'said' },
  make: { present: 'makes', ing: 'making', past: 'made', pastParticiple: 'made' },
  come: { present: 'comes', ing: 'coming', past: 'came', pastParticiple: 'come' },
  take: { present: 'takes', ing: 'taking', past: 'took', pastParticiple: 'taken' },
  see: { present: 'sees', ing: 'seeing', past: 'saw', pastParticiple: 'seen' },
  get: { present: 'gets', ing: 'getting', past: 'got', pastParticiple: 'gotten' },
  know: { present: 'knows', ing: 'knowing', past: 'knew', pastParticiple: 'known' },
  think: { present: 'thinks', ing: 'thinking', past: 'thought', pastParticiple: 'thought' },
  give: { present: 'gives', ing: 'giving', past: 'gave', pastParticiple: 'given' },
  find: { present: 'finds', ing: 'finding', past: 'found', pastParticiple: 'found' },
  tell: { present: 'tells', ing: 'telling', past: 'told', pastParticiple: 'told' },
  become: { present: 'becomes', ing: 'becoming', past: 'became', pastParticiple: 'become' },
  leave: { present: 'leaves', ing: 'leaving', past: 'left', pastParticiple: 'left' },
  feel: { present: 'feels', ing: 'feeling', past: 'felt', pastParticiple: 'felt' },
  bring: { present: 'brings', ing: 'bringing', past: 'brought', pastParticiple: 'brought' },
  begin: { present: 'begins', ing: 'beginning', past: 'began', pastParticiple: 'begun' },
  keep: { present: 'keeps', ing: 'keeping', past: 'kept', pastParticiple: 'kept' },
  hold: { present: 'holds', ing: 'holding', past: 'held', pastParticiple: 'held' },
  write: { present: 'writes', ing: 'writing', past: 'wrote', pastParticiple: 'written' },
  hear: { present: 'hears', ing: 'hearing', past: 'heard', pastParticiple: 'heard' },
  mean: { present: 'means', ing: 'meaning', past: 'meant', pastParticiple: 'meant' },
  meet: { present: 'meets', ing: 'meeting', past: 'met', pastParticiple: 'met' },
  run: { present: 'runs', ing: 'running', past: 'ran', pastParticiple: 'run' },
  pay: { present: 'pays', ing: 'paying', past: 'paid', pastParticiple: 'paid' },
  sit: { present: 'sits', ing: 'sitting', past: 'sat', pastParticiple: 'sat' },
  speak: { present: 'speaks', ing: 'speaking', past: 'spoke', pastParticiple: 'spoken' },
  read: { present: 'reads', ing: 'reading', past: 'read', pastParticiple: 'read' },
  grow: { present: 'grows', ing: 'growing', past: 'grew', pastParticiple: 'grown' },
  lose: { present: 'loses', ing: 'losing', past: 'lost', pastParticiple: 'lost' },
  fall: { present: 'falls', ing: 'falling', past: 'fell', pastParticiple: 'fallen' },
  send: { present: 'sends', ing: 'sending', past: 'sent', pastParticiple: 'sent' },
  build: { present: 'builds', ing: 'building', past: 'built', pastParticiple: 'built' },
  draw: { present: 'draws', ing: 'drawing', past: 'drew', pastParticiple: 'drawn' },
  break: { present: 'breaks', ing: 'breaking', past: 'broke', pastParticiple: 'broken' },
  spend: { present: 'spends', ing: 'spending', past: 'spent', pastParticiple: 'spent' },
  rise: { present: 'rises', ing: 'rising', past: 'rose', pastParticiple: 'risen' },
  drive: { present: 'drives', ing: 'driving', past: 'drove', pastParticiple: 'driven' },
  buy: { present: 'buys', ing: 'buying', past: 'bought', pastParticiple: 'bought' },
  wear: { present: 'wears', ing: 'wearing', past: 'wore', pastParticiple: 'worn' },
  choose: { present: 'chooses', ing: 'choosing', past: 'chose', pastParticiple: 'chosen' },
  throw: { present: 'throws', ing: 'throwing', past: 'threw', pastParticiple: 'thrown' },
  catch: { present: 'catches', ing: 'catching', past: 'caught', pastParticiple: 'caught' },
  deal: { present: 'deals', ing: 'dealing', past: 'dealt', pastParticiple: 'dealt' },
  win: { present: 'wins', ing: 'winning', past: 'won', pastParticiple: 'won' },
  forget: { present: 'forgets', ing: 'forgetting', past: 'forgot', pastParticiple: 'forgotten' },
  eat: { present: 'eats', ing: 'eating', past: 'ate', pastParticiple: 'eaten' },
  teach: { present: 'teaches', ing: 'teaching', past: 'taught', pastParticiple: 'taught' },
  sleep: { present: 'sleeps', ing: 'sleeping', past: 'slept', pastParticiple: 'slept' },
  drink: { present: 'drinks', ing: 'drinking', past: 'drank', pastParticiple: 'drunk' },
  swim: { present: 'swims', ing: 'swimming', past: 'swam', pastParticiple: 'swum' },
  ring: { present: 'rings', ing: 'ringing', past: 'rang', pastParticiple: 'rung' },
  sink: { present: 'sinks', ing: 'sinking', past: 'sank', pastParticiple: 'sunk' },
  fly: { present: 'flies', ing: 'flying', past: 'flew', pastParticiple: 'flown' },
  dig: { present: 'digs', ing: 'digging', past: 'dug', pastParticiple: 'dug' },
  bite: { present: 'bites', ing: 'biting', past: 'bit', pastParticiple: 'bitten' },
  ride: { present: 'rides', ing: 'riding', past: 'rode', pastParticiple: 'ridden' },
  hide: { present: 'hides', ing: 'hiding', past: 'hid', pastParticiple: 'hidden' },
  shine: { present: 'shines', ing: 'shining', past: 'shone', pastParticiple: 'shone' },
  freeze: { present: 'freezes', ing: 'freezing', past: 'froze', pastParticiple: 'frozen' },
  bear: { present: 'bears', ing: 'bearing', past: 'bore', pastParticiple: 'borne' },
  blow: { present: 'blows', ing: 'blowing', past: 'blew', pastParticiple: 'blown' },
  cry: { present: 'cries', ing: 'crying', past: 'cried', pastParticiple: 'cried' },
  fry: { present: 'fries', ing: 'frying', past: 'fried', pastParticiple: 'fried' },
  stand: { present: 'stands', ing: 'standing', past: 'stood', pastParticiple: 'stood' },
  understand: {
    present: 'understands',
    ing: 'understanding',
    past: 'understood',
    pastParticiple: 'understood',
  },
  lie: { present: 'lies', ing: 'lying', past: 'lay', pastParticiple: 'lain' },
  lay: { present: 'lays', ing: 'laying', past: 'laid', pastParticiple: 'laid' },
  lead: { present: 'leads', ing: 'leading', past: 'led', pastParticiple: 'led' },
  feed: { present: 'feeds', ing: 'feeding', past: 'fed', pastParticiple: 'fed' },
  fight: { present: 'fights', ing: 'fighting', past: 'fought', pastParticiple: 'fought' },
  seek: { present: 'seeks', ing: 'seeking', past: 'sought', pastParticiple: 'sought' },
  sell: { present: 'sells', ing: 'selling', past: 'sold', pastParticiple: 'sold' },
  shake: { present: 'shakes', ing: 'shaking', past: 'shook', pastParticiple: 'shaken' },
  sing: { present: 'sings', ing: 'singing', past: 'sang', pastParticiple: 'sung' },
  wake: { present: 'wakes', ing: 'waking', past: 'woke', pastParticiple: 'woken' },
  wear_out: { present: 'wears', ing: 'wearing', past: 'wore', pastParticiple: 'worn' },
  hurt: { present: 'hurts', ing: 'hurting', past: 'hurt', pastParticiple: 'hurt' },
  cut: { present: 'cuts', ing: 'cutting', past: 'cut', pastParticiple: 'cut' },
  put: { present: 'puts', ing: 'putting', past: 'put', pastParticiple: 'put' },
  let: { present: 'lets', ing: 'letting', past: 'let', pastParticiple: 'let' },
  set: { present: 'sets', ing: 'setting', past: 'set', pastParticiple: 'set' },
  cost: { present: 'costs', ing: 'costing', past: 'cost', pastParticiple: 'cost' },
  hit: { present: 'hits', ing: 'hitting', past: 'hit', pastParticiple: 'hit' },
  shut: { present: 'shuts', ing: 'shutting', past: 'shut', pastParticiple: 'shut' },
  spread: { present: 'spreads', ing: 'spreading', past: 'spread', pastParticiple: 'spread' },
  quit: { present: 'quits', ing: 'quitting', past: 'quit', pastParticiple: 'quit' },
};

const VOWELS = 'aeiou';

/** 判断是否 辅音-元音-辅音 结尾（需要双写末尾字母） */
function isCVC(w: string): boolean {
  if (w.length < 3) return false;
  const [a, b, c] = [w[w.length - 3], w[w.length - 2], w[w.length - 1]];
  // w/x/y 结尾不双写
  if ('wxy'.includes(c)) return false;
  return !VOWELS.includes(a) && VOWELS.includes(b) && !VOWELS.includes(c);
}

/** 现在分词 */
export function getIngForm(w: string): string {
  if (w.endsWith('ie')) return w.slice(0, -2) + 'ying'; // die → dying
  if (w.endsWith('e') && !VOWELS.includes(w[w.length - 2] ?? '')) return w.slice(0, -1) + 'ing';
  if (isCVC(w)) return w + w[w.length - 1] + 'ing';
  return w + 'ing';
}

/** 过去式 */
export function getPastForm(w: string): string {
  if (w.endsWith('e')) return w + 'd';
  if (w.endsWith('y') && !VOWELS.includes(w[w.length - 2] ?? '')) return w.slice(0, -1) + 'ied';
  if (isCVC(w)) return w + w[w.length - 1] + 'ed';
  return w + 'ed';
}

/** 第三人称单数 */
export function getPresentForm(w: string): string {
  if (/(s|x|o|ch|sh|z)$/.test(w)) return w + 'es';
  if (w.endsWith('y') && !VOWELS.includes(w[w.length - 2] ?? '')) return w.slice(0, -1) + 'ies';
  return w + 's';
}

/** 生成完整变形表；非动词返回 null */
export function getForms(en: string, pos: string): WordForms | null {
  if (!pos.toLowerCase().startsWith('v')) return null;
  const key = en.toLowerCase();
  const irr = IRREGULAR_VERBS[key];
  if (irr) {
    return { infinitive: en, ...irr };
  }
  return {
    infinitive: en,
    present: getPresentForm(en),
    ing: getIngForm(en),
    past: getPastForm(en),
    pastParticiple: getPastForm(en),
  };
}

/** 列出一个词所有可能的形态（含名词复数/形容词比较级的粗略推导） */
export function allForms(en: string): string[] {
  const forms = new Set<string>([en]);
  const irr = IRREGULAR_VERBS[en.toLowerCase()];
  if (irr) {
    forms.add(irr.present);
    forms.add(irr.ing);
    forms.add(irr.past);
    forms.add(irr.pastParticiple);
  }
  forms.add(getPresentForm(en));
  forms.add(getIngForm(en));
  forms.add(getPastForm(en));
  return Array.from(forms);
}

/**
 * 在句子中查找目标词的实际出现形态（最长匹配优先）。
 * 用于语境模式的挖空。
 */
export function findFormInSentence(
  en: string,
  sentence: string
): { form: string; index: number } | null {
  const candidates = allForms(en).sort((a, b) => b.length - a.length);
  for (const form of candidates) {
    // 词边界匹配，忽略大小写
    const re = new RegExp(`\\b${form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    const m = re.exec(sentence);
    if (m) return { form: m[0], index: m.index };
  }
  return null;
}
