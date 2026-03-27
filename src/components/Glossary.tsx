import { useState } from 'react';
import styles from './Glossary.module.css';

interface Term {
  word: string;
  reading: string;
  meaning: string;
  example: string;
}

interface Category {
  label: string;
  icon: string;
  color: string;
  terms: Term[];
}

const categories: Category[] = [
  {
    label: '思考の基本',
    icon: '🧠',
    color: '#0F766E',
    terms: [
      {
        word: '抽象',
        reading: 'ちゅうしょう',
        meaning: '複数の具体的なものから、共通する性質だけを取り出すこと。',
        example: 'りんご・バナナ・みかん → 「果物」が抽象',
      },
      {
        word: '具体',
        reading: 'ぐたい',
        meaning: '実際に触れる、目に見える、数えられるレベルの話。',
        example: '「果物が好き」は抽象 →「毎朝りんごを1個食べる」が具体',
      },
      {
        word: '本質',
        reading: 'ほんしつ',
        meaning: 'それがなくなったら、それじゃなくなるもの。一番大事な核。',
        example: 'カフェの本質は「コーヒー」じゃなく「居心地のいい時間」かもしれない',
      },
      {
        word: '目的',
        reading: 'もくてき',
        meaning: '「なぜやるのか」の答え。最終的に手に入れたいもの。',
        example: '英語を勉強する → 目的は「海外で働きたい」',
      },
      {
        word: '手段',
        reading: 'しゅだん',
        meaning: '目的を達成するためのやり方・道具。目的と入れ替わりやすい。',
        example: '「英語の勉強」は手段。「TOEIC 900点」も手段。目的は別にある',
      },
      {
        word: '言語化',
        reading: 'げんごか',
        meaning: '頭の中のモヤモヤを、誰にでも伝わる言葉に変えること。',
        example: '「なんかいい感じ」→「余白が多くて読みやすい」が言語化',
      },
      {
        word: '分解',
        reading: 'ぶんかい',
        meaning: '大きなかたまりを、小さなパーツに分けて構造を見ること。',
        example: '「料理がうまくなりたい」→ 食材選び × 下ごしらえ × 火加減 × 味付け に分解',
      },
      {
        word: '構造',
        reading: 'こうぞう',
        meaning: 'ものごとがどう組み合わさっているか。骨組み。',
        example: '料理の構造 = 買い出し → 下ごしらえ → 調理 → 盛り付け',
      },
      {
        word: '転用',
        reading: 'てんよう',
        meaning: 'ある場面で学んだことを、別の場面に使い回すこと。',
        example: '料理の「素材→加工→仕上げ」の流れは、プレゼン資料作りにも使える',
      },
    ],
  },
  {
    label: '伝える力',
    icon: '💬',
    color: '#D97706',
    terms: [
      {
        word: '解像度',
        reading: 'かいぞうど',
        meaning: 'ものごとがどれだけ細かく見えているか。ぼやけてるか、くっきりか。',
        example: '「旅行が好き」(低解像度) → 「知らない路地裏を歩いて地元の人と話すのが好き」(高解像度)',
      },
      {
        word: '視点',
        reading: 'してん',
        meaning: 'どこから見ているか。同じものでも見る角度で全然違って見える。',
        example: '遅刻 → 上司の視点「信用できない」、本人の視点「電車が遅れた」、同僚の視点「また俺がカバーか」',
      },
      {
        word: '前提',
        reading: 'ぜんてい',
        meaning: '「当たり前だと思い込んでいること」。前提が違うと、結論も全部変わる。',
        example: '「大学に行くべき」は前提。「なぜ？」と聞くと、前提が揺らぎ始める',
      },
      {
        word: '因果関係',
        reading: 'いんがかんけい',
        meaning: '「AだからBが起きた」という原因と結果のつながり。',
        example: '「アイスが売れた日に水難事故が増えた」→ 因果じゃない。暑さが両方の原因',
      },
      {
        word: '相関と因果',
        reading: 'そうかんといんが',
        meaning: '一緒に動く（相関）のと、片方が原因（因果）は違う。混同すると判断を間違える。',
        example: '「勉強時間が長い人ほど成績がいい」→ 時間じゃなく集中の質が原因かもしれない',
      },
      {
        word: 'たとえ話',
        reading: 'たとえばなし',
        meaning: '難しいことを、身近なものに置き換えて伝える技術。理解の橋渡し。',
        example: '「プログラミングは料理のレシピみたいなもの。手順通りにやれば誰でもできる」',
      },
    ],
  },
  {
    label: '学び方',
    icon: '📚',
    color: '#7C3AED',
    terms: [
      {
        word: '気づき',
        reading: 'きづき',
        meaning: '「あ、そうだったのか」という発見。感情が動いた瞬間に生まれる。',
        example: '会議で黙ってた理由が「バカだから」じゃなく「考え方を知らなかっただけ」と気づく',
      },
      {
        word: 'フレームワーク',
        reading: 'ふれーむわーく',
        meaning: '考える時の「型」。毎回ゼロから考えなくていい道具。',
        example: '「結論→理由→具体例」で話す型。これだけで説明がわかりやすくなる',
      },
      {
        word: 'MECE',
        reading: 'みーしー',
        meaning: 'モレなくダブりなく。分解する時の基本ルール。',
        example: '人を「男・女・子ども」で分けるとダブる。「男・女」ならMECE',
      },
      {
        word: '仮説',
        reading: 'かせつ',
        meaning: '「たぶんこうじゃないか？」という仮の答え。正解じゃなくていい。仮説があると検証できる。',
        example: '「このお店が流行ってるのは立地じゃなく接客がいいからでは？」が仮説',
      },
      {
        word: '検証',
        reading: 'けんしょう',
        meaning: '仮説が合ってるか、実際に確かめること。考えっぱなしにしない。',
        example: '「接客がいいから流行ってる」→ 実際に行って、接客を観察して、口コミも読む',
      },
      {
        word: '帰納と演繹',
        reading: 'きのうとえんえき',
        meaning: '帰納 = 具体から法則を見つける。演繹 = 法則から具体に当てはめる。思考の2大エンジン。',
        example: '帰納:「A店もB店もC店も接客がいい → 繁盛店は接客が鍵？」 演繹:「接客が鍵なら、D店も接客を見ればわかるはず」',
      },
    ],
  },
];

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Glossary({ isOpen, onClose }: GlossaryProps) {
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  if (!isOpen) return null;

  const cat = categories[activeCategory];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} />
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>📖 ことばの意味</h2>
          <p className={styles.panelSub}>
            わからなくなったら、いつでもここに戻ってきて。
          </p>
        </div>

        <div className={styles.categoryTabs}>
          {categories.map((c, i) => (
            <button
              key={c.label}
              className={`${styles.categoryTab} ${activeCategory === i ? styles.categoryTabActive : ''}`}
              style={activeCategory === i ? { borderColor: c.color, color: c.color } : {}}
              onClick={() => { setActiveCategory(i); setExpandedTerm(null); }}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.termList}>
          {cat.terms.map(t => {
            const isExpanded = expandedTerm === `${activeCategory}-${t.word}`;
            return (
              <button
                key={t.word}
                className={`${styles.termItem} ${isExpanded ? styles.expanded : ''}`}
                style={isExpanded ? { borderColor: cat.color, background: `${cat.color}08` } : {}}
                onClick={() => setExpandedTerm(isExpanded ? null : `${activeCategory}-${t.word}`)}
              >
                <div className={styles.termTop}>
                  <span className={styles.termWord}>{t.word}</span>
                  <span className={styles.termReading}>{t.reading}</span>
                  <span className={styles.termArrow}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
                <p className={styles.termMeaning}>{t.meaning}</p>
                {isExpanded && (
                  <div className={styles.termExample} style={{ borderLeftColor: cat.color }}>
                    <span className={styles.exampleLabel} style={{ color: cat.color }}>
                      たとえば
                    </span>
                    <p className={styles.exampleText}>{t.example}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          とじる
        </button>
      </div>
    </div>
  );
}
