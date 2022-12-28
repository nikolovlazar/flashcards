'use client';

import { Heading, HStack, Icon, IconButton } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { RxHamburgerMenu } from 'react-icons/rx';

import { useMainSidebar } from '../../providers/main-sidebar-provider';

export const SidebarHeader = () => {
  const { open } = useMainSidebar();
  const pathname = usePathname();

  return (
    <HStack p={2} display={{ base: 'flex', lg: 'none' }}>
      <IconButton
        icon={<Icon as={RxHamburgerMenu} />}
        aria-label='Toggle Side Menu'
        onClick={open}
        variant='ghost'
        size='sm'
      />
      <Heading size='xs' textTransform='capitalize'>
        {pathname?.matchAll(/\/([\w-]+)\/*/g)?.next()?.value?.[1]}
      </Heading>
    </HStack>
  );
};
