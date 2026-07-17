// 每日提醒通知 hook
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseNotification {
  isSupported: boolean;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  scheduleReminder: (time: string) => void;
  cancelReminder: () => void;
}

export function useNotification(): UseNotification {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;
  const [hasPermission, setHasPermission] = useState(
    isSupported && Notification.permission === 'granted'
  );
  const timerRef = useRef<number | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;
    const result = await Notification.requestPermission();
    const granted = result === 'granted';
    setHasPermission(granted);
    return granted;
  }, [isSupported]);

  const cancelReminder = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /** 定到下一个 time 时刻，触发后自动续订第二天 */
  const scheduleReminder = useCallback(
    (time: string) => {
      if (!isSupported || Notification.permission !== 'granted') return;
      cancelReminder();

      const fire = (): void => {
        new Notification('Ash英语', {
          body: '该练英语啦！今天的任务还没完成。',
        });
        // 续订下一天
        timerRef.current = window.setTimeout(fire, 86400000);
      };

      const [h, m] = time.split(':').map(Number);
      const next = new Date();
      next.setHours(h, m, 0, 0);
      if (next.getTime() <= Date.now()) next.setDate(next.getDate() + 1);
      timerRef.current = window.setTimeout(fire, next.getTime() - Date.now());
    },
    [isSupported, cancelReminder]
  );

  // 卸载时清理定时器
  useEffect(() => cancelReminder, [cancelReminder]);

  return { isSupported, hasPermission, requestPermission, scheduleReminder, cancelReminder };
}
