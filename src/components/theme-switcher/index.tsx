import { IconButton, useColorMode } from '@chakra-ui/react';

import { BsMoonStars, BsSun } from 'react-icons/bs';

export const ThemeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label='Toggle color mode'
      overflow='hidden'
      icon={colorMode === 'dark' ? <BsSun /> : <BsMoonStars />}
      variant='ghost'
      w='full'
      onClick={toggleColorMode}
    />
  );
};
