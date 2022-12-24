'use client';

import { ChakraProvider, ColorModeScript, HStack } from '@chakra-ui/react';

import { MainSidebar } from '../src/components/sidebars';
import { MainSidebarProvider } from '../src/providers/main-sidebar-provider';
import { theme } from '../src/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head />
      <body>
        <ColorModeScript initialColorMode='system' />
        <ChakraProvider theme={theme}>
          <MainSidebarProvider>
            <HStack height='100vh' alignItems='flex-start' spacing={0}>
              <MainSidebar />
              {children}
            </HStack>
          </MainSidebarProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
