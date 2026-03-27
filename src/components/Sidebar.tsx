import { useState } from 'react';
import { modules } from '../data/modules';
import { ladderQuestions } from '../data/abstraction-ladder';
import { essenceQuestions } from '../data/essence-catcher';
import { purposeMeansQuestions } from '../data/purpose-means';
import { verbalizationQuestions } from '../data/verbalization';
import { decompositionQuestions } from '../data/decomposition';
import type { ModuleId, UserProgress } from '../data/types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSelectModule: (moduleId: ModuleId) => void;
  onShowOnboarding: () => void;
}

const questionMap: Record<ModuleId, { id: string; label: string }[]> = {
  'abstraction-ladder': ladderQuestions.map(q => ({
    id: q.id,
    label: `${q.direction === 'up' ? '↑' : '↓'} ${q.start}`,
  })),
  'essence-catcher': essenceQuestions.map(q => ({
    id: q.id,
    label: q.examples.join(' / '),
  })),
  'purpose-means': purposeMeansQuestions.map(q => ({
    id: q.id,
    label: q.statement,
  })),
  verbalization: verbalizationQuestions.map(q => ({
    id: q.id,
    label: `${q.concept} → ${q.audience}`,
  })),
  decomposition: decompositionQuestions.map(q => ({
    id: q.id,
    label: q.subject,
  })),
};

export function Sidebar({ open, onClose, progress, onSelectModule, onShowOnboarding }: SidebarProps) {
  const [expandedModule, setExpandedModule] = useState<ModuleId | null>(null);

  const totalCompleted = Object.values(progress.modules).reduce(
    (sum, mod) => sum + mod.completedQuestions.length,
    0
  );
  const totalQuestions = Object.values(questionMap).reduce(
    (sum, qs) => sum + qs.length,
    0
  );
  const totalInsights = Object.values(progress.modules).reduce(
    (sum, mod) => sum + mod.insights.length,
    0
  );
  const overallPct = totalQuestions > 0 ? Math.round((totalCompleted / totalQuestions) * 100) : 0;

  const toggleModule = (id: ModuleId) => {
    setExpandedModule(prev => (prev === id ? null : id));
  };

  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>学習の記録</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Overall progress */}
        <div className={styles.overallSection}>
          <div className={styles.overallStats}>
            <div className={styles.overallStat}>
              <span className={styles.overallNumber}>{overallPct}%</span>
              <span className={styles.overallLabel}>達成率</span>
            </div>
            <div className={styles.overallStat}>
              <span className={styles.overallNumber}>{totalCompleted}</span>
              <span className={styles.overallLabel}>クリア</span>
            </div>
            <div className={styles.overallStat}>
              <span className={styles.overallNumber}>{totalInsights}</span>
              <span className={styles.overallLabel}>気づき</span>
            </div>
            <div className={styles.overallStat}>
              <span className={styles.overallNumber}>{progress.streak}</span>
              <span className={styles.overallLabel}>連続日</span>
            </div>
          </div>
          <div className={styles.overallBar}>
            <div className={styles.overallFill} style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        {/* Module list */}
        <div className={styles.moduleList}>
          {modules.map((mod, idx) => {
            const modProgress = progress.modules[mod.id];
            const questions = questionMap[mod.id];
            const completed = modProgress.completedQuestions.length;
            const total = questions.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const isExpanded = expandedModule === mod.id;

            return (
              <div key={mod.id} className={styles.moduleItem}>
                <button
                  className={styles.moduleHeader}
                  onClick={() => toggleModule(mod.id)}
                >
                  <span className={styles.moduleNumber}>{String(idx + 1).padStart(2, '0')}</span>
                  <div className={styles.moduleInfo}>
                    <span className={styles.moduleName}>{mod.title}</span>
                    <div className={styles.moduleBar}>
                      <div className={styles.moduleFill} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className={styles.moduleCount}>{completed}/{total}</span>
                  <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}>
                    &#9662;
                  </span>
                </button>

                {isExpanded && (
                  <div className={styles.questionList}>
                    {questions.map(q => {
                      const isDone = modProgress.completedQuestions.includes(q.id);
                      const insight = modProgress.insights.find(ins => ins.questionId === q.id);
                      return (
                        <button
                          key={q.id}
                          className={`${styles.questionItem} ${isDone ? styles.questionDone : ''}`}
                          onClick={() => {
                            onSelectModule(mod.id);
                            onClose();
                          }}
                        >
                          <span className={styles.questionCheck}>
                            {isDone ? '●' : '○'}
                          </span>
                          <div className={styles.questionInfo}>
                            <span className={styles.questionLabel}>{q.label}</span>
                            {insight && (
                              <span className={styles.questionInsight}>
                                {insight.text.length > 40
                                  ? insight.text.slice(0, 40) + '...'
                                  : insight.text}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer links */}
        <div className={styles.footer}>
          <button className={styles.footerBtn} onClick={() => { onShowOnboarding(); onClose(); }}>
            導入をもう一度見る
          </button>
        </div>
      </aside>
    </>
  );
}
