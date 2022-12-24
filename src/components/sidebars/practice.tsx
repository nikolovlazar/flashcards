'use client';

import { VStack } from '@chakra-ui/react';

import { categories } from '../../../mock/categories';
import { SidebarLink } from '../sidebar-link';
import { SidebarHeader } from './sidebar-header';

export const PracticeSidebar = () => {
  return (
    <VStack
      w='full'
      maxW={{ base: 'full', md: 'xs' }}
      borderRightWidth={1}
      height='full'
      spacing={0}
      alignItems='flex-start'
    >
      <SidebarHeader />
      <VStack w='full' as='nav' alignItems='stretch' overflowY='auto' p={2}>
        {categories.map(({ id, name, slug }) => (
          <SidebarLink key={id} title={name} href={`/practice/${slug}`} />
        ))}
      </VStack>
    </VStack>
  );
};
