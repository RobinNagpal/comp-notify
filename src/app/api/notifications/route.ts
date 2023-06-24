import { prisma } from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface JwtTokenPayload {
  spaceId: string;
  userId: string;
  username: string;
  accountId: string;
}

async function GET(req: NextRequest, res: NextResponse) {
  const token = req.headers.get('dodao-auth-token');
  if (!token) return NextResponse.json({}, { status: 401 });

  const decoded = jwt.verify(token, process.env.DODAO_AUTH_SECRET!) as JwtTokenPayload;

  const notification = await prisma.notifications.findUnique({
    where: { userId: decoded.username },
  });
  return NextResponse.json(notification);
}
async function POST(req: NextRequest, res: NextResponse) {
  const { userId, selectedNotifications, addresses } = await req.json();

  const updatedNotification = await prisma.notifications.upsert({
    update: {
      selectedNotifications,
      addresses,
    },
    create: {
      selectedNotifications,
      addresses,
      userId,
    },
    where: { userId },
  });
  return NextResponse.json(updatedNotification);
}

export { GET, POST };
