'use client';

import UpsertBadgeInput, { Badges } from '@/components/core/badge/UpsertBadgeInput';
import Button from '@/components/core/buttons/Button';
import CheckboxesWithInfo from '@/components/core/checkboxes/CheckboxesWithInfo';
import { Grid2Cols } from '@/components/core/grids/Grid2Cols';
import PageWrapper from '@/components/core/page/PageWrapper';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { EventsEnum } from '@/types/events/EventsEnum';
import { getAuthToken } from '@/utils/getAuthToken';
import { union, unionBy } from 'lodash';
import { useSession } from 'next-auth/react';

import React, { useEffect } from 'react';

function Home() {
  const { data: session } = useSession();
  const notifications = Object.keys(EventsEnum);
  const checkboxItems = notifications.map((notification) => ({
    id: notification,
    name: notification,
    label: notification,
    description: 'Get notified when someones does something YoYo.',
  }));
  const { showNotification } = useNotificationContext();
  const [addresses, setAddresses] = React.useState<Badges[]>([]);
  const [emails, setEmails] = React.useState<Badges[]>([]);
  const [selectedNotifications, setSelectedNotifications] = React.useState<string[]>([]);

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
        setSelectedNotifications(data.selectedNotifications);
        setAddresses(data.addresses.map((b: string) => ({ id: b, label: b })));
      }
    }
  }

  useEffect(() => {
    let username = session?.username;
    if (!username) return;

    fetchNotifications();

    setAddresses(unionBy(addresses, [{ id: username.toLowerCase(), label: username.toLowerCase() }], 'id'));
  }, [session]);

  function removeAddressFromList(badge: string) {
    setAddresses(addresses.filter((b) => b.id !== badge));
  }

  function removeEmailsFromList(email: string) {
    setEmails(emails.filter((b) => b.id !== email));
  }

  function addAddressToList(badge: string) {
    setAddresses(union(addresses, [{ id: badge, label: badge }]));
  }

  function addEmailToList(badge: string) {
    setEmails(union(emails, [{ id: badge, label: badge }]));
  }

  async function saveNotifications() {
    const dodaoAccessToken = getAuthToken(session, showNotification);
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'dodao-auth-token': dodaoAccessToken!,
      },
      body: JSON.stringify({ userId: session?.username!, selectedNotifications, addresses: addresses.map((b) => b.id) }),
    });
    if (response.status !== 200) {
      showNotification({ message: 'Error saving notifications', type: 'error' });
    } else {
      showNotification({ message: 'Notifications saved', type: 'success' });
    }
  }

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-4xl font-bold">Welcome to the Compound Notify</h1>
        <Grid2Cols>
          <UpsertBadgeInput label={'Tracking Addresses'} onRemove={removeAddressFromList} badges={addresses} onAdd={addAddressToList} />
          <UpsertBadgeInput label={'Emails'} onRemove={removeEmailsFromList} badges={emails} onAdd={addEmailToList} />
          <CheckboxesWithInfo
            label={'Notifications'}
            items={checkboxItems}
            className={'mt-16 max-h-96 overflow-auto pr-8 w-full'}
            selectedItems={selectedNotifications}
            updateSelectedItems={setSelectedNotifications}
          />
        </Grid2Cols>
        <Button className="mt-8" variant="contained" primary disabled={!session?.username} onClick={() => saveNotifications()}>
          Save
        </Button>
      </div>
    </PageWrapper>
  );
}

export default Home;
