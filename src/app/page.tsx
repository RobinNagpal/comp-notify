'use client';

import BadgeWithRemove from '@/components/core/badge/BadgeWithRemove';
import UpsertBadgeInput, { Badges } from '@/components/core/badge/UpsertBadgeInput';
import CheckboxesWithInfo from '@/components/core/checkboxes/CheckboxesWithInfo';
import PageWrapper from '@/components/core/page/PageWrapper';
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
  const [badges, setBadges] = React.useState<Badges[]>([]);

  useEffect(() => {
    let username = session?.username;
    if (!username) return;
    setBadges(unionBy(badges, [{ id: username.toLowerCase(), label: username.toLowerCase() }], 'id'));
  }, [session]);

  function removeAddressFromList(badge: string) {
    setBadges(badges.filter((b) => b.id !== badge));
  }

  function addAddressToList(badge: string) {
    setBadges(union(badges, [{ id: badge, label: badge }]));
  }

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-4xl font-bold">Welcome to the Compound Notify</h1>
        <UpsertBadgeInput label={'Notification Addresses'} onRemove={removeAddressFromList} badges={badges} onAdd={addAddressToList} />
        <CheckboxesWithInfo label={'Notifications'} items={checkboxItems} className={'mt-16'} />
      </div>
    </PageWrapper>
  );
}

export default Home;
