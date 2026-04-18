import type { Request, Response } from 'express';
import { Router } from 'express';
import { LogStatus, RiskLevel } from '@prisma/client';

import { prisma } from '../lib/prisma';

export const apiRouter = Router();

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

apiRouter.get('/health', async (_request: Request, response: Response) => {
  response.json({ ok: true });
});

apiRouter.post('/users/upsert', async (request: Request, response: Response) => {
  const payload = request.body as {
    id: string;
    fullName: string;
    age?: number;
    caregiverName?: string;
    caregiverPhone?: string;
    caregiverEmail?: string;
  };

  const user = await prisma.user.upsert({
    where: { id: payload.id },
    update: {
      fullName: payload.fullName,
      age: payload.age,
      caregiverName: payload.caregiverName,
      caregiverPhone: payload.caregiverPhone,
      caregiverEmail: payload.caregiverEmail,
    },
    create: {
      id: payload.id,
      fullName: payload.fullName,
      age: payload.age,
      caregiverName: payload.caregiverName,
      caregiverPhone: payload.caregiverPhone,
      caregiverEmail: payload.caregiverEmail,
    },
  });

  response.json(user);
});

apiRouter.post('/medications', async (request: Request, response: Response) => {
  const payload = request.body as {
    id: string;
    userId: string;
    name: string;
    dosage: string;
    scheduleTime: string;
  };

  const medication = await prisma.medication.create({
    data: {
      id: payload.id,
      userId: payload.userId,
      name: payload.name,
      dosage: payload.dosage,
      scheduleTime: payload.scheduleTime,
    },
  });

  response.status(201).json(medication);
});

apiRouter.put('/logs/:id', async (request: Request, response: Response) => {
  const payload = request.body as {
    id: string;
    userId: string;
    medicationId: string;
    scheduledAt: string;
    takenAt?: string | null;
    status: keyof typeof LogStatus;
    visionVerified: boolean;
    voiceVerified: boolean;
    delayMinutes: number;
  };

  const log = await prisma.log.upsert({
    where: { id: getSingleParam(request.params.id) ?? payload.id },
    update: {
      userId: payload.userId,
      medicationId: payload.medicationId,
      scheduledAt: new Date(payload.scheduledAt),
      takenAt: payload.takenAt ? new Date(payload.takenAt) : null,
      status: LogStatus[payload.status],
      visionVerified: payload.visionVerified,
      voiceVerified: payload.voiceVerified,
      delayMinutes: payload.delayMinutes,
    },
    create: {
      id: payload.id,
      userId: payload.userId,
      medicationId: payload.medicationId,
      scheduledAt: new Date(payload.scheduledAt),
      takenAt: payload.takenAt ? new Date(payload.takenAt) : null,
      status: LogStatus[payload.status],
      visionVerified: payload.visionVerified,
      voiceVerified: payload.voiceVerified,
      delayMinutes: payload.delayMinutes,
    },
  });

  response.json(log);
});

apiRouter.put('/risk-scores/:userId', async (request: Request, response: Response) => {
  const payload = request.body as {
    userId: string;
    missedDoses: number;
    totalDelayMinutes: number;
    historyFactor: number;
    score: number;
    level: keyof typeof RiskLevel;
  };

  const riskScore = await prisma.riskScore.upsert({
    where: { userId: getSingleParam(request.params.userId) ?? payload.userId },
    update: {
      missedDoses: payload.missedDoses,
      totalDelayMinutes: payload.totalDelayMinutes,
      historyFactor: payload.historyFactor,
      score: payload.score,
      level: RiskLevel[payload.level],
    },
    create: {
      userId: payload.userId,
      missedDoses: payload.missedDoses,
      totalDelayMinutes: payload.totalDelayMinutes,
      historyFactor: payload.historyFactor,
      score: payload.score,
      level: RiskLevel[payload.level],
    },
  });

  response.json(riskScore);
});

apiRouter.post('/caregiver-alerts', async (request: Request, response: Response) => {
  const payload = request.body as {
    patientName: string;
    caregiverName: string;
    caregiverPhone?: string;
    caregiverEmail?: string;
    riskLevel: 'low' | 'medium' | 'high';
    logStatus: 'pending' | 'taken' | 'missed';
    reason: string;
  };

  const webhookUrl = process.env.CAREGIVER_ALERT_WEBHOOK_URL;

  if (!webhookUrl) {
    response.json({
      ok: false,
      message: 'Set CAREGIVER_ALERT_WEBHOOK_URL to forward SMS, email, or push alerts.',
      payload,
    });
    return;
  }

  const webhookResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  response.json({
    ok: webhookResponse.ok,
    forwardedStatus: webhookResponse.status,
  });
});
