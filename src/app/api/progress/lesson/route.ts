import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prisma';
import { requireSession } from '../../../../lib/session';

const schema = z.object({
  lessonId: z.string(),
  watched: z.boolean().default(true),
});

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const { lessonId, watched } = schema.parse(body);

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                enrollments: {
                  where: { userId: session.userId },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Lesson not found' }, { status: 404 });
    }

    const enrollment = lesson.module.course.enrollments[0];
    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Not enrolled' }, { status: 403 });
    }

    const progress = await prisma.lessonProgress.upsert({
      where: { lessonId_enrollmentId: { lessonId, enrollmentId: enrollment.id } },
      update: { watched, watchedAt: watched ? new Date() : null, progress: watched ? 100 : 0 },
      create: {
        lessonId,
        enrollmentId: enrollment.id,
        watched,
        watchedAt: watched ? new Date() : null,
        progress: watched ? 100 : 0,
      },
    });

    const totalLessons = await prisma.lesson.count({
      where: { module: { courseId: lesson.module.courseId } },
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: { enrollmentId: enrollment.id, watched: true },
    });

    const newProgress = totalLessons ? (completedLessons / totalLessons) * 100 : 0;

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: newProgress,
        completedAt: newProgress >= 100 ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('[api:lesson-progress]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Could not update progress' }, { status: 400 });
  }
}
