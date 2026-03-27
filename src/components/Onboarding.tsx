import { useState } from 'react';
import styles from './Onboarding.module.css';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 'welcome',
    content: () => (
      <>
        <h2 className={styles.title}>
          ちょっとだけ、
          <br />
          考え方の話をしよう
        </h2>
        <p className={styles.text}>
          難しい話じゃない。
          <br />
          ふだん無意識にやっていることに、名前をつけるだけ。
        </p>
      </>
    ),
  },
  {
    id: 'apple',
    content: (answer: string, setAnswer: (v: string) => void) => (
      <>
        <p className={styles.label}>まずこれ、見て。</p>
        <h2 className={styles.bigWord}>りんご</h2>
        <p className={styles.text}>
          「りんご」って聞いて、何を思い浮かべた？
        </p>
        <textarea
          className={styles.input}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="自由に書いてみて"
          rows={3}
        />
      </>
    ),
  },
  {
    id: 'apple-reveal',
    content: () => (
      <>
        <p className={styles.text}>たぶん、こんな感じじゃない？</p>
        <div className={styles.bubbles}>
          <span className={styles.bubble}>赤くて丸い</span>
          <span className={styles.bubble}>スーパーで売ってる</span>
          <span className={styles.bubble}>シャリシャリしてる</span>
          <span className={styles.bubble}>秋の果物</span>
        </div>
        <p className={styles.text}>
          これが<strong>「具体」</strong>。
          <br />
          目に見える。触れる。五感で感じられるもの。
        </p>
      </>
    ),
  },
  {
    id: 'abstract-intro',
    content: () => (
      <>
        <p className={styles.text}>じゃあ、こう聞かれたら？</p>
        <h2 className={styles.question}>「りんご」って、つまり何？</h2>
        <div className={styles.ladder}>
          <div className={styles.ladderItem}>
            <span className={styles.ladderLabel}>そのまま</span>
            りんご
          </div>
          <div className={styles.ladderArrow}>&darr;</div>
          <div className={styles.ladderItem}>
            <span className={styles.ladderLabel}>もう少し広く</span>
            果物
          </div>
          <div className={styles.ladderArrow}>&darr;</div>
          <div className={styles.ladderItem}>
            <span className={styles.ladderLabel}>さらに広く</span>
            食べ物
          </div>
          <div className={styles.ladderArrow}>&darr;</div>
          <div className={styles.ladderItem}>
            <span className={styles.ladderLabel}>もっと</span>
            栄養を摂ること
          </div>
          <div className={styles.ladderArrow}>&darr;</div>
          <div className={styles.ladderItem}>
            <span className={styles.ladderLabel}>究極</span>
            生きること
          </div>
        </div>
        <p className={styles.text}>
          上に行くほど<strong>「抽象」</strong>。
          <br />
          目に見えない。でも、たくさんのものを含む、大きな概念。
        </p>
      </>
    ),
  },
  {
    id: 'why-matters',
    content: () => (
      <>
        <h2 className={styles.title}>
          で、それが
          <br />
          なんの役に立つの？
        </h2>
        <div className={styles.examples}>
          <div className={styles.example}>
            <p className={styles.exampleLabel}>具体しか見えない人</p>
            <p className={styles.exampleText}>
              「SNSフォロワーを増やしたい」
              <br />
              <span className={styles.muted}>→ 手段に固執して、本当の目的を見失う</span>
            </p>
          </div>
          <div className={styles.example}>
            <p className={styles.exampleLabel}>抽象しか言えない人</p>
            <p className={styles.exampleText}>
              「ブランディングが大事です」
              <br />
              <span className={styles.muted}>→ かっこいいけど、明日何をすればいいかわからない</span>
            </p>
          </div>
          <div className={styles.exampleHighlight}>
            <p className={styles.exampleLabel}>両方を行き来できる人</p>
            <p className={styles.exampleText}>
              「ブランディング」が大事だとわかっていて、
              <br />
              「じゃあ明日、SNSのプロフィール写真をプロに撮り直そう」
              <br />
              と具体的な一歩を踏み出せる。
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'trap',
    content: () => (
      <>
        <h2 className={styles.title}>
          実はこれ、
          <br />
          全部つながってる
        </h2>
        <div className={styles.connectionList}>
          <div className={styles.connection}>
            <span className={styles.connectionSkill}>具体⇔抽象</span>
            <span className={styles.connectionArrow}>=</span>
            <span className={styles.connectionResult}>企画書がスラスラ書ける</span>
          </div>
          <div className={styles.connection}>
            <span className={styles.connectionSkill}>本質を見抜く</span>
            <span className={styles.connectionArrow}>=</span>
            <span className={styles.connectionResult}>「それ、いいね」と言われるアイデア</span>
          </div>
          <div className={styles.connection}>
            <span className={styles.connectionSkill}>目的と手段を分ける</span>
            <span className={styles.connectionArrow}>=</span>
            <span className={styles.connectionResult}>無駄な作業が減る</span>
          </div>
          <div className={styles.connection}>
            <span className={styles.connectionSkill}>言語化する力</span>
            <span className={styles.connectionArrow}>=</span>
            <span className={styles.connectionResult}>伝わるプレゼン・提案</span>
          </div>
          <div className={styles.connection}>
            <span className={styles.connectionSkill}>構造を分解する</span>
            <span className={styles.connectionArrow}>=</span>
            <span className={styles.connectionResult}>問題の原因が見つかる</span>
          </div>
        </div>
        <p className={styles.textCenter}>
          思考の筋トレをしていたら、
          <br />
          気づいたら仕事もうまくなってた。
          <br />
          <strong>そういう設計。</strong>
        </p>
      </>
    ),
  },
  {
    id: 'start',
    content: () => (
      <>
        <h2 className={styles.title}>
          じゃあ、
          <br />
          やってみよう
        </h2>
        <p className={styles.text}>
          1日1問でいい。
          <br />
          正解はない。自分で考えて、自分の気づきを書く。
          <br />
          それだけで、思考の解像度は上がっていく。
        </p>
      </>
    ),
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answer, setAnswer] = useState('');

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        {steps.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i === stepIndex ? styles.dotActive : ''} ${i < stepIndex ? styles.dotDone : ''}`}
          />
        ))}
      </div>

      <div className={styles.content} key={step.id}>
        {step.id === 'apple'
          ? (step.content as any)(answer, setAnswer)
          : (step.content as any)()}
      </div>

      <div className={styles.nav}>
        {stepIndex > 0 && (
          <button className={styles.backBtn} onClick={handleBack}>
            戻る
          </button>
        )}
        <button className={styles.nextBtn} onClick={handleNext}>
          {isLast ? 'トレーニングを始める' : '次へ'}
        </button>
      </div>
    </div>
  );
}
