import type { UserProgress } from '../data/types';
import { modules } from '../data/modules';
import styles from './Notes.module.css';

interface NotesProps {
  progress: UserProgress;
  onShowOnboarding: () => void;
}

export function Notes({ progress, onShowOnboarding }: NotesProps) {
  const allInsights = Object.values(progress.modules)
    .flatMap(mod => mod.insights.map(ins => ({
      ...ins,
      moduleId: mod.moduleId,
    })))
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalCompleted = Object.values(progress.modules).reduce(
    (sum, mod) => sum + mod.completedQuestions.length, 0
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>きろく</h2>
      <p className={styles.subtitle}>あなたの実験の足あと</p>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{totalCompleted}</span>
          <span className={styles.statLabel}>実験</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{allInsights.length}</span>
          <span className={styles.statLabel}>気づき</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{progress.totalSessions}</span>
          <span className={styles.statLabel}>日数</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{progress.streak}</span>
          <span className={styles.statLabel}>連続</span>
        </div>
      </div>

      {/* Module progress */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>モジュール進捗</h3>
        {modules.map((mod, idx) => {
          const mp = progress.modules[mod.id];
          const total = mod.id === 'abstraction-ladder' ? 10 : 8;
          const done = mp.completedQuestions.length;
          const pct = Math.round((done / total) * 100);
          return (
            <div key={mod.id} className={styles.moduleRow} style={{ opacity: done > 0 ? 1 : 0.4 }}>
              <span className={styles.moduleNum}>{String(idx + 1).padStart(2, '0')}</span>
              <div className={styles.moduleInfo}>
                <span className={styles.moduleName}>{mod.title}</span>
                <div className={styles.moduleBar}>
                  <div className={styles.moduleFill} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span className={styles.moduleCount}>{done}/{total}</span>
            </div>
          );
        })}
      </div>

      {/* Insights timeline */}
      {allInsights.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>気づきタイムライン</h3>
          {allInsights.map((insight, i) => {
            const mod = modules.find(m => m.id === insight.moduleId);
            return (
              <div key={i} className={styles.insightCard}>
                <div className={styles.insightMeta}>
                  <span className={styles.insightModule}>{mod?.title}</span>
                  <span className={styles.insightDate}>{insight.date}</span>
                </div>
                <p className={styles.insightText}>{insight.text}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <button className={styles.replayBtn} onClick={onShowOnboarding}>
        導入をもう一度見る
      </button>
    </div>
  );
}
