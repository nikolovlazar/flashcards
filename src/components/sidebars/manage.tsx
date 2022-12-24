import NextLink from 'next/link';
import { Button, Icon, Spacer, VStack } from '@chakra-ui/react';
import { AiOutlinePlus } from 'react-icons/ai';

import { cards } from '../../../mock/cards';
import { FlashcardSidebarLink } from '../flashcard-sidebar-link';
import { SidebarHeader } from './sidebar-header';

export const ManageSidebar = () => {
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
      <VStack
        w='full'
        as='nav'
        alignItems='stretch'
        spacing={0}
        overflowY='auto'
      >
        {cards.map(({ id, question, answer, slug, categoryId }) => (
          <FlashcardSidebarLink
            key={id}
            question={question}
            answer={answer}
            slug={slug}
            categoryId={categoryId}
          />
        ))}
      </VStack>
      <Spacer />
      <Button
        as={NextLink}
        href='/manage/create-new'
        w='full'
        colorScheme='blue'
        leftIcon={<Icon as={AiOutlinePlus} boxSize={6} />}
        rounded='none'
        py={8}
      >
        Create a new Flashcard
      </Button>
    </VStack>
  );
};
