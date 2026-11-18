// Din-wise data ko style ke hisaab se jod deta hai: "usne kaun kaun se style banaye"
export function summarizeByStyle(days) {
  const map = new Map();
  days.forEach((d) => d.items.forEach((i) => {
    const key = `${i.style_number}|${i.pattern_number}`;
    const cur = map.get(key) || { style_number: i.style_number, pattern_number: i.pattern_number, rate: i.rate, pcs: 0, amount: 0 };
    cur.pcs += i.pcs;
    cur.amount = Number((cur.amount + i.amount).toFixed(2));
    map.set(key, cur);
  }));
  return [...map.values()].sort((a, b) => b.pcs - a.pcs);
}
