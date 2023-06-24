import ButtonLarge from '@/components/core/buttons/Button';
import {DesktopNavLink} from '@/components/main/TopNav/DesktopNavLink';
import {DesktopProfileMenu} from '@/components/main/TopNav/DesktopProfileMenu';
import {MobileNavLink} from '@/components/main/TopNav/MobileNavLink';
import {MobileProfileMenu} from '@/components/main/TopNav/MobileProfileMenu';
import {useLoginModalContext} from '@/contexts/LoginModalContext';
import {Session} from '@/types/auth/Session';
import {Disclosure} from '@headlessui/react';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import {useSession} from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  background-color: var(--bg-color);
  color: var(--text-color);
`;

function DesktopNavLinks() {

  return (
    <div className="hidden md:ml-6 md:flex md:space-x-8">
      <DesktopNavLink key="link1" href="/link1" label="Link1" />
    </div>
  );
}

function MobileNavLinks() {

  return (
    <div className="space-y-1 pb-3 pt-2">
      <MobileNavLink key="link1" href="/link1" label="Link1" />
    </div>
  );
}

export default function TopNav() {
  const { data: session } = useSession();
  const { setShowLoginModal } = useLoginModalContext();

  return (
    <StyledDiv>
      <Disclosure
        as="nav"
        className="shadow"
        style={{
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
          borderBottom: '0.5px solid var(--border-color)',
          // boxShadow: '0px 50px 50px 0px red',
        }}
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="-ml-2 mr-2 flex items-center md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/">
                      <Image
                        className="block h-8 w-auto lg:hidden"
                        src="https://d31h13bdjwgzxs.cloudfront.net/QmVh2xNZ6Z9k2M5GPqHw9V9VdAatuTN4QyvQnhroaY8KF2"
                        alt="Your Company"
                        width={50}
                        height={50}
                      />
                    </Link>
                    <Link href="/">
                      <Image
                        className="hidden h-8 w-auto lg:block"
                        src="https://d31h13bdjwgzxs.cloudfront.net/QmVh2xNZ6Z9k2M5GPqHw9V9VdAatuTN4QyvQnhroaY8KF2"
                        alt="Your Company"
                        width={50}
                        height={50}
                      />
                    </Link>
                  </div>
                  <DesktopNavLinks  />
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {!session && (

                      <ButtonLarge variant="contained" primary onClick={() => setShowLoginModal(true)}>
                        Login
                      </ButtonLarge>
                    )}
                  </div>

                  {session && (
                    <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                      <DesktopProfileMenu session={session as Session} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <MobileNavLinks  />
              {session && <MobileProfileMenu session={session as Session} />}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </StyledDiv>
  );
}
