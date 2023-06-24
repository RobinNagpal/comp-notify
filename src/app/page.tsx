'use client';

import CheckboxesWithInfo from '@/components/core/checkboxes/CheckboxesWithInfo';
import PageWrapper from '@/components/core/page/PageWrapper';
import { EventsEnum } from '@/types/events/EventsEnum';

import React from 'react';

function Home() {
  const notifications = Object.keys(EventsEnum);
  const checkboxItems = notifications.map((notification) => ({
    id: notification,
    name: notification,
    label: notification,
    description: 'Get notified when someones does something YoYo.',
  }));
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <CheckboxesWithInfo label={'Notifications'} items={checkboxItems} />
      </div>
    </PageWrapper>
  );
}

export default Home;
