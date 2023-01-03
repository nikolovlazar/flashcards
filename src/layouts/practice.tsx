import { PropsWithChildren } from 'react';
import { Box, HStack, useBreakpointValue } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

import { PracticeSidebar } from '../components/sidebars';

export default function PracticeLayout({ children }: PropsWithChildren) {
  const isSmall = useBreakpointValue({ base: true, md: false });
  const pathname = usePathname();
  const showSidebar = pathname === '/practice' || !isSmall;

  return (
    <HStack height='100vh' alignItems='flex-start' flex={1} spacing={0}>
      {showSidebar && <PracticeSidebar />}
      {(!pathname?.endsWith('/practice') || !isSmall) && (
        <Box bg='pageDottedBackground' bgSize='16px 16px' w='full' h='full'>
          {children}
        </Box>
      )}
    </HStack>
  );
}
