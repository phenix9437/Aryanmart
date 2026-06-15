import { NextResponse } from 'next/server';
import logger from './logger';

const prismaErrors: Record<string, { status: number; message: string }> = {
  P2002: { status: 409, message: 'A record with this value already exists.' },
  P2025: { status: 404, message: 'The requested record was not found.' },
  P2003: { status: 400, message: 'Related record not found.' },
  P2014: { status: 400, message: 'Invalid relationship data provided.' },
};

type ApiError = Error & {
  code?: string;
  statusCode?: number;
  status?: number;
};

export function handleApiError(
  error: unknown,
  context?: { path?: string; method?: string }
) {
  const err = error as ApiError;

  logger.error(err.message, {
    stack: err.stack,
    path: context?.path,
    method: context?.method,
  });

  if (err.message === 'UNAUTHORIZED') {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (err.message === 'FORBIDDEN') {
    return NextResponse.json(
      { success: false, message: 'Forbidden' },
      { status: 403 }
    );
  }

  if (err.code && prismaErrors[err.code]) {
    const { status, message } = prismaErrors[err.code];
    return NextResponse.json({ success: false, message }, { status });
  }

  if (err.name === 'JsonWebTokenError') {
    return NextResponse.json(
      { success: false, message: 'Invalid token.' },
      { status: 401 }
    );
  }
  if (err.name === 'TokenExpiredError') {
    return NextResponse.json(
      { success: false, message: 'Token has expired.' },
      { status: 401 }
    );
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return NextResponse.json(
    {
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    { status: statusCode }
  );
}
