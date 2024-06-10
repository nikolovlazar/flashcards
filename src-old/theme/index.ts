import { extendTheme } from '@chakra-ui/react';

import { semanticTokens } from './foundations/semantic-tokens';

export const theme = extendTheme({
  ...semanticTokens,
});
