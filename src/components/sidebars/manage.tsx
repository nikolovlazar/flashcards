import NextLink from 'next/link';
import {
  Button,
  Icon,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { usePathname, useRouter } from 'next/navigation';
import { Category } from '@prisma/client';

import { FlashcardSidebarLink } from '../flashcard-sidebar-link';
import { SidebarHeader } from './sidebar-header';
import { SidebarLink } from '../sidebar-link';
import { useCategories, useFlashcards } from '../../hooks';

export const ManageSidebar = () => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const activeIndex = pathname?.startsWith('/manage/categories') ? 1 : 0;

  const [tabIndex, setTabIndex] = useState(Math.max(0, activeIndex));

  const { categories } = useCategories();
  const { flashcards } = useFlashcards();

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
      <Tabs
        overflowY='auto'
        isFitted
        w='full'
        index={tabIndex}
        onChange={(index) => {
          setTabIndex(index);
          replace('/manage' + (index === 0 ? '/flashcards' : '/categories'));
        }}
      >
        <TabList>
          <Tab>Flashcards</Tab>
          <Tab>Categories</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <VStack w='full' as='nav' alignItems='stretch' spacing={0}>
              {flashcards?.map(({ id, question, answer, slug, categoryId }) => (
                <FlashcardSidebarLink
                  key={id}
                  question={question}
                  answer={answer}
                  slug={slug}
                  categoryId={categoryId}
                />
              ))}
            </VStack>
          </TabPanel>
          <TabPanel p={0}>
            <VStack
              w='full'
              as='nav'
              alignItems='stretch'
              overflowY='auto'
              p={2}
            >
              {categories?.map(({ id, name, slug }) => (
                <SidebarLink
                  key={id}
                  title={name}
                  href={`/manage/categories/${slug}`}
                />
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Spacer />
      <Button
        as={NextLink}
        href={
          tabIndex === 0
            ? '/manage/flashcards/create-new'
            : '/manage/categories/create-new'
        }
        w='full'
        colorScheme='blue'
        leftIcon={<Icon as={AiOutlinePlus} boxSize={6} />}
        rounded='none'
        py={8}
      >
        {tabIndex === 0 && 'Create a new Flashcard'}
        {tabIndex === 1 && 'Create a new Category'}
      </Button>
    </VStack>
  );
};
