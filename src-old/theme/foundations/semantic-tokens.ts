import { type ChakraTheme } from '@chakra-ui/react';

export const semanticTokens: Pick<ChakraTheme, 'semanticTokens'> = {
  semanticTokens: {
    colors: {
      linkBackground: {
        default: 'unset',
      },
      linkActiveBackground: {
        default: 'blackAlpha.900',
      },
      linkHoverBackground: {
        default: 'blackAlpha.200',
        _dark: 'blackAlpha.400',
      },
      linkText: {
        default: 'blackAlpha.800',
        _dark: 'whiteAlpha.800',
      },
      linkActiveText: {
        default: 'white',
      },
      pageDottedBackground: {
        default:
          'linear-gradient(90deg,#f9fafb 15px,transparent 1%) 50%,linear-gradient(#f9fafb 15px,transparent 1%) 50%,rgba(0,0,0,.24)',
        _dark:
          'linear-gradient(90deg,#0e1117 15px,transparent 1%) 50%,linear-gradient(#0e1117 15px,transparent 1%) 50%,rgba(256,256,256,.1)',
      },
      cardBackground: {
        default: 'white',
        _dark: 'gray.800',
      },
    },
  },
};
