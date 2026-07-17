// localStorage 读写 hook（含自动备份与版本迁移）
import { useCallback, useState } from 'react';
import type { LearningStore } from '../types';
import { autoBackup, BACKUP_KEY } from '../utils/backup';

/**
 * 与 localStorage 同步的状态。
 * 主 key 解析失败时自动回退到备份 key。
 *
 * @param migrate 可选的迁移函数。浅合并只能补顶层缺失的字段，管不了
 *   嵌套结构变更（比如 plan 从日历驱动改成通关驱动），那种得靠它。
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
  migrate?: (raw: Partial<T>) => T
): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    const hydrate = (parsed: Partial<T>): T =>
      migrate ? migrate(parsed) : { ...initial, ...(parsed as T) };

    try {
      const raw = localStorage.getItem(key);
      if (raw) return hydrate(JSON.parse(raw) as Partial<T>);
    } catch {
      // 主数据损坏，尝试备份
      try {
        const bak = localStorage.getItem(BACKUP_KEY);
        if (bak) {
          const parsed = JSON.parse(bak) as { data: Partial<T> };
          if (parsed.data) return hydrate(parsed.data);
        }
      } catch {
        // 备份也坏了，用初始值
      }
    }
    return initial;
  });

  const update = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
        try {
          localStorage.setItem(key, JSON.stringify(next));
          autoBackup(next as unknown as LearningStore);
        } catch {
          // 存储配额满时静默失败，内存状态仍然更新
        }
        return next;
      });
    },
    [key]
  );

  return [value, update];
}
