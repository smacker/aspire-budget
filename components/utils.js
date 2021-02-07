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

export function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = padZero(d.getMonth() + 1);
  const dd = padZero(d.getDate());
  return `${dd}/${mm}/${yyyy}`;
}

function padZero(v) {
  if (('' + v).length < 2) {
    return '0' + v;
  }

  return v;
}
