// src/utils/scoreFormatter.ts

/**
 * 文字列から先頭の無駄なゼロを取り除く（「010」->「10」等）
 * 「-」や「.」などの単一文字はそのまま返す
 */
export const trimZero = (str: string): string => {
  if (str === '-' || str === '.') return str;
  if (/^0\d/.test(str)) {
    return str.replace(/^0+(?=\d)/, '');
  }
  return str;
};

/**
 * 入力された数値文字列が、指定された単位（inputUnit）の倍数になっているか検証する
 */
export const isValidUnit = (valStr: string, inputUnit: number): boolean => {
  if (valStr === '' || valStr === '-') return true;
  const num = parseFloat(valStr);
  if (isNaN(num)) return false;
  // JavaScriptの浮動小数点演算誤差を考慮した判定
  const remainder = num % inputUnit;
  return Math.abs(remainder) < 0.0001 || Math.abs(remainder - inputUnit) < 0.0001;
};

/**
 * 割合（%）ベースの数値を、単位（inputUnit）に合わせて最も近い適切な実数点に補正する
 */
export const calculateAutoCorrect = (rawPct: number, maxScore: number, inputUnit: number): number => {
  const rawAbs = (rawPct / 100) * maxScore;
  const base = Math.floor(rawAbs / inputUnit) * inputUnit;
  const m = rawAbs - base;
  return m <= inputUnit / 2 + 0.0001 ? base : base + inputUnit;
};
