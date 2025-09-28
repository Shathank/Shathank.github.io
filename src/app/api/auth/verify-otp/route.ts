import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyOtpAndCreateSession } from '../../../../lib/auth';

const verifySchema = z.object({
  email: z.string().email('Enter a valid email address'),
  code: z.string().min(4, 'Enter the OTP you received'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = verifySchema.parse(body);
    const userAgent = request.headers.get('user-agent') ?? undefined;
    const forwardedFor = request.headers.get('x-forwarded-for') ?? undefined;

    const user = await verifyOtpAndCreateSession({ email, code, userAgent, ipAddress: forwardedFor });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('[api:verify-otp]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unable to verify code.' }, { status: 400 });
  }
}
