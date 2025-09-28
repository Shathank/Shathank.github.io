import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from './prisma';
import { formatCurrency } from './utils';

const getRazorpayInstance = () => {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured');
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

export const createCheckoutOrder = async ({
  userId,
  courseId,
  amount,
  currency,
  receipt,
  paymentType,
}: {
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  receipt: string;
  paymentType: 'ONE_TIME' | 'SUBSCRIPTION';
}) => {
  const razorpay = getRazorpayInstance();
  const order = await razorpay.orders.create({
    amount,
    currency,
    receipt,
    notes: { userId, courseId, paymentType },
  });

  await prisma.payment.create({
    data: {
      amount,
      currency,
      paymentType,
      status: 'PENDING',
      razorpayOrderId: order.id,
      user: { connect: { id: userId } },
      course: { connect: { id: courseId } },
    },
  });

  return order;
};

export const verifyRazorpaySignature = ({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error('Razorpay secret is not configured');
  }
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expectedSignature === signature;
};

export const markPaymentStatus = async ({
  orderId,
  paymentId,
  signature,
  status,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  status: 'SUCCESS' | 'FAILED';
}) => {
  const paymentRecord = await prisma.payment.findFirst({ where: { razorpayOrderId: orderId } });
  if (!paymentRecord) {
    throw new Error('Payment record not found');
  }

  const isValid = verifyRazorpaySignature({ orderId, paymentId, signature });
  if (!isValid) {
    throw new Error('Payment signature mismatch');
  }

  const updated = await prisma.payment.update({
    where: { id: paymentRecord.id },
    data: {
      status,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    },
    include: { user: true },
  });

  if (status === 'SUCCESS') {
    const { userId } = updated;
    const courseId = paymentRecord.courseId;

    if (courseId) {
      const enrollment = await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: { status: 'ACTIVE' },
        create: { userId, courseId, status: 'ACTIVE' },
      });

      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: { enrollmentId: enrollment.id },
      });
    }
  }

  return updated;
};

export const describePrice = (amount: number, currency = 'INR') =>
  `${formatCurrency(amount, currency)} (incl. taxes)`;
