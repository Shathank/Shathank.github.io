import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireSession } from '../../../../lib/session';
import { prisma } from '../../../../lib/prisma';
import { getVdocipherOtp } from '../../../../lib/video';

const schema = z.object({
  lessonId: z.string(),
});

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const { lessonId } = schema.parse(body);

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: { include: { course: { enrollments: { where: { userId: session.userId } } } } },
      },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Lesson not found' }, { status: 404 });
    }

    const isEnrolled = lesson.module.course.enrollments.some(
      (enrollment: { userId: string }) => enrollment.userId === session.userId,
    );
    if (!isEnrolled && !lesson.isPreviewable) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const payload = await getVdocipherOtp({
      lessonId: lesson.id,
      videoId: lesson.videoId,
      userId: session.userId,
      userEmail: (await prisma.user.findUnique({ where: { id: session.userId } }))?.email ?? 'student@tradingcoach.in',
      userAgent: request.headers.get('user-agent') ?? undefined,
      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
      watermark: lesson.watermarkText,
    });

    return NextResponse.json({ success: true, ...payload });
  } catch (error) {
    console.error('[api:video-otp]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unable to load video' }, { status: 400 });
  }
}
