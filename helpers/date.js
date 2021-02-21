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
