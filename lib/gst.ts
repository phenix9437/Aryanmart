export interface GstBreakdown {
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
  totalWithGst: number;
}

export function calculateGst(amount: number, gstRate: number): GstBreakdown {
  const taxableAmount = amount;
  const gstAmount = Math.round(((amount * gstRate) / 100) * 100) / 100;
  const totalWithGst = taxableAmount + gstAmount;

  return {
    taxableAmount,
    gstRate,
    gstAmount,
    totalWithGst,
  };
}

export function calculateCartTotals(
  items: { quantity: number; unitPrice: number; gstRate: number }[]
) {
  const itemBreakdowns = items.map((item) => {
    const lineAmount = item.quantity * item.unitPrice;
    const breakdown = calculateGst(lineAmount, item.gstRate);
    return { ...breakdown, quantity: item.quantity };
  });

  const subtotal = itemBreakdowns.reduce(
    (sum, item) => sum + item.taxableAmount,
    0
  );
  const totalGst = itemBreakdowns.reduce(
    (sum, item) => sum + item.gstAmount,
    0
  );
  const grandTotal = subtotal + totalGst;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalGst: Math.round(totalGst * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
    itemBreakdowns,
  };
}
