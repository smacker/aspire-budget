import { colors } from './constants';

export function unsetColor(v, defaultColor) {
  if (v === 0) {
    return colors.unset;
  }
  return defaultColor;
}

const warningPrecentage = 0.3;

export function warningColor(v, total, color) {
  if (v / total <= warningPrecentage) {
    return colors.warning;
  }

  return color;
}
