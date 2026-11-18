// QR se order id nikalta hai: "12", {"order_id":12} ya URL jo id par khatam ho
export function parseOrderId(raw) {
  const text = String(raw ?? '').trim();
  try {
    const j = JSON.parse(text);
    const v = j?.order_id ?? j?.orderId ?? j?.id;
    if (v) return Number(v) || null;
  } catch {
    /* plain text hai */
  }
  const m = text.match(/(\d+)\s*$/) || text.match(/\d+/);
  return m ? Number(m[1] ?? m[0]) : null;
}
