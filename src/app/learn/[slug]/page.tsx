import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import { requireSession } from '../../../lib/session';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

export default async function LearningOverviewPage({ params }: { params: { slug: string } }) {
  const session = await requireSession();
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
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
  });

  if (!course) {
    notFound();
  }

  const enrollment = course.enrollments[0];
  if (!enrollment) {
    notFound();
  }

  type ModuleWithLessons = (typeof course.modules)[number];
  type LessonWithProgress = ModuleWithLessons['lessons'][number];
  type LessonProgress = (typeof enrollment.lessonProgress)[number];

  const lessonProgress = new Set(
    enrollment.lessonProgress
      .filter((progress: LessonProgress) => progress.watched)
      .map((progress: LessonProgress) => progress.lessonId),
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-500">My course</p>
        <h1 className="text-3xl font-semibold text-slate-900">{course.title}</h1>
        <p className="text-sm text-slate-600">Your dashboard keeps track of completed lessons and downloads.</p>
      </div>
      <div className="space-y-6">
  {course.modules.map((module: ModuleWithLessons) => (
          <Card key={module.id} className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-sky-500">Module {module.order}</span>
                <h2 className="text-xl font-semibold text-slate-900">{module.title}</h2>
              </div>
              <span className="text-xs text-slate-500">{module.lessons.length} lessons</span>
            </div>
            <p className="text-sm text-slate-600">{module.description}</p>
            <ul className="space-y-3">
              {module.lessons.map((lesson: LessonWithProgress) => (
                <li key={lesson.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">L{lesson.order}. {lesson.title}</p>
                    <p className="text-xs text-slate-500">{lesson.durationInMin ?? 15} min • {lesson.isPreviewable ? 'Preview available' : 'Locked until purchase'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {lessonProgress.has(lesson.id) && <span className="text-xs font-semibold text-emerald-600">Completed</span>}
                    <Button asChild variant={lesson.isPreviewable ? 'outline' : 'primary'}>
                      <Link href={`/learn/${course.slug}/lessons/${lesson.id}`}>Start lesson</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
