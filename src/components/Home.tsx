import { modules, moduleColors } from '../data/modules';
import type { ModuleId, UserProgress } from '../data/types';
import styles from './Home.module.css';

const questionCounts: Record<ModuleId, number> = {
  'abstraction-ladder': 10,
  'essence-catcher': 8,
  'purpose-means': 8,
  verbalization: 8,
  decomposition: 8,
};

interface HomeProps {
  onSelectModule: (moduleId: ModuleId) => void;
  progress: UserProgress;
}

export function Home({ onSelectModule, progress }: HomeProps) {
  const totalCompleted = Object.values(progress.modules).reduce(
    (sum, mod) => sum + mod.completedQuestions.length, 0
  );
  const totalInsights = Object.values(progress.modules).reduce(
    (sum, mod) => sum + mod.insights.length, 0
  );

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h2 className={styles.heroTitle}>
          自分の思考、
          <br />
          トレーニングしよう
        </h2>
        <p className={styles.heroSub}>
          気になるやつから、やってみよう。
        </p>
      </section>

      {totalCompleted > 0 && (
        <section className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{totalCompleted}</span>
            <span className={styles.statLabel}>やった数</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{totalInsights}</span>
            <span className={styles.statLabel}>気づき</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{progress.totalSessions}</span>
            <span className={styles.statLabel}>日目</span>
          </div>
        </section>
      )}

      <section className={styles.modules}>
        {modules.map((mod, idx) => {
          const modProgress = progress.modules[mod.id];
          const completed = modProgress.completedQuestions.length;
          const total = questionCounts[mod.id];
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          const color = moduleColors[mod.id];

          return (
            <button
              key={mod.id}
              className={styles.moduleCard}
              onClick={() => onSelectModule(mod.id)}
              style={{
                '--module-color': color.main,
                '--module-light': color.light,
                '--module-shadow': color.shadow,
                animationDelay: `${idx * 60}ms`,
              } as React.CSSProperties}
            >
              <span
                className={styles.moduleIcon}
                style={{ background: color.light }}
              >
                {mod.icon}
              </span>
              <div className={styles.moduleBody}>
                <h3 className={styles.moduleTitle}>{mod.title}</h3>
                <p className={styles.moduleDesc}>{mod.description}</p>
                {completed > 0 && (
                  <div className={styles.progressRow}>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${pct}%`, background: color.main }}
                      />
                    </div>
                    <span className={styles.progressLabel} style={{ color: color.main }}>
                      {completed}/{total}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}
