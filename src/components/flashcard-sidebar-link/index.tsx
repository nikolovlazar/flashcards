'use client';

import {
  LinkBox,
  VStack,
  LinkOverlay,
  Heading,
  Text,
  Badge,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import type { Flashcard } from '@prisma/client';

import { getContrastingTextColor, stringToColour } from '../../../utils/color';
import { useCategories } from '../../../hooks';

type Props = Pick<Flashcard, 'question' | 'answer' | 'categoryId' | 'slug'>;

export const FlashcardSidebarLink = ({
  question,
  answer,
  categoryId,
  slug,
}: Props) => {
  const { data: categories } = useCategories();

  const pathname = usePathname();
  const isActive = pathname === `/manage/flashcards/${slug}`;
  const category = categories?.find((category) => category.id === categoryId);

  return (
    <LinkBox
      background={isActive ? 'linkActiveBackground' : 'linkBackground'}
      _hover={{
        bg: isActive ? 'linkActiveBackground' : 'linkHoverBackground',
      }}
      padding={4}
      transition='background-color 0.2s'
    >
      <VStack alignItems='flex-start'>
        <Badge
          background={stringToColour(category?.name)}
          color={getContrastingTextColor(stringToColour(category?.name))}
          rounded='base'
        >
          {category?.name}
        </Badge>
        <LinkOverlay as={NextLink} href={`/manage/flashcards/${slug}`}>
          <Heading
            size='xs'
            color={isActive ? 'white' : 'gray.700'}
            _dark={{ color: isActive ? 'white' : 'gray.200' }}
          >
            {question}
          </Heading>
        </LinkOverlay>
        <Text
          noOfLines={3}
          fontSize='sm'
          color={isActive ? 'gray.400' : 'gray.500'}
        >
          {answer}
        </Text>
      </VStack>
    </LinkBox>
  );
};
