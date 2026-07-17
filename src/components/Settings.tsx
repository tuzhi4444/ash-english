// 设置：TTS / 学习量 / 提醒 / 数据管理
import { useRef, useState } from 'react';
import type { LearningStore } from '../types';
import { listUsableVoices, useTTS } from '../hooks/useTTS';
import { useNotification } from '../hooks/useNotification';
import { exportProgress, importProgress } from '../utils/backup';

interface Props {
  store: LearningStore;
  onUpdate: (fn: (prev: LearningStore) => LearningStore) => void;
  onReplace: (store: LearningStore) => void;
  onReset: () => void;
  onRetakeTest: () => void;
  onBack: () => void;
}

export default function Settings({
  store,
  onUpdate,
  onReplace,
  onReset,
  onRetakeTest,
  onBack,
}: Props): React.JSX.Element {
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { speak, voices } = useTTS(store.settings.speechRate, store.settings.preferredVoice);
  const notification = useNotification();
  // 过滤掉搞怪音：macOS 的英语语音列表里混着一堆 Bahh / Boing / Zarvox
  const enVoices = listUsableVoices(voices);

  /** 改一项设置并立刻落盘 */
  function setSetting<K extends keyof LearningStore['settings']>(
    key: K,
    value: LearningStore['settings'][K]
  ): void {
    onUpdate((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
  }

  async function toggleNotification(on: boolean): Promise<void> {
    if (on) {
      const granted = await notification.requestPermission();
      if (!granted) {
        setMessage({ text: '通知权限被拒绝，无法开启提醒', ok: false });
        return;
      }
      notification.scheduleReminder(store.settings.notificationTime);
    } else {
      notification.cancelReminder();
    }
    setSetting('notificationEnabled', on);
  }

  function onImport(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    importProgress(file)
      .then((data) => {
        onReplace(data);
        setMessage({ text: '导入成功，正在刷新…', ok: true });
        setTimeout(() => window.location.reload(), 800);
      })
      .catch((err: Error) => setMessage({ text: err.message, ok: false }));
  }

  return (
    <div className="app">
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          ‹
        </button>
        <div className="title">⚙️ 设置</div>
      </div>

      {message && (
        <div className={`feedback ${message.ok ? 'correct' : 'error'}`}>{message.text}</div>
      )}

      {/* 发音 */}
      <div className="card">
        <div className="muted" style={{ marginBottom: 4 }}>
          发音
        </div>

        <div className="setting-row">
          <span className="setting-label">TTS 语速 · {store.settings.speechRate.toFixed(1)}x</span>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={store.settings.speechRate}
            onChange={(e) => setSetting('speechRate', Number(e.target.value))}
            onMouseUp={() => speak('This is the current speed.')}
            onTouchEnd={() => speak('This is the current speed.')}
          />
        </div>

        <div className="setting-row">
          <span className="setting-label">TTS 语音</span>
          <select
            value={store.settings.preferredVoice ?? ''}
            onChange={(e) => {
              const v = e.target.value || null;
              setSetting('preferredVoice', v);
              speak('Hello, this is my voice.');
            }}
          >
            <option value="">自动（优选高质量）</option>
            {enVoices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="setting-row">
          <span className="setting-label">翻牌后自动发音</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={store.settings.autoSpeak}
              onChange={(e) => setSetting('autoSpeak', e.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>
      </div>

      {/* 学习量 */}
      <div className="card">
        <div className="muted" style={{ marginBottom: 4 }}>
          学习量
        </div>

        <div className="setting-row">
          <span className="setting-label">每日新词量</span>
          <input
            type="number"
            min={5}
            max={50}
            value={store.settings.dailyNewWords}
            onChange={(e) =>
              setSetting(
                'dailyNewWords',
                Math.max(5, Math.min(50, Number(e.target.value) || 5))
              )
            }
          />
        </div>

        <div className="setting-row">
          <span className="setting-label">
            每日复习上限
            <span className="muted"> · 调低会拖慢新词投放</span>
          </span>
          <input
            type="number"
            min={10}
            max={400}
            value={store.settings.maxReviewPerDay}
            onChange={(e) =>
              setSetting(
                'maxReviewPerDay',
                Math.max(10, Math.min(400, Number(e.target.value) || 10))
              )
            }
          />
        </div>
      </div>

      {/* 提醒 */}
      <div className="card">
        <div className="muted" style={{ marginBottom: 4 }}>
          提醒
        </div>

        <div className="setting-row">
          <span className="setting-label">
            每日提醒
            {!notification.isSupported && (
              <span className="muted"> · 当前浏览器不支持</span>
            )}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              disabled={!notification.isSupported}
              checked={store.settings.notificationEnabled}
              onChange={(e) => void toggleNotification(e.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="setting-row">
          <span className="setting-label">提醒时间</span>
          <input
            type="time"
            className="input"
            style={{ width: 120, height: 36 }}
            value={store.settings.notificationTime}
            onChange={(e) => {
              setSetting('notificationTime', e.target.value);
              if (store.settings.notificationEnabled) {
                notification.scheduleReminder(e.target.value);
              }
            }}
          />
        </div>
      </div>

      {/* 数据 */}
      <div className="card">
        <div className="muted" style={{ marginBottom: 8 }}>
          数据
        </div>

        <button
          className="btn btn-block btn-secondary"
          style={{ marginBottom: 8 }}
          onClick={onRetakeTest}
        >
          重新入门测试
        </button>
        <button
          className="btn btn-block btn-secondary"
          style={{ marginBottom: 8 }}
          onClick={() => exportProgress(store)}
        >
          导出进度
        </button>
        <button
          className="btn btn-block btn-secondary"
          style={{ marginBottom: 8 }}
          onClick={() => fileRef.current?.click()}
        >
          导入进度
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={onImport}
        />

        {confirmReset ? (
          <div className="feedback error">
            <strong>确定清空全部数据？</strong>
            <p className="muted" style={{ margin: '6px 0 10px' }}>
              所有学习进度将永久删除，建议先导出备份。
            </p>
            <div className="btn-row">
              <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
                取消
              </button>
              <button className="btn btn-danger" onClick={onReset}>
                确认清空
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-block btn-danger" onClick={() => setConfirmReset(true)}>
            重置全部数据
          </button>
        )}
      </div>
    </div>
  );
}
