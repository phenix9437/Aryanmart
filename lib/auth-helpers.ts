import { verifyToken } from './auth';

export async function getAuthUser(
  request: Request
): Promise<{ userId: string; role: string } | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  return verifyToken(token);
}

export async function requireAuth(
  request: Request
): Promise<{ userId: string; role: string }> {
  const payload = await getAuthUser(request);
  if (!payload) {
    throw new Error('UNAUTHORIZED');
  }
  return payload;
}

export async function requireRole(
  request: Request,
  allowedRoles: string[]
): Promise<{ userId: string; role: string }> {
  const payload = await requireAuth(request);
  if (!allowedRoles.includes(payload.role)) {
    throw new Error('FORBIDDEN');
  }
  return payload;
}
