import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createCheckoutOrder } from '../../../../lib/payments';
import { prisma } from '../../../../lib/prisma';
import { requireSession } from '../../../../lib/session';

const schema = z.object({
  courseId: z.string(),
  paymentType: z.enum(['ONE_TIME', 'SUBSCRIPTION']).default('ONE_TIME'),
});

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const { courseId, paymentType } = schema.parse(body);

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || !course.isPublished) {
      return NextResponse.json({ success: false, error: 'Course not available.' }, { status: 404 });
    }

    const amount = course.salePrice ?? course.price;
    const order = await createCheckoutOrder({
      userId: session.userId,
      courseId,
      amount,
      currency: course.currency,
      receipt: `${course.slug}-${Date.now()}`,
      paymentType,
    });

    return NextResponse.json({
      success: true,
      order,
      razorpayKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency: course.currency,
      course,
    });
  } catch (error) {
    console.error('[api:create-order]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unable to create order.' }, { status: 400 });
  }
}
