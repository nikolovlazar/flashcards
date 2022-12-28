'use client';

import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Heading,
  Spacer,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { useMainSidebar } from '../../providers/main-sidebar-provider';
import { SidebarLink } from '../sidebar-link';
import { ThemeSwitcher } from '../theme-switcher';

export const MainSidebar = () => {
  const { isOpened, close } = useMainSidebar();
  const isMedium = useBreakpointValue({ base: true, lg: false });

  return isMedium ? (
    <Drawer isOpen={isOpened} onClose={close} placement='start'>
      <DrawerOverlay />
      <DrawerContent maxW='250px'>
        <DrawerCloseButton />
        <VStack alignItems='flex-start' padding={3} spacing={8} h='full'>
          <Title />
          <Links />
          <Spacer />
          <ThemeSwitcher />
        </VStack>
      </DrawerContent>
    </Drawer>
  ) : (
    <VStack
      display={{ base: 'none', md: 'flex' }}
      padding={3}
      w='full'
      maxW='250px'
      borderRightWidth={1}
      height='full'
      spacing={8}
      alignItems='flex-start'
    >
      <Title />
      <Links />
      <Spacer />
      <ThemeSwitcher />
    </VStack>
  );
};

function Title() {
  return (
    <Heading textAlign='center' w='full'>
      🧠
    </Heading>
  );
}

function Links() {
  return (
    <VStack w='full' as='nav'>
      <SidebarLink title='Manage' href='/manage/flashcards' />
      <SidebarLink title='Practice' href='/practice' />
    </VStack>
  );
}
