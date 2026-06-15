const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GSTIN_REGEX = /^[0-9A-Z]{15}$/;

const ALLOWED_SIGNUP_ROLES = ['B2C', 'B2B', 'GOVT'] as const;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  return { valid: true };
}

export function validateSignupInput(body: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!email) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Email format is invalid');
  }

  const password = typeof body.password === 'string' ? body.password : '';
  if (!password) {
    errors.push('Password is required');
  } else {
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      errors.push(passwordCheck.message!);
    }
  }

  const role = typeof body.role === 'string' ? body.role : '';
  if (!role) {
    errors.push('Role is required');
  } else if (!ALLOWED_SIGNUP_ROLES.includes(role as (typeof ALLOWED_SIGNUP_ROLES)[number])) {
    errors.push('Role must be one of: B2C, B2B, GOVT');
  }

  if (role === 'B2B' || role === 'GOVT') {
    const companyName =
      typeof body.companyName === 'string' ? body.companyName.trim() : '';
    if (!companyName) {
      errors.push('Company name is required for B2B and GOVT accounts');
    }
  }

  if (role === 'B2B') {
    const gstin = typeof body.gstin === 'string' ? body.gstin.trim().toUpperCase() : '';
    if (!gstin) {
      errors.push('GSTIN is required for B2B accounts');
    } else if (!GSTIN_REGEX.test(gstin)) {
      errors.push('GSTIN must be 15 alphanumeric characters');
    }
  }

  return { valid: errors.length === 0, errors };
}
