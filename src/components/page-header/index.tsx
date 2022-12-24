import { BsArrowLeftShort } from 'react-icons/bs';
import NextLink from 'next/link';
import { HStack, Icon, IconButton } from '@chakra-ui/react';
import React from 'react';

type Props = {
  backHref: string;
  children?: React.ReactNode;
};

export const PageHeader = ({ backHref, children }: Props) => (
  <HStack
    w='full'
    bg='cardBackground'
    p={{ base: 2, md: !!children ? 2 : 0 }}
    borderBottomWidth={1}
  >
    <IconButton
      display={{ base: 'flex', md: 'none' }}
      aria-label='Back'
      as={NextLink}
      icon={<Icon as={BsArrowLeftShort} boxSize={6} />}
      href={backHref}
      variant='ghost'
      size='sm'
    />
    {children}
  </HStack>
);
