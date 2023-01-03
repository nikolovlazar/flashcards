import { PropsWithChildren } from 'react';
import { HStack } from '@chakra-ui/react';

import { MainSidebar } from '../components/sidebars';
import { MainSidebarProvider } from '../providers/main-sidebar-provider';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <MainSidebarProvider>
      <HStack height='100vh' alignItems='flex-start' spacing={0}>
        <MainSidebar />
        {children}
      </HStack>
    </MainSidebarProvider>
  );
}
