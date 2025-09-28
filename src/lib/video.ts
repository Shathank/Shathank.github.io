import { prisma } from './prisma';
import { getDeviceHash } from './utils';

export type VideoOtpPayload = {
  videoId: string;
  playbackInfo: string;
  otp: string;
};

export const getVdocipherOtp = async ({
  lessonId,
  videoId,
  userId,
  userEmail,
  userAgent,
  ipAddress,
  watermark,
}: {
  lessonId: string;
  videoId: string;
  userId: string;
  userEmail: string;
  userAgent?: string;
  ipAddress?: string;
  watermark?: string;
}): Promise<VideoOtpPayload> => {
  const { VIDOCIPHER_API_KEY, VIDOCIPHER_API_SECRET, VIDOCIPHER_PLAYBACK_POLICY_ID } = process.env;
  if (!VIDOCIPHER_API_KEY || !VIDOCIPHER_API_SECRET) {
    console.info('[vdocipher:mock]', { videoId, userId });
    return {
      videoId,
      playbackInfo: JSON.stringify({ status: 'mock', message: 'Configure VdoCipher credentials' }),
      otp: 'mock-otp',
    };
  }

  const deviceHash = getDeviceHash(userAgent, ipAddress);

  const response = await fetch(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Apisecret ${VIDOCIPHER_API_SECRET}`,
    },
    body: JSON.stringify({
      allow_multiple_playback_sessions: false,
      ttl: 300,
      playback_policy_id: VIDOCIPHER_PLAYBACK_POLICY_ID,
      annotate: [
        {
          type: 'rtext',
          text: watermark ?? userEmail,
          opacity: 0.08,
          fontsize: 24,
          color: '0xffffff',
          text_align: 'center',
          y_margin: 10,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch VdoCipher OTP: ${await response.text()}`);
  }

  const payload = (await response.json()) as VideoOtpPayload;

  await prisma.videoAccessLog.create({
    data: {
      userId,
  lessonId,
      deviceHash,
      ipAddress,
      otpId: payload.otp,
    },
  }).catch(() => undefined);

  return payload;
};
