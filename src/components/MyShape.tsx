import type { UserProgress } from '../data/types';
import styles from './MyShape.module.css';

interface MyShapeProps {
  progress: UserProgress;
}

// 思考パターン分析（回答履歴から推測）
function analyzeThinkingStyle(progress: UserProgress) {
  const total = Object.values(progress.modules).reduce(
    (sum, mod) => sum + mod.completedQuestions.length, 0
  );
  const insights = Object.values(progress.modules).flatMap(mod => mod.insights);
  const avgInsightLength = insights.length > 0
    ? Math.round(insights.reduce((sum, i) => sum + i.text.length, 0) / insights.length)
    : 0;

  // モジュールごとの進捗バランスから思考傾向を推測
  const moduleProgress = {
    ladder: progress.modules['abstraction-ladder'].completedQuestions.length,
    essence: progress.modules['essence-catcher'].completedQuestions.length,
    purpose: progress.modules['purpose-means'].completedQuestions.length,
    verbal: progress.modules['verbalization'].completedQuestions.length,
    decomp: progress.modules['decomposition'].completedQuestions.length,
  };

  return { total, insights, avgInsightLength, moduleProgress };
}

export function MyShape({ progress }: MyShapeProps) {
  const analysis = analyzeThinkingStyle(progress);
  const hasData = analysis.total > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span className={styles.avatarEmoji}>🧑‍🔬</span>
        </div>
        <h2 className={styles.title}>自分のかたち</h2>
        <p className={styles.subtitle}>
          実験するほど、あなたの思考のかたちが見えてくる
        </p>
      </div>

      {!hasData ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>🔬</p>
          <h3 className={styles.emptyTitle}>まだ実験データがないよ</h3>
          <p className={styles.emptyText}>
            実験室でドリルに答えると、<br />
            ここにあなたの思考のかたちが浮かび上がってくるよ。
          </p>
        </div>
      ) : (
        <>
          {/* 思考マップ */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>思考のバランス</h3>
            <div className={styles.skillBars}>
              <SkillBar label="抽象化" value={analysis.moduleProgress.ladder} max={10} color="var(--color-teal-mid)" />
              <SkillBar label="本質を見る" value={analysis.moduleProgress.essence} max={8} color="var(--color-amber)" />
              <SkillBar label="目的を掘る" value={analysis.moduleProgress.purpose} max={8} color="var(--color-purple)" />
              <SkillBar label="言語化" value={analysis.moduleProgress.verbal} max={8} color="var(--color-coral)" />
              <SkillBar label="分解する" value={analysis.moduleProgress.decomp} max={8} color="var(--color-green-dark)" />
            </div>
          </div>

          {/* 数値 */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{analysis.total}</span>
              <span className={styles.statLabel}>実験回数</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{analysis.insights.length}</span>
              <span className={styles.statLabel}>気づき</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{progress.streak}</span>
              <span className={styles.statLabel}>連続日</span>
            </div>
          </div>

          {/* 気づきの吹き出し */}
          {analysis.insights.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>最近の気づき</h3>
              <div className={styles.bubbles}>
                {analysis.insights.slice(-5).reverse().map((insight, i) => (
                  <div key={i} className={styles.bubble}>
                    <p className={styles.bubbleText}>{insight.text}</p>
                    <span className={styles.bubbleDate}>{insight.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 激詰めコーディーの分析（未来機能のプレースホルダー） */}
          <div className={styles.codySection}>
            <div className={styles.codyAvatar}>🤖</div>
            <div className={styles.codyContent}>
              <p className={styles.codyLabel}>激詰めコーディー</p>
              <p className={styles.codyText}>
                {analysis.total < 5
                  ? 'まだ実験が始まったばかり。もう少しデータが集まったら、あなたの思考のクセを教えるよ。続けて。'
                  : analysis.total < 15
                  ? `${analysis.total}問やったね。${analysis.moduleProgress.ladder > analysis.moduleProgress.decomp ? '抽象化が得意みたい。次は「分解」にも挑戦してみて。' : '分析的に考えるのが好きそう。「抽象化ラダー」も試してみて。'}まだ序盤。本当の思考のかたちが見えるのはこれから。`
                  : `${analysis.total}問。本気だね。${analysis.insights.length > 0 ? `気づきを${analysis.insights.length}個書いてる。言語化する習慣がついてきてる。` : '気づきも書いてみて。思考は言葉にした瞬間に固まる。'}あなたの思考のかたち、だんだん見えてきてるよ。`}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SkillBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={styles.skillBar}>
      <div className={styles.skillInfo}>
        <span className={styles.skillLabel}>{label}</span>
        <span className={styles.skillValue}>{value}/{max}</span>
      </div>
      <div className={styles.skillTrack}>
        <div
          className={styles.skillFill}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
