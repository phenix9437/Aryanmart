export function validateTenderInput(body: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const issuingAuthority =
    typeof body.issuingAuthority === 'string'
      ? body.issuingAuthority.trim()
      : '';

  if (!issuingAuthority) {
    errors.push('issuingAuthority is required');
  }

  if (body.deadline != null && body.deadline !== '') {
    const date = new Date(body.deadline as string);
    if (Number.isNaN(date.getTime())) {
      errors.push('deadline must be a valid date');
    } else if (date <= new Date()) {
      errors.push('deadline must be in the future');
    }
  }

  return { valid: errors.length === 0, errors };
}
