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
  
  // 浮動小数点誤差を避けるため、整数に変換して判定
  const precision = 10; // 小数点以下10桁程度を考慮
  const multiplier = Math.pow(10, precision);
  const v = Math.round(num * multiplier);
  const u = Math.round(inputUnit * multiplier);
  
  return v % u === 0;
};

/**
 * 割合（%）ベースの数値を、単位（inputUnit）に合わせて補正する
 * 仕様: 前後の近い値に補正。乖離が等しい場合は低い方に寄せる。
 */
export const calculateAutoCorrect = (rawPct: number, maxScore: number, inputUnit: number): number => {
  if (maxScore <= 0) return 0;
  
  const rawAbs = (rawPct / 100) * maxScore;
  
  // inputUnitの何倍にあたるか（小数含む）
  const ratio = rawAbs / inputUnit;
  const floor = Math.floor(ratio);
  const diff = ratio - floor;

  // 乖離が 0.5 以下（等距離または低い方に近い）なら床、そうでなければ天井
  // 浮動小数点の誤差を考慮し、0.5000000001 のようなケースを許容
  const correctedScore = (diff <= 0.5 + 1e-10) 
    ? floor * inputUnit 
    : (floor + 1) * inputUnit;

  // 浮動小数点の誤差を丸める（例: 5.000000000000001 -> 5）
  // 有効桁数は inputUnit の精度に合わせるのが理想
  return Number(correctedScore.toFixed(10)) * 1 / 1;
};

/**
 * 表示用にスコアをフォーマットする（小数点第1位まで。不要な0は表示しない）
 */
export const formatScore = (val: number): string => {
  return Number(val.toFixed(1)).toString();
};

/**
 * 指定された単位に最も近い値に丸める（等距離の場合は低い方に寄せる）
 */
export const roundToUnit = (val: number, unit: number): number => {
  const ratio = val / unit;
  const floor = Math.floor(ratio);
  const diff = ratio - floor;
  
  const rounded = (diff <= 0.5 + 1e-10) ? floor * unit : (floor + 1) * unit;
  return Number(rounded.toFixed(10));
};

/**
 * 数値を指定された範囲内に収める
 */
export const clamp = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, val));
};
