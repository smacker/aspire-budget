import { colors } from './constants';

export function priceColor(v, defaultColor) {
  const f = parseFloat(v.slice(1));
  if (f === 0) {
    return colors.unset;
  }
  return defaultColor;
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
