import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { prisma } from './prisma';

const getMailTransport = () => {
  const { EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD } = process.env;
  if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT) {
    return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port: Number(EMAIL_SERVER_PORT),
    auth:
      EMAIL_SERVER_USER && EMAIL_SERVER_PASSWORD
        ? {
            user: EMAIL_SERVER_USER,
            pass: EMAIL_SERVER_PASSWORD,
          }
        : undefined,
  });
};

const getSmsClient = () => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return null;
  }
  return twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
};

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  const from = process.env.EMAIL_FROM || 'Trading Mentor <no-reply@tradingmentor.in>';
  const transport = getMailTransport();

  try {
    if (transport) {
      await transport.sendMail({ from, to, subject, html, text });
    } else {
      console.info('[email:mock]', { to, subject, html });
    }
    const user = await prisma.user.findUnique({ where: { email: to } });
    await prisma.notificationLog.create({
      data: {
        userId: user?.id,
        channel: 'EMAIL',
        type: subject,
        payload: { html },
      },
    }).catch(() => undefined);
  } catch (error) {
    console.error('[email:error]', error);
    const user = await prisma.user.findUnique({ where: { email: to } }).catch(() => null);
    await prisma.notificationLog.create({
      data: {
        userId: user?.id,
        channel: 'EMAIL',
        type: subject,
        payload: { html },
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
    }).catch(() => undefined);
    throw error;
  }
};

export const sendSms = async ({
  to,
  body,
}: {
  to: string;
  body: string;
}) => {
  const client = getSmsClient();
  const from = process.env.TWILIO_FROM_NUMBER;

  try {
    if (client && from) {
      await client.messages.create({ to, from, body });
    } else {
      console.info('[sms:mock]', { to, body });
    }
    const user = await prisma.user.findUnique({ where: { phone: to } }).catch(() => null);
    await prisma.notificationLog.create({
      data: {
        userId: user?.id,
        channel: 'SMS',
        type: 'SMS_NOTIFICATION',
        payload: { to, body },
      },
    }).catch(() => undefined);
  } catch (error) {
    console.error('[sms:error]', error);
    const user = await prisma.user.findUnique({ where: { phone: to } }).catch(() => null);
    await prisma.notificationLog.create({
      data: {
        userId: user?.id,
        channel: 'SMS',
        type: 'SMS_NOTIFICATION',
        payload: { to, body },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }).catch(() => undefined);
    throw error;
  }
};
