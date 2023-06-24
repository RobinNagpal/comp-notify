'use client';
import LoginModal from '@/components/auth/LoginModal';
import Notification from '@/components/core/notify/Notification';
import TopNav from '@/components/main/TopNav/TopNav';
import CompoundTheme from '@/components/themes/CompoundTheme';
import GlobalTheme from '@/components/themes/GlobalTheme';
import {LoginModalProvider} from '@/contexts/LoginModalContext';

import {NotificationProvider, useNotificationContext} from '@/contexts/NotificationContext';
import Web3ReactProviderWrapper from '@/contexts/Web3ReactContext';
import {Session} from '@/types/auth/Session';
import {SessionProvider} from 'next-auth/react';
import './globals.scss';
import styled from 'styled-components';

// Based on - https://tailwindui.com/components/application-ui/page-examples/home-screens

interface InternalLayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

function ThemeComponent() {
  const isThemeCompound = true;

  if (isThemeCompound) return <CompoundTheme/>;

  return (
    <div>
      <GlobalTheme/>
    </div>
  );
}

const NotificationWrapper = () => {
  const {notification, hideNotification} = useNotificationContext();

  if (!notification) return null;

  const key = `${notification.heading}_${notification.type}_${notification.duration}_${Date.now()}`;

  return (
    <Notification
      key={key}
      type={notification.type}
      duration={notification.duration}
      heading={notification.heading}
      message={notification.message}
      onClose={hideNotification}
    />
  );
};

const StyledMain = styled.main`
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
`;

function ChildLayout({children, session}: InternalLayoutProps) {
  const origin = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '';


  return (
    <Web3ReactProviderWrapper>
      <SessionProvider session={session}>
        <ThemeComponent/>
        <LoginModalProvider>
          <LoginModal/>
          <TopNav/>
          <StyledMain>{children}</StyledMain>
        </LoginModalProvider>
      </SessionProvider>
      <NotificationWrapper/>
    </Web3ReactProviderWrapper>
  );
}

export default function InternalLayout({children, session}: InternalLayoutProps) {
  return (

    <NotificationProvider>
      <ChildLayout session={session}>{children}</ChildLayout>
    </NotificationProvider>

  );
}
