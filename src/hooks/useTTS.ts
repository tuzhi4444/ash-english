// TTS 发音 hook（含高质量语音优选）
import { useCallback, useEffect, useRef, useState } from 'react';

/** 语音优先级列表，从高到低。前三个是各平台公认最自然的，后面是各地区的正经人声 */
const PREFERRED = [
  'Google US English',
  'Microsoft Zira',
  'Microsoft Aria',
  'Samantha', // macOS 默认美音
  'Karen', // 澳
  'Daniel', // 英
  'Moira', // 爱尔兰
  'Tessa', // 南非
  'Rishi', // 印度
  'Google UK English',
];

/**
 * 搞怪音黑名单。
 *
 * macOS 的英语语音里混着一大堆玩具音（Bad News / Zarvox / Trinoids / Bubbles…），
 * 而且它们按字母序排在最前——兜底若直接取"第一个英语语音"，会挑中 Albert
 * 这种老式机械音，甚至 Bad News 这种葬礼腔。本地实测 41 个英语语音里
 * 没有任何一个带 default 标记，所以只能靠黑名单排除。
 */
const NOVELTY = [
  'Albert', 'Bad News', 'Good News', 'Bahh', 'Bells', 'Boing', 'Bubbles', 'Cellos',
  'Jester', 'Junior', 'Organ', 'Superstar', 'Trinoids', 'Whisper', 'Wobble', 'Zarvox',
  'Grandma', 'Grandpa', 'Deranged', 'Hysterical', 'Princess', 'Bruce', 'Ralph', 'Fred',
];

function isNovelty(v: SpeechSynthesisVoice): boolean {
  return NOVELTY.some((n) => v.name.includes(n));
}

/** 在可用语音里挑一个质量最好的英语语音 */
export function selectBestVoice(
  voices: SpeechSynthesisVoice[],
  preferredName?: string | null
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  // 用户在设置里指定的最优先，哪怕他就想听 Zarvox
  if (preferredName) {
    const chosen = voices.find((v) => v.name === preferredName);
    if (chosen) return chosen;
  }
  for (const name of PREFERRED) {
    const found = voices.find((v) => v.name.includes(name) && v.lang.startsWith('en'));
    if (found) return found;
  }
  const english = voices.filter((v) => v.lang.startsWith('en'));
  // 兜底也要绕开搞怪音；实在只剩搞怪音了，也好过没声音
  return english.find((v) => !isNovelty(v)) ?? english[0] ?? voices[0];
}

/** 设置页的语音下拉：过滤掉搞怪音，否则一眼看去全是 Bahh / Boing */
export function listUsableVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return voices.filter((v) => v.lang.startsWith('en') && !isNovelty(v));
}

/**
 * 给对话里的"对方"挑一个跟主语音不同的英语语音。
 *
 * 对话必须是两个声音：同一个声音一人分饰两角，听感上就不是对话，
 * 而且"对方说的"和"参考说法"分不开——后者是你自己该说的话。
 *
 * 挑不出第二个（只有一个英语语音的设备）时返回 null，
 * 调用方退回主语音——单声道对话也好过没声音。
 */
export function pickPartnerVoice(
  voices: SpeechSynthesisVoice[],
  mainVoiceName?: string | null
): SpeechSynthesisVoice | null {
  const usable = listUsableVoices(voices);
  const main = selectBestVoice(voices, mainVoiceName);
  const others = usable.filter((v) => v.name !== main?.name);
  if (others.length === 0) return null;
  // 优先挑 PREFERRED 里排得上号的，保证对方的声音也是正经人声
  for (const name of PREFERRED) {
    const found = others.find((v) => v.name.includes(name));
    if (found) return found;
  }
  return others[0];
}

export interface UseTTS {
  /** @param voiceName 指定语音名，不传则用设置里的优选语音（对话的两个角色靠它区分） */
  speak: (text: string, rate?: number, voiceName?: string | null) => void;
  cancel: () => void;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  isSupported: boolean;
}

export function useTTS(
  defaultRate = 1.0,
  preferredVoice: string | null = null
): UseTTS {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const rateRef = useRef(defaultRate);
  rateRef.current = defaultRate;

  useEffect(() => {
    if (!isSupported) return;
    const load = (): void => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [isSupported]);

  const selectedVoice = selectBestVoice(voices, preferredVoice);

  const speak = useCallback(
    (text: string, rate?: number, voiceName?: string | null) => {
      if (!isSupported || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = rate ?? rateRef.current;
      // voiceName 优先于设置里的优选语音：对话靠它让对方换个声音说话
      const v = selectBestVoice(
        window.speechSynthesis.getVoices(),
        voiceName ?? preferredVoice
      );
      if (v) u.voice = v;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(u);
    },
    [isSupported, preferredVoice]
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  // 组件卸载时停止朗读，避免串音
  useEffect(() => () => {
    if (isSupported) window.speechSynthesis.cancel();
  }, [isSupported]);

  return { speak, cancel, isSpeaking, voices, selectedVoice, isSupported };
}
