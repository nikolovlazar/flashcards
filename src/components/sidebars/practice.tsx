'use client';

import { VStack } from '@chakra-ui/react';

import { useCategories } from '../../../hooks';
import { SidebarLink } from '../sidebar-link';
import { SidebarHeader } from './sidebar-header';

export const PracticeSidebar = async () => {
  const { data: categories } = useCategories();

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
        {categories?.map(({ id, name, slug }) => (
          <SidebarLink key={id} title={name} href={`/practice/${slug}`} />
        ))}
      </VStack>
    </VStack>
  );
};
