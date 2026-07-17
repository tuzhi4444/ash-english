// 数据导出 / 导入 / 自动备份
import type { LearningStore } from '../types';
import { todayStr } from './plan';

export const STORAGE_KEY = 'ash_english_v2';
export const BACKUP_KEY = 'ash_english_v2_backup';

/** 导出进度为 JSON 文件 */
export function exportProgress(store: LearningStore): void {
  const data = JSON.stringify(store, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ash-english-backup-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** 从 JSON 文件恢复进度 */
export function importProgress(file: File): Promise<LearningStore> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('无法读取文件'));
    reader.onload = (e) => {
      try {
        const data = JSON.parse(String(e.target?.result)) as Partial<LearningStore>;
        if (data.words && data.plan && data.settings) {
          resolve(data as LearningStore);
        } else {
          reject(new Error('文件格式不正确：缺少必要字段'));
        }
      } catch {
        reject(new Error('无法解析文件'));
      }
    };
    reader.readAsText(file);
  });
}

/** 每次写入时同步备份一份，防止主 key 损坏 */
export function autoBackup(store: LearningStore): void {
  try {
    localStorage.setItem(
      BACKUP_KEY,
      JSON.stringify({ data: store, timestamp: new Date().toISOString() })
    );
  } catch {
    // 存储满时静默失败，不影响主流程
  }
}
