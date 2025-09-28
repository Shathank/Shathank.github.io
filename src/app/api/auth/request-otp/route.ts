import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requestLoginOtp } from '../../../../lib/auth';

const requestSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);
    const userAgent = request.headers.get('user-agent') ?? undefined;
    const forwardedFor = request.headers.get('x-forwarded-for') ?? undefined;

    const otp = await requestLoginOtp({ email, userAgent, ipAddress: forwardedFor });

    return NextResponse.json({ success: true, otp });
  } catch (error) {
    console.error('[api:request-otp]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unable to send OTP. Please try again.' }, { status: 500 });
  }
}
