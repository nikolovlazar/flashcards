import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { NextComponentType } from 'next/types';

import { theme } from '../src-old/theme';

type LayoutComponent = NextComponentType & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type LayoutProps = AppProps & {
  Component: LayoutComponent;
};

export default function App({ Component, pageProps }: LayoutProps) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Flashcards 🧠!</title>
      </Head>
      <SessionProvider>
        <ChakraProvider theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </SessionProvider>
    </>
  );
}
