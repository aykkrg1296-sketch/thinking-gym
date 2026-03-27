import styles from './Header.module.css';

interface HeaderProps {
  onBack?: () => void;
  title?: string;
  streak?: number;
  onSettings?: () => void;
  onGlossary?: () => void;
}

export function Header({ onBack, title, streak, onSettings, onGlossary }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            <span className={styles.arrow}>&larr;</span>
          </button>
        )}
      </div>
      <div className={styles.center}>
        {title ? (
          <h1 className={styles.pageTitle}>{title}</h1>
        ) : (
          <h1 className={styles.logo}>思考の解像度</h1>
        )}
      </div>
      <div className={styles.right}>
        {streak !== undefined && streak > 0 && (
          <span className={styles.streak}>🔥 {streak}</span>
        )}
        {onGlossary && (
          <button className={styles.glossaryBtn} onClick={onGlossary} title="ことばの意味">
            📖
          </button>
        )}
        {onSettings && (
          <button className={styles.settingsBtn} onClick={onSettings} title="設定">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
