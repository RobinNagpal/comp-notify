import { sendNotificationEmail } from '@/app/api/email/sendEmail';
import { Log, parseLog, SolidityEvent } from '@/app/api/test-notifications/logParser';
import { prisma } from '@/prisma';
import { CompoundNotification } from '@/types/CompoundNotification';
import { EventsEnum } from '@/types/events/EventsEnum';
import { NextRequest, NextResponse } from 'next/server';
import abi from './abi.json';

const toObject = (obj: Object) => {
  return JSON.parse(
    JSON.stringify(
      obj,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
  );
};

async function getBlockReceipts(blockNumberHex: string) {
  const block = await prisma.blockReceipts.findUnique({ where: { blockNumber: blockNumberHex } });
  if (block) {
    return block.receipts;
  } else {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'eth_getBlockReceipts',
        params: ['0x' + blockNumberHex],
        id: 1,
        jsonrpc: '2.0',
      }),
    };

    const result: any = await fetch(process.env.QUICK_NODE_URL!, requestOptions).then((response) => response.json());

    // console.log(JSON.stringify(result, null, 2));
    const receipts = result.result;
    await prisma.blockReceipts.create({ data: { blockNumber: blockNumberHex, receipts } });
    return receipts;
  }
}

async function POST(req: NextRequest, res: NextResponse) {
  const { blockNumber } = await req.json();
  const blockNumberHex = parseInt(blockNumber).toString(16);
  const receipts = await getBlockReceipts(blockNumberHex);

  const logs: Log[] = receipts.flatMap((e: any) => e.logs.flatMap((l: any) => l));
  const events = abi.filter((e: any) => e?.type === 'event') as SolidityEvent[];
  console.log('events', events.map((e) => e.name).join('\n'));
  const parsedLogs: CompoundNotification<any>[] = [];
  for (const log of logs) {
    try {
      // console.log(' log', log);
      const parsedLog = parseLog(log, events);
      if (Object.keys(EventsEnum).includes(parsedLog.event)) {
        console.log('parsed log', parsedLog);
        parsedLogs.push({ event: parsedLog.event, payload: { ...toObject(parsedLog.returnValues) }, transactionHash: parsedLog.transactionHash });
      }
    } catch (e) {
      // console.log('error', e);
    }
  }

  await sendNotificationEmail(parsedLogs);

  return NextResponse.json(parsedLogs);
}

export { POST };
