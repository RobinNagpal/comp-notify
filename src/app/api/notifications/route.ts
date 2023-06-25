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
  const { selectedNotifications, addresses, emails } = await req.json();
  const token = req.headers.get('dodao-auth-token');
  if (!token) return NextResponse.json({}, { status: 401 });

  const decoded = jwt.verify(token, process.env.DODAO_AUTH_SECRET!) as JwtTokenPayload;

  const updatedNotification = await prisma.notifications.upsert({
    update: {
      selectedNotifications,
      addresses,
      emails,
    },
    create: {
      selectedNotifications,
      addresses,
      emails,
      userId: decoded.username,
    },
    where: { userId: decoded.username },
  });
  return NextResponse.json(updatedNotification);
}

export { GET, POST };
