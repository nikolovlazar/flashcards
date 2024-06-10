import {
  Avatar,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  SkeletonCircle,
  Spacer,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';

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
        <VStack alignItems='flex-start' mt={9} padding={3} spacing={8} h='full'>
          <UserElement />
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
      <UserElement />
      <Links />
      <Spacer />
      <ThemeSwitcher />
    </VStack>
  );
};

function UserElement() {
  const { data, status } = useSession();

  if (status === 'loading') {
    return (
      <HStack spacing={2} w='full' p={3}>
        <SkeletonCircle />
        <VStack alignItems='flex-start' spacing={2} flex={1}>
          <Skeleton height='14px' w='full' />
          <Skeleton height='12px' w='full' />
        </VStack>
        <MdKeyboardArrowDown />
      </HStack>
    );
  }

  return (
    <Menu>
      <MenuButton
        w='full'
        p={3}
        rounded='lg'
        _hover={{ bg: 'blackAlpha.100', _dark: { bg: 'whiteAlpha.100' } }}
      >
        <HStack spacing={2}>
          <Avatar
            src={data?.user?.image ?? ''}
            name={data?.user?.name ?? data?.user?.email ?? 'Some User'}
            size='sm'
          />
          <VStack alignItems='flex-start' spacing={0} flex={1}>
            <Heading as='h4' fontSize='sm'>
              {data?.user?.name}
            </Heading>
            <Text fontSize='xs'>{data?.user?.email}</Text>
          </VStack>
          <MdKeyboardArrowDown />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem icon={<FiLogOut />} onClick={() => signOut()}>
          Log out
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function Links() {
  return (
    <VStack w='full' as='nav'>
      <SidebarLink title='Manage' href='/manage' />
      <SidebarLink title='Practice' href='/practice' />
    </VStack>
  );
}
