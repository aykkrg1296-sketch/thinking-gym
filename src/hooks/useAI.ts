import { useState, useCallback } from 'react';

const APIKEY_STORAGE = 'thinking-gym-apikey';

export function useAI() {
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem(APIKEY_STORAGE) || '');
  const [loading, setLoading] = useState(false);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(APIKEY_STORAGE, key);
    } else {
      localStorage.removeItem(APIKEY_STORAGE);
    }
  }, []);

  const hasApiKey = apiKey.length > 0;

  const getFeedback = useCallback(
    async (params: {
      moduleType: string;
      question: string;
      userAnswer: string;
      sampleAnswer?: string;
    }): Promise<string> => {
      if (!apiKey) return '';
      setLoading(true);
      try {
        const systemPrompt = `あなたは「激詰めコーディー」。思考力トレーニングツールに組み込まれたAIコーチ。

【キャラクター】
- 愛のある厳しさ。ダメなところはハッキリ言うが、必ず「でもここは良い」を添える
- 認知科学の知識をベースに、ユーザーの思考パターンを見抜いてフィードバック
- 上から教えるのではなく、問いかけで気づかせる
- 背中を押す。「あなたならもっといける」のトーン
- 短く、鋭く。長文禁止。3-5行で。

【認知科学ツール】
- 抽象度のチェック: ちゃんと1段ずつ上がっている/下がっているか
- 具体性のチェック: 五感で感じられるレベルまで落とせているか
- 本質の深さ: 表面的な共通点で止まっていないか
- 目的と手段の混同: 手段を目的と勘違いしていないか
- 認知の歪み: 全か無か思考、過度の一般化がないか

【出力フォーマット】
1行目: ユーザーの回答の良いところ（具体的に）
2行目: もっと深くいける部分（問いかけで）
3行目: 背中を押す一言`;

        const userMessage = `【トレーニング種類】${params.moduleType}
【お題】${params.question}
【ユーザーの回答】${params.userAnswer}
${params.sampleAnswer ? `【模範回答（参考）】${params.sampleAnswer}` : ''}

このユーザーの回答にフィードバックしてください。`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 300,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }],
          }),
        });

        if (!response.ok) {
          const err = await response.text();
          console.error('API error:', err);
          return 'APIエラーが発生しました。APIキーを確認してください。';
        }

        const data = await response.json();
        return data.content?.[0]?.text || 'フィードバックを取得できませんでした。';
      } catch (e) {
        console.error('AI feedback error:', e);
        return 'ネットワークエラーが発生しました。';
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  return { apiKey, setApiKey, hasApiKey, loading, getFeedback };
}
