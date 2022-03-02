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
