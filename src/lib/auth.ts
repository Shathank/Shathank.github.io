import bcrypt from 'bcryptjs';
import { addMinutes, isAfter } from 'date-fns';
import { prisma } from './prisma';
import { generateOtp, getDeviceHash } from './utils';
import { sendEmail, sendSms } from './notifications';
import { createSession, destroySession, type UserRole } from './session';

const OTP_EXPIRY_MINUTES = 10;
const MAX_DEVICE_SESSIONS = 2;

export const requestLoginOtp = async ({
  email,
  userAgent,
  ipAddress,
}: {
  email: string;
  userAgent?: string;
  ipAddress?: string;
}) => {
  const normalizedEmail = email.toLowerCase().trim();
  const otp = generateOtp();
  const codeHash = await bcrypt.hash(otp, 10);
  const expiresAt = addMinutes(new Date(), OTP_EXPIRY_MINUTES);

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {},
    create: {
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
    },
  });

  await prisma.otpToken.deleteMany({ where: { email: normalizedEmail, context: 'LOGIN' } });
  await prisma.otpToken.create({
    data: {
      email: normalizedEmail,
      codeHash,
      expiresAt,
      userId: user.id,
      context: 'LOGIN',
    },
  });

  const subject = 'Your Trading Course login code';
  const html = `
    <p>Namaste,</p>
    <p>Your one-time password to access the Trading Course Platform is <strong>${otp}</strong>.</p>
    <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes. Do not share it with anyone.</p>
    <p>Login request from IP: ${ipAddress ?? 'Unknown'}, device: ${userAgent ?? 'Unknown'}.</p>
  `;

  await sendEmail({ to: normalizedEmail, subject, html }).catch((error) => {
    console.error('Failed to send OTP email', error);
  });

  if (user.phone) {
    await sendSms({
      to: user.phone,
      body: `Your Trading Course OTP is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    }).catch((error) => console.error('Failed to send OTP SMS', error));
  }

  return process.env.NODE_ENV === 'development' ? otp : undefined;
};

export const verifyOtpAndCreateSession = async ({
  email,
  code,
  userAgent,
  ipAddress,
}: {
  email: string;
  code: string;
  userAgent?: string;
  ipAddress?: string;
}) => {
  const normalizedEmail = email.toLowerCase().trim();
  const token = await prisma.otpToken.findFirst({
    where: { email: normalizedEmail, context: 'LOGIN' },
    orderBy: { createdAt: 'desc' },
  });

  if (!token) {
    throw new Error('Invalid or expired code.');
  }

  if (isAfter(new Date(), token.expiresAt)) {
    throw new Error('This code has expired. Please request a new one.');
  }

  const isValid = await bcrypt.compare(code, token.codeHash);
  if (!isValid) {
    await prisma.otpToken.update({
      where: { id: token.id },
      data: { attempts: { increment: 1 } },
    });
    throw new Error('Invalid code.');
  }

  const user = await prisma.user.update({
    where: { email: normalizedEmail },
    data: { isEmailVerified: true, lastLoginAt: new Date() },
  });

  const deviceHash = getDeviceHash(userAgent, ipAddress);
  const existingSessions = await prisma.deviceSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  });

  const matchingSession = existingSessions.find(
    (session: (typeof existingSessions)[number]) => session.deviceHash === deviceHash,
  );
  if (matchingSession) {
    await prisma.deviceSession.update({
      where: { id: matchingSession.id },
      data: { userAgent, ipAddress },
    });
  } else {
    if (existingSessions.length >= MAX_DEVICE_SESSIONS) {
      const sessionsToRemove = existingSessions.slice(
        0,
        existingSessions.length - MAX_DEVICE_SESSIONS + 1,
      );
      await prisma.deviceSession.deleteMany({
        where: {
          id: {
            in: sessionsToRemove.map((session: (typeof existingSessions)[number]) => session.id),
          },
        },
      });
    }
    await prisma.deviceSession.create({
      data: {
        userId: user.id,
        deviceHash,
        userAgent,
        ipAddress,
      },
    });
  }

  await prisma.otpToken.deleteMany({ where: { email: normalizedEmail, context: 'LOGIN' } });

  await createSession({ userId: user.id, role: user.role as UserRole, deviceHash });

  return user;
};

export const logoutUser = async (userId: string, deviceHash?: string) => {
  if (deviceHash) {
    await prisma.deviceSession.deleteMany({ where: { userId, deviceHash } });
  }
  await destroySession();
};

export const ensureAdminSeedUser = async () => {
  const email = process.env.ADMIN_SEED_EMAIL?.toLowerCase();
  if (!email) return;

  const existingAdmin = await prisma.user.findFirst({ where: { email } });
  if (existingAdmin) {
    if (existingAdmin.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: { role: 'ADMIN' },
      });
    }
    return;
  }

  await prisma.user.create({
    data: {
      email,
      name: process.env.ADMIN_SEED_NAME ?? 'Lead Mentor',
      phone: process.env.ADMIN_SEED_PHONE ?? undefined,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });
};
