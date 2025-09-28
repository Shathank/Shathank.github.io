import PDFDocument from 'pdfkit';
import { prisma } from './prisma';

const brandColor = '#0f172a';

export const createCertificateBuffer = async ({
  learnerName,
  courseTitle,
  certificateNumber,
  issuedOn,
}: {
  learnerName: string;
  courseTitle: string;
  certificateNumber: string;
  issuedOn: string;
}) => {
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });

  const buffers: Buffer[] = [];
  doc.on('data', (chunk) => buffers.push(chunk));

  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8fafc');
  doc.fillColor(brandColor).fontSize(28).font('Helvetica-Bold').text('Certificate of Completion', {
    align: 'center',
  });

  doc.moveDown(1);
  doc.fillColor('#1e293b').fontSize(18).text('Awarded to', { align: 'center' });
  doc.moveDown(0.5);
  doc.fillColor(brandColor).fontSize(36).font('Helvetica-Bold').text(learnerName, {
    align: 'center',
  });

  doc.moveDown(1);
  doc.fillColor('#334155').fontSize(16).font('Helvetica').text(`For successfully completing ${courseTitle}`, {
    align: 'center',
  });

  doc.moveDown(1.5);
  doc.fontSize(12).fillColor('#475569').text(`Certificate ID: ${certificateNumber}`, {
    align: 'center',
  });
  doc.moveDown(0.25);
  doc.text(`Issued on ${issuedOn}`, { align: 'center' });

  doc.end();

  await new Promise((resolve) => doc.on('end', resolve));
  return Buffer.concat(buffers);
};

export const issueCertificateIfEligible = async ({
  enrollmentId,
}: {
  enrollmentId: string;
}) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { user: true, course: true },
  });

  if (!enrollment || enrollment.progress < 100) {
    throw new Error('Learner has not completed the course yet.');
  }

  const existing = await prisma.certificate.findUnique({ where: { enrollmentId } });
  if (existing) {
    return existing;
  }

  const certificateNumber = `TC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1_000_000)}`;

  const certificate = await prisma.certificate.create({
    data: {
      enrollmentId,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      certificateNumber,
    },
  });

  return certificate;
};
