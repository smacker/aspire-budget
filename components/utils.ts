import { colors } from './constants';

export function unsetColor(v: number, defaultColor: string) {
  if (v === 0) {
    return colors.unset;
  }
  return defaultColor;
}

const warningPercentage = 0.3;

export function warningColor(v: number, total: number, color: string) {
  if (v / total <= warningPercentage) {
    return colors.warning;
  }

  return color;
}

export function belowZeroColor(v: number, color: string) {
  if (v < 0) {
    return colors.activity;
  }
  return color;
}

export function coloredValue(v: number, total: number, defaultColor: string) {
  switch (true) {
    case v < 0:
      return colors.activity;
    case v === 0:
      return colors.unset;
    case v / total <= warningPercentage:
      return colors.warning;
    default:
      return defaultColor;
  }
}
