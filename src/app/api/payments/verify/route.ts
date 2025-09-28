import { NextResponse } from 'next/server';
import { z } from 'zod';
import { markPaymentStatus } from '../../../../lib/payments';
import { requireSession } from '../../../../lib/session';

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(request: Request) {
  try {
    await requireSession();
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = schema.parse(body);

    const updated = await markPaymentStatus({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: 'SUCCESS',
    });

    return NextResponse.json({ success: true, payment: updated });
  } catch (error) {
    console.error('[api:verify-payment]', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Verification failed.' }, { status: 400 });
  }
}
