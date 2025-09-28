import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '../../../../../lib/prisma';
import { requireSession } from '../../../../../lib/session';
import { Card } from '../../../../../components/ui/card';
import { VideoPlayer } from '../../../../../components/video-player';
import { LessonActions } from '../../../../../components/lesson-actions';

export default async function LessonPage({ params }: { params: { slug: string; lessonId: string } }) {
  const session = await requireSession();
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      module: {
        include: {
          course: {
            include: {
              modules: {
                include: { lessons: { orderBy: { order: 'asc' } } },
                orderBy: { order: 'asc' },
              },
              enrollments: {
                where: { userId: session.userId },
                include: { lessonProgress: true },
              },
            },
          },
        },
      },
    },
  });

  if (!lesson || lesson.module.course.slug !== params.slug) {
    notFound();
  }

  const enrollment = lesson.module.course.enrollments[0];
  const hasAccess = enrollment || lesson.isPreviewable;
  if (!hasAccess) {
    notFound();
  }

  type LessonProgressEntry = {
    lessonId: string;
    watched: boolean;
  };

  const lessonProgressList: LessonProgressEntry[] = enrollment?.lessonProgress ?? [];
  const lessonProgress = lessonProgressList.find((progress) => progress.lessonId === lesson.id)?.watched ?? false;

  type ModuleWithLessons = (typeof lesson.module.course.modules)[number];
  type LessonWithOrder = ModuleWithLessons['lessons'][number];

  const modules = lesson.module.course.modules as ModuleWithLessons[];
  const flatLessons = modules.flatMap((module: ModuleWithLessons) =>
    module.lessons.map((lessonItem: LessonWithOrder) => ({ ...lessonItem, moduleOrder: module.order })),
  );
  const currentIndex = flatLessons.findIndex((item: typeof flatLessons[number]) => item.id === lesson.id);
  const nextLesson = currentIndex >= 0 ? flatLessons[currentIndex + 1] : undefined;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-10">
      <div className="space-y-2">
        <Link href={`/learn/${lesson.module.course.slug}`} className="text-xs uppercase tracking-[0.3em] text-sky-500">
          Back to curriculum
        </Link>
        <h1 className="text-3xl font-semibold text-slate-900">{lesson.title}</h1>
        <p className="text-sm text-slate-600">Module {lesson.module.order} · {lesson.durationInMin ?? 15} minutes</p>
      </div>

      <VideoPlayer lessonId={lesson.id} title={lesson.title} />

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Lesson notes</h2>
        <p className="text-sm text-slate-600">{lesson.summary ?? 'Refer to the video for detailed walkthrough and download resources from the dashboard.'}</p>
        {lesson.resourceUrl && (
          <Link href={lesson.resourceUrl} className="text-sm font-semibold text-sky-600">
            Download worksheet →
          </Link>
        )}
      </Card>

      <LessonActions
        lessonId={lesson.id}
        initialCompleted={lessonProgress}
        nextLessonHref={nextLesson ? `/learn/${lesson.module.course.slug}/lessons/${nextLesson.id}` : undefined}
      />
    </div>
  );
}
