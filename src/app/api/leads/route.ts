import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';

const leadSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, source } = leadSchema.parse(body);

    const lead = await prisma.lead.upsert({
      where: { email_source: { email: email.toLowerCase(), source: source ?? 'NEWSLETTER' } },
      update: { name, phone },
      create: { email: email.toLowerCase(), name, phone, source },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('[api:leads]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Cannot capture lead at the moment.' }, { status: 400 });
  }
}
