import { useState, useMemo } from 'react';
import type { ModuleId } from '../data/types';
import { ladderQuestions } from '../data/abstraction-ladder';
import { essenceQuestions } from '../data/essence-catcher';
import { purposeMeansQuestions } from '../data/purpose-means';
import { verbalizationQuestions } from '../data/verbalization';
import { decompositionQuestions } from '../data/decomposition';
import { modules } from '../data/modules';
import styles from './Training.module.css';

interface AIHandle {
  hasApiKey: boolean;
  loading: boolean;
  getFeedback: (params: {
    moduleType: string;
    question: string;
    userAnswer: string;
    sampleAnswer?: string;
  }) => Promise<string>;
}

interface TrainingProps {
  moduleId: ModuleId;
  completedQuestions: string[];
  onComplete: (questionId: string) => void;
  onInsight: (questionId: string, text: string) => void;
  ai?: AIHandle;
}

type Phase = 'question' | 'answer' | 'insight' | 'done';

function getQuestions(moduleId: ModuleId) {
  switch (moduleId) {
    case 'abstraction-ladder':
      return ladderQuestions;
    case 'essence-catcher':
      return essenceQuestions;
    case 'purpose-means':
      return purposeMeansQuestions;
    case 'verbalization':
      return verbalizationQuestions;
    case 'decomposition':
      return decompositionQuestions;
  }
}

