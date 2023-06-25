'use client';

import { Badges } from '@/components/core/badge/UpsertBadgeInput';
import Button from '@/components/core/buttons/Button';
import Input from '@/components/core/input/Input';
import RowLoading from '@/components/core/loaders/RowLoading';
import PageWrapper from '@/components/core/page/PageWrapper';
import { Table, TableRow } from '@/components/core/table/Table';
import { CompNotification } from '@/components/notifications/CompNotification';
import { useLoginModalContext } from '@/contexts/LoginModalContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { CompoundNotification } from '@/types/CompoundNotification';
import { getAuthToken } from '@/utils/getAuthToken';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function TextNotify() {
  const [blockNumber, setBlockNumber] = React.useState<string>('17550550');
  const [parsedLogs, setParsedLogs] = React.useState<CompoundNotification<any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = React.useState<Badges[]>([]);

  const { data: session } = useSession();
  const { showNotification } = useNotificationContext();

  async function fetchNotifications() {
    const dodaoAccessToken = getAuthToken(session, showNotification);
    const response = await fetch('/api/notifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'dodao-auth-token': dodaoAccessToken!,
      },
    });
    if (response.status !== 200) {
      showNotification({ message: 'Error saving notifications', type: 'error' });
    } else {
      const data = await response.json();
      if (data) {
        setEmails(data.emails.map((e: string) => ({ id: e, label: e })));
      }
    }
  }

  useEffect(() => {
    let username = session?.username;
    if (!username) return;

    fetchNotifications();
  }, [session]);

  async function getLogs() {
    setLoading(true);
    const dodaoAccessToken = getAuthToken(session, showNotification);
    const response = await fetch(`/api/test-notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'dodao-auth-token': dodaoAccessToken!,
      },
      body: JSON.stringify({ blockNumber }),
    });

    setLoading(false);

    const json = await response.json();
    setParsedLogs(json);
  }

  const rows: TableRow[] = parsedLogs.map((l) => ({ item: l, columns: [l.event, <CompNotification notification={l} />], id: JSON.stringify(l.payload) }));

  const { setShowLoginModal } = useLoginModalContext();
  return (
    <PageWrapper>
      {session ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-4xl font-bold">Test Notifications</h1>
          <h1 className="text-xl font-bold">Emails : {emails.map((e) => e.id).join(', ')}</h1>
          <div className="flex w-full items-end mt-2 mb-2">
            <Input label={'Block Number'} onUpdate={(v) => setBlockNumber(v?.toString() || '')} modelValue={blockNumber} className="grow" />
            <Button onClick={() => getLogs()} className="ml-2 grow-0" variant="contained" primary loading={loading}>
              Test
            </Button>
          </div>
          <div className="flex flex-col w-full mt-16">
            {!loading ? <Table heading={'Events'} data={rows} columnsHeadings={['Event', 'Payload']} columnsWidthPercents={[30, 70]} /> : <RowLoading />}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <Button onClick={() => setShowLoginModal(true)}>Login</Button>
        </div>
      )}
    </PageWrapper>
  );
}
