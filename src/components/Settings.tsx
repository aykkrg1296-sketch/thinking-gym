import { useState } from 'react';
import styles from './Settings.module.css';

interface SettingsProps {
  apiKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}

export function Settings({ apiKey, onSave, onClose }: SettingsProps) {
  const [key, setKey] = useState(apiKey);

  const handleSave = () => {
    onSave(key.trim());
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>設定</h2>

        <div className={styles.section}>
          <label className={styles.label}>激詰めコーディー（AI）を有効にする</label>
          <p className={styles.description}>
            Anthropic APIキーを入れると、あなたの回答に対して
            AIコーチ「激詰めコーディー」がフィードバックしてくれます。
            なくても全機能使えます。
          </p>
          <input
            className={styles.input}
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="sk-ant-..."
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            キャンセル
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
