import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
const SESSION_COOKIE_NAME = 'tc_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type UserRole = 'STUDENT' | 'ADMIN' | 'AFFILIATE';

export type SessionPayload = {
  userId: string;
  role: UserRole;
  deviceHash: string;
};

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return secret;
};

export const createSession = async (payload: SessionPayload) => {
  const token = jwt.sign(payload, getSecret(), {
    expiresIn: SESSION_TTL_SECONDS,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  });
};

export const getSession = async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, getSecret()) as SessionPayload;
  } catch {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }
};

export const requireSession = async () => {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
};

export const destroySession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
};

export const assertAdmin = async () => {
  const session = await requireSession();
  if (session.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  return session;
};
