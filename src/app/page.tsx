'use client';

import UpsertBadgeInput, { Badges } from '@/components/core/badge/UpsertBadgeInput';
import Button from '@/components/core/buttons/Button';
import CheckboxesWithInfo from '@/components/core/checkboxes/CheckboxesWithInfo';
import PageWrapper from '@/components/core/page/PageWrapper';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { Session } from '@/types/auth/Session';
import { EventsEnum } from '@/types/events/EventsEnum';
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
  const [selectedNotifications, setSelectedNotifications] = React.useState<string[]>([]);

  async function fetchNotifications(userId: string) {
    const dodaoAccessToken = (session as Session).dodaoAccessToken;
    if (!dodaoAccessToken) return;
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

    fetchNotifications(username.toLowerCase());

    setAddresses(unionBy(addresses, [{ id: username.toLowerCase(), label: username.toLowerCase() }], 'id'));
  }, [session]);

  function removeAddressFromList(badge: string) {
    setAddresses(addresses.filter((b) => b.id !== badge));
  }

  function addAddressToList(badge: string) {
    setAddresses(union(addresses, [{ id: badge, label: badge }]));
  }

  async function saveNotifications() {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        <UpsertBadgeInput label={'Notification Addresses'} onRemove={removeAddressFromList} badges={addresses} onAdd={addAddressToList} />
        <CheckboxesWithInfo
          label={'Notifications'}
          items={checkboxItems}
          className={'mt-16'}
          selectedItems={selectedNotifications}
          updateSelectedItems={setSelectedNotifications}
        />
        <Button className="mt-8" variant="contained" primary disabled={!session?.username} onClick={() => saveNotifications()}>
          Save
        </Button>
      </div>
    </PageWrapper>
  );
}

export default Home;
