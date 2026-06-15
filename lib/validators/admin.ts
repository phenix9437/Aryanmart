const VALID_GST_RATES = [0, 5, 12, 18, 28];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateCategoryInput(
  body: Record<string, unknown>,
  isUpdate = false
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isUpdate || body.name !== undefined) {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      errors.push('name is required');
    }
  }

  const level =
    body.level !== undefined && body.level !== null
      ? Number(body.level)
      : undefined;

  if (level !== undefined) {
    if (level !== 1 && level !== 2) {
      errors.push('level must be 1 or 2');
    }

    if (level === 2 && !body.parentId) {
      errors.push('parentId is required when level is 2');
    }

    if (level === 1 && body.parentId) {
      errors.push('parentId must be null or absent when level is 1');
    }
  }

  if (body.parentId && body.level === undefined && !isUpdate) {
    // level not specified but parentId given on create — treat as L2 requirement
  }

  return { valid: errors.length === 0, errors };
}

export function validateBrandInput(
  body: Record<string, unknown>,
  isUpdate = false
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isUpdate || body.name !== undefined) {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      errors.push('name is required');
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateVariantRow(
  variant: unknown,
  index: number,
  errors: string[]
) {
  if (!variant || typeof variant !== 'object') {
    errors.push(`variants[${index}] must be an object`);
    return;
  }

  const row = variant as Record<string, unknown>;
  const mrp = Number(row.mrp);
  const b2cPrice = Number(row.b2cPrice);
  const moq = row.moq !== undefined ? Number(row.moq) : 1;
  const stock = row.stock !== undefined ? Number(row.stock) : 0;

  if (!Number.isFinite(mrp) || mrp <= 0) {
    errors.push(`variants[${index}].mrp must be a positive number`);
  }

  if (!Number.isFinite(b2cPrice) || b2cPrice <= 0) {
    errors.push(`variants[${index}].b2cPrice must be a positive number`);
  }

  if (Number.isFinite(mrp) && Number.isFinite(b2cPrice) && b2cPrice > mrp) {
    errors.push(`variants[${index}].b2cPrice must be less than or equal to mrp`);
  }

  if (row.b2bPrice != null && row.b2bPrice !== '') {
    const b2bPrice = Number(row.b2bPrice);
    if (!Number.isFinite(b2bPrice) || b2bPrice <= 0) {
      errors.push(`variants[${index}].b2bPrice must be a positive number`);
    } else if (
      Number.isFinite(b2cPrice) &&
      b2bPrice > b2cPrice
    ) {
      errors.push(
        `variants[${index}].b2bPrice must be less than or equal to b2cPrice`
      );
    }
  }

  if (!Number.isInteger(moq) || moq <= 0) {
    errors.push(`variants[${index}].moq must be a positive integer`);
  }

  if (!Number.isInteger(stock) || stock < 0) {
    errors.push(`variants[${index}].stock must be a non-negative integer`);
  }
}

export function validateProductInput(
  body: Record<string, unknown>,
  isUpdate = false
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isUpdate || body.name !== undefined) {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      errors.push('name is required');
    }
  }

  if (!isUpdate || body.sku !== undefined) {
    const sku = typeof body.sku === 'string' ? body.sku.trim() : '';
    if (!sku) {
      errors.push('sku is required');
    }
  }

  if (body.gstRate !== undefined && body.gstRate !== null) {
    const gstRate = Number(body.gstRate);
    if (!VALID_GST_RATES.includes(gstRate)) {
      errors.push('gstRate must be one of: 0, 5, 12, 18, 28');
    }
  }

  if (body.hsnCode != null && body.hsnCode !== '') {
    const hsnCode = String(body.hsnCode).trim();
    if (!/^\d+$/.test(hsnCode)) {
      errors.push('hsnCode must be a numeric string');
    }
  }

  if (!isUpdate) {
    if (!Array.isArray(body.variants) || body.variants.length === 0) {
      errors.push('At least one variant is required when creating a product');
    }
  }

  if (Array.isArray(body.variants)) {
    body.variants.forEach((variant, index) => {
      validateVariantRow(variant, index, errors);
    });
  }

  return { valid: errors.length === 0, errors };
}

export function validateVariantPrices(
  mrp: number,
  b2cPrice: number,
  b2bPrice?: number | null
): string[] {
  const errors: string[] = [];

  if (!Number.isFinite(mrp) || mrp <= 0) {
    errors.push('mrp must be a positive number');
  }

  if (!Number.isFinite(b2cPrice) || b2cPrice <= 0) {
    errors.push('b2cPrice must be a positive number');
  }

  if (Number.isFinite(mrp) && Number.isFinite(b2cPrice) && b2cPrice > mrp) {
    errors.push('b2cPrice must be less than or equal to mrp');
  }

  if (b2bPrice != null && b2bPrice !== undefined) {
    const b2b = Number(b2bPrice);
    if (!Number.isFinite(b2b) || b2b <= 0) {
      errors.push('b2bPrice must be a positive number');
    } else if (Number.isFinite(b2cPrice) && b2b > b2cPrice) {
      errors.push('b2bPrice must be less than or equal to b2cPrice');
    }
  }

  return errors;
}