export function Training({ moduleId, completedQuestions, onComplete, onInsight, ai }: TrainingProps) {
  const allQuestions = getQuestions(moduleId);
  const moduleInfo = modules.find(m => m.id === moduleId)!;

  // Find next uncompleted question
  const currentQuestion = useMemo(() => {
    return allQuestions.find(q => !completedQuestions.includes(q.id)) ?? null;
  }, [allQuestions, completedQuestions]);

  const [phase, setPhase] = useState<Phase>(currentQuestion ? 'question' : 'done');
  const [userAnswer, setUserAnswer] = useState('');
  const [ladderSteps, setLadderSteps] = useState<string[]>(['', '', '', '']);
  const [hintIndex, setHintIndex] = useState(0);
  const [insightText, setInsightText] = useState('');
  const [stepsRevealed, setStepsRevealed] = useState(0);
  const [aiFeedback, setAiFeedback] = useState('');

  if (phase === 'done' || !currentQuestion) {
    return (
      <div className={styles.container}>
        <div className={styles.doneCard}>
          <p className={styles.doneIcon}>🎉</p>
          <h2 className={styles.doneTitle}>全部やりきった！</h2>
          <p className={styles.doneText}>
            「{moduleInfo.title}」コンプリート。
            <br />
            次の問題も準備中。楽しみにしてて。
          </p>
        </div>
      </div>
    );
  }

  const q = currentQuestion;
  const hints = 'hints' in q ? (q as any).hints : [];
  const canShowMoreHints = hintIndex < hints.length;

  const handleShowHint = () => {
    if (canShowMoreHints) {
      setHintIndex(prev => prev + 1);
    }
  };

  const handleRevealAnswer = () => {
    setPhase('answer');
  };

  const handleGoToInsight = () => {
    onComplete(q.id);
    setPhase('insight');
  };

  const handleFinishInsight = () => {
    if (insightText.trim()) {
      onInsight(q.id, insightText);
    }
    // Move to next question
    const nextQ = allQuestions.find(
      qq => !completedQuestions.includes(qq.id) && qq.id !== q.id
    );
    if (nextQ) {
      setPhase('question');
      setUserAnswer('');
      setLadderSteps(['', '', '', '']);
      setHintIndex(0);
      setInsightText('');
      setStepsRevealed(0);
      setAiFeedback('');
    } else {
      setPhase('done');
    }
  };

  const handleRevealStep = () => {
    setStepsRevealed(prev => prev + 1);
  };

  const progressIndex = completedQuestions.length;
  const totalQuestions = allQuestions.length;

  return (
    <div className={styles.container}>
      <div className={styles.progressInfo}>
        <span>
          {progressIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* --- QUESTION PHASE --- */}
      {phase === 'question' && (
        <div className={styles.card}>
          {renderQuestionContent(moduleId, q, userAnswer, setUserAnswer, hints, hintIndex, stepsRevealed, handleRevealStep, ladderSteps, setLadderSteps)}

          {/* Hints */}
          {hintIndex > 0 && (
            <div className={styles.hintsSection}>
              {hints.slice(0, hintIndex).map((hint: string, i: number) => (
                <div key={i} className={styles.hint}>
                  <span className={styles.hintLabel}>Hint {i + 1}</span>
                  <p>{hint}</p>
                </div>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            {canShowMoreHints && (
              <button className={styles.secondaryBtn} onClick={handleShowHint}>
                ヒントを見る
              </button>
            )}
            <button className={styles.primaryBtn} onClick={handleRevealAnswer}>
              模範回答を見る
            </button>
          </div>
        </div>
      )}

      {/* --- ANSWER PHASE --- */}
      {phase === 'answer' && (
        <div className={styles.card}>
          {renderAnswerContent(moduleId, q)}

          <div className={styles.explanation}>
            <p className={styles.explanationLabel}>なぜこの問題があるか</p>
            <p>{(q as any).explanation}</p>
          </div>

          {/* 激詰めコーディー AI フィードバック */}
          {ai?.hasApiKey && userAnswer.trim() && (
            <div className={styles.aiSection}>
              {!aiFeedback && !ai.loading && (
                <button
                  className={styles.aiBtn}
                  onClick={async () => {
                    const questionText = getQuestionText(moduleId, q);
                    const sampleText = getSampleText(moduleId, q);
                    const fb = await ai.getFeedback({
                      moduleType: moduleInfo.title,
                      question: questionText,
                      userAnswer,
                      sampleAnswer: sampleText,
                    });
                    setAiFeedback(fb);
                  }}
                >
                  激詰めコーディーに聞く
                </button>
              )}
              {ai.loading && (
                <div className={styles.aiLoading}>考え中...</div>
              )}
              {aiFeedback && (
                <div className={styles.aiFeedback}>
                  <p className={styles.aiFeedbackLabel}>激詰めコーディー</p>
                  <p className={styles.aiFeedbackText}>{aiFeedback}</p>
                </div>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.primaryBtn} onClick={handleGoToInsight}>
              気づきを書く
            </button>
          </div>
        </div>
      )}

      {/* --- INSIGHT PHASE --- */}
      {phase === 'insight' && (
        <div className={styles.card}>
          <h3 className={styles.insightTitle}>今の気づき</h3>
          <p className={styles.insightSub}>
            この問題で感じたこと、学んだことを自分の言葉で。
          </p>
          <textarea
            className={styles.insightInput}
            value={insightText}
            onChange={e => setInsightText(e.target.value)}
            placeholder="ここに自由に書く..."
            rows={4}
            autoFocus
          />
          <div className={styles.actions}>
            <button className={styles.secondaryBtn} onClick={handleFinishInsight}>
              {insightText.trim() ? '記録して次へ' : 'スキップして次へ'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Render question content per module --- */
function renderQuestionContent(
  moduleId: ModuleId,
  q: any,
  userAnswer: string,
  setUserAnswer: (v: string) => void,
  _hints: string[],
  _hintIndex: number,
  stepsRevealed: number,
  onRevealStep: () => void,
  ladderSteps: string[],
  setLadderSteps: (v: string[]) => void
) {
  switch (moduleId) {
    case 'abstraction-ladder': {
      const direction = q.direction === 'up' ? '具体 → 抽象' : '抽象 → 具体';
      const arrow = q.direction === 'up' ? '↑' : '↓';
      const directionDesc =
        q.direction === 'up'
          ? '1段ずつ抽象度を上げてみよう'
          : '1段ずつ具体的にしてみよう';
      const updateStep = (index: number, value: string) => {
        const next = [...ladderSteps];
        next[index] = value;
        setLadderSteps(next);
        setUserAnswer(next.filter(s => s.trim()).join(' → '));
      };
      return (
        <>
          <div className={styles.badge}>{direction}</div>
          <h2 className={styles.questionText}>{q.start}</h2>
          <p className={styles.questionSub}>
            ここから{q.steps}段、{directionDesc}。
          </p>
          <div className={styles.stepInputs}>
            <div className={styles.stepStart}>
              <span className={styles.stepLabel}>Start</span>
              <span className={styles.stepValue}>{q.start}</span>
            </div>
            {Array.from({ length: q.steps }, (_, i) => (
              <div key={i} className={styles.stepRow}>
                <span className={styles.stepArrow}>{arrow}</span>
                <div className={styles.stepInputWrap}>
                  <span className={styles.stepNumber}>{i + 1}段目</span>
                  <input
                    className={styles.stepInput}
                    type="text"
                    value={ladderSteps[i] || ''}
                    onChange={e => updateStep(i, e.target.value)}
                    placeholder={q.direction === 'up' ? 'もう少し抽象的に...' : 'もう少し具体的に...'}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
    case 'essence-catcher':
      return (
        <>
          <p className={styles.questionSub}>この3つの「本質的な」共通点は？</p>
          <div className={styles.examples}>
            {q.examples.map((ex: string, i: number) => (
              <span key={i} className={styles.exampleTag}>
                {ex}
              </span>
            ))}
          </div>
          <p className={styles.cautionText}>
            表面的な共通点（{q.surfaceAnswer}）ではなく、もっと深い本質を探してみよう。
          </p>
          <textarea
            className={styles.textarea}
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="この3つに共通する本質は..."
            rows={4}
          />
        </>
      );
    case 'purpose-means':
      return (
        <>
          <p className={styles.questionSub}>これは目的？それとも手段？</p>
          <h2 className={styles.questionText}>{q.statement}</h2>
          <p className={styles.questionSub}>
            「なぜ？」を繰り返して、本当の目的に辿り着こう。
          </p>
          <div className={styles.whyChain}>
            {q.whyChain.map((step: string, i: number) => (
              <div key={i} className={styles.whyStep}>
                {i < stepsRevealed ? (
                  <>
                    <span className={styles.whyLabel}>Why {i + 1}</span>
                    <p>{step}</p>
                  </>
                ) : i === stepsRevealed ? (
                  <button className={styles.revealStepBtn} onClick={onRevealStep}>
                    Why {i + 1} を開く
                  </button>
                ) : (
                  <div className={styles.whyLocked}>Why {i + 1}</div>
                )}
              </div>
            ))}
          </div>
          <textarea
            className={styles.textarea}
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="本当の目的は何だと思う？それに対して、もっといい手段はある？"
            rows={4}
          />
        </>
      );
    case 'verbalization':
      return (
        <>
          <h2 className={styles.questionText}>{q.concept}</h2>
          <p className={styles.questionSub}>
            <strong>{q.audience}</strong>に、この概念を説明してください。
          </p>
          <div className={styles.checkpoints}>
            {q.checkpoints.map((cp: string, i: number) => (
              <label key={i} className={styles.checkpoint}>
                <input type="checkbox" />
                <span>{cp}</span>
              </label>
            ))}
          </div>
          <textarea
            className={styles.textarea}
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="こんな風に説明します..."
            rows={6}
          />
        </>
      );
    case 'decomposition':
      return (
        <>
          <p className={styles.questionSub}>この仕組みを構成要素に分解しよう</p>
          <h2 className={styles.questionText}>{q.subject}</h2>
          <p className={styles.questionSub}>
            何が、何に影響しているか？ どこを動かしたら結果が変わる？
          </p>
          <textarea
            className={styles.textarea}
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="構成要素:\n1. \n2. \n3. \n\n関係性:\n\nレバレッジポイント:"
            rows={8}
          />
        </>
      );
    default:
      return null;
  }
}

/* --- Render answer content per module --- */
function renderAnswerContent(moduleId: ModuleId, q: any) {
  switch (moduleId) {
    case 'abstraction-ladder':
      return (
        <>
          <p className={styles.answerLabel}>模範回答</p>
          <div className={styles.ladderSteps}>
            <div className={styles.ladderStart}>
              <span className={styles.ladderTag}>Start</span>
              {q.start}
            </div>
            {q.sampleAnswer.map((step: string, i: number) => (
              <div key={i} className={styles.ladderStep}>
                <span className={styles.ladderTag}>{q.direction === 'up' ? '↑' : '↓'} {i + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </>
      );
    case 'essence-catcher':
      return (
        <>
          <p className={styles.answerLabel}>本質</p>
          <p className={styles.answerMain}>{q.essenceAnswer}</p>
          <div className={styles.comparison}>
            <div className={styles.comparisonItem}>
              <span className={styles.comparisonLabel}>表面的な答え</span>
              <p>{q.surfaceAnswer}</p>
            </div>
            <div className={styles.comparisonItem}>
              <span className={styles.comparisonLabel}>本質的な答え</span>
              <p>{q.essenceAnswer}</p>
            </div>
          </div>
        </>
      );
    case 'purpose-means':
      return (
        <>
          <p className={styles.answerLabel}>Why?チェーン</p>
          <div className={styles.whyChainAnswer}>
            <div className={styles.whyStepAnswer}>
              <span className={styles.whyLabel}>出発点</span>
              <p>{q.statement}</p>
            </div>
            {q.whyChain.map((step: string, i: number) => (
              <div key={i} className={styles.whyStepAnswer}>
                <span className={styles.whyLabel}>Why {i + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
          <div className={styles.betterMeans}>
            <p className={styles.answerLabel}>もっといい手段があるかも</p>
            <p>{q.betterMeans}</p>
          </div>
        </>
      );
    case 'verbalization':
      return (
        <>
          <div className={styles.comparison}>
            <div className={styles.comparisonBad}>
              <span className={styles.comparisonLabel}>こうなりがち</span>
              <p>{q.badExample}</p>
            </div>
            <div className={styles.comparisonGood}>
              <span className={styles.comparisonLabel}>こう言えたら</span>
              <p>{q.goodExample}</p>
            </div>
          </div>
        </>
      );
    case 'decomposition':
      return (
        <>
          <p className={styles.answerLabel}>構成要素</p>
          <ul className={styles.componentList}>
            {q.components.map((c: string, i: number) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
          <div className={styles.relationships}>
            <p className={styles.answerLabel}>関係性</p>
            <p>{q.relationships}</p>
          </div>
          <div className={styles.leverPoint}>
            <p className={styles.answerLabel}>レバレッジポイント</p>
            <p>{q.leverPoint}</p>
          </div>
        </>
      );
    default:
      return null;
  }
}

function getQuestionText(moduleId: ModuleId, q: any): string {
  switch (moduleId) {
    case 'abstraction-ladder':
      return `${q.direction === 'up' ? '具体→抽象' : '抽象→具体'}: ${q.start}`;
    case 'essence-catcher':
      return `本質キャッチ: ${q.examples.join(' / ')}`;
    case 'purpose-means':
      return `目的⇔手段: ${q.statement}`;
    case 'verbalization':
      return `言語化: ${q.concept} を ${q.audience} に説明`;
    case 'decomposition':
      return `分解: ${q.subject}`;
  }
}

function getSampleText(moduleId: ModuleId, q: any): string {
  switch (moduleId) {
    case 'abstraction-ladder':
      return q.sampleAnswer.join(' → ');
    case 'essence-catcher':
      return q.essenceAnswer;
    case 'purpose-means':
      return q.whyChain.join(' → ') + ' / ' + q.betterMeans;
    case 'verbalization':
      return q.goodExample;
    case 'decomposition':
      return q.components.join(', ') + ' / ' + q.leverPoint;
  }
}
