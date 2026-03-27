import type { ModuleInfo } from './types';

export interface ModuleColor {
  main: string;
  light: string;
  shadow: string;
}

export const moduleColors: Record<string, ModuleColor> = {
  'abstraction-ladder': { main: '#0EA5E9', light: '#E0F2FE', shadow: '#0284C7' },
  'essence-catcher':    { main: '#F97316', light: '#FFF7ED', shadow: '#EA580C' },
  'purpose-means':      { main: '#EAB308', light: '#FEFCE8', shadow: '#CA8A04' },
  'verbalization':      { main: '#A855F7', light: '#FAF5FF', shadow: '#9333EA' },
  'decomposition':      { main: '#10B981', light: '#ECFDF5', shadow: '#059669' },
};

export const modules: ModuleInfo[] = [
  {
    id: 'abstraction-ladder',
    title: 'ざっくり↔くっきり',
    subtitle: '視点を上げたり下げたりする練習',
    description: '「りんご」をどこまでざっくり言える？どこまでくっきりできる？',
    icon: '🔭',
  },
  {
    id: 'essence-catcher',
    title: 'それ、結局なに？',
    subtitle: '見えない共通点をさがす',
    description: 'バラバラに見える3つ。でも実は同じかも？',
    icon: '🔍',
  },
  {
    id: 'purpose-means',
    title: 'それ、なんのため？',
    subtitle: 'なぜ？を繰り返す',
    description: '「なぜ？」を3回繰り返すと、見えてくるものがある。',
    icon: '🧭',
  },
  {
    id: 'verbalization',
    title: '伝わる言葉にする',
    subtitle: 'モヤモヤを言葉にする',
    description: '頭の中にあるモヤモヤ、言葉にしてみよう。',
    icon: '💬',
  },
  {
    id: 'decomposition',
    title: 'バラしてみる',
    subtitle: '分けると見えてくる',
    description: 'コンビニって何でできてる？バラすと面白い。',
    icon: '🧩',
  },
];
