export interface RfqItemInput {
  productName: string;
  productId?: string;
  quantity: number;
  unit?: string;
  notes?: string;
}

export function validateRfqInput(body: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push('items must be a non-empty array');
  } else {
    body.items.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push(`items[${index}] must be an object`);
        return;
      }

      const row = item as Record<string, unknown>;
      const productName =
        typeof row.productName === 'string' ? row.productName.trim() : '';

      if (!productName) {
        errors.push(`items[${index}].productName is required`);
      }

      const quantity = Number(row.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        errors.push(`items[${index}].quantity must be a positive number`);
      }
    });
  }

  const deliveryLocation =
    typeof body.deliveryLocation === 'string'
      ? body.deliveryLocation.trim()
      : '';

  if (!deliveryLocation) {
    errors.push('deliveryLocation is required');
  }

  if (body.requiredByDate != null && body.requiredByDate !== '') {
    const date = new Date(body.requiredByDate as string);
    if (Number.isNaN(date.getTime())) {
      errors.push('requiredByDate must be a valid date');
    } else if (date <= new Date()) {
      errors.push('requiredByDate must be in the future');
    }
  }

  return { valid: errors.length === 0, errors };
}

export function generateRfqNumber(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `RFQ-${year}-${randomDigits}`;
}
