import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  ScaleFade,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { type ReactNode, useEffect, useState } from 'react';
import {
  BsArrowCounterclockwise,
  BsArrowRight,
  BsEye,
  BsShuffle,
} from 'react-icons/bs';
import type { GetServerSideProps } from 'next/types';
import type { Category, Flashcard } from '@prisma/client';

import { PageHeader } from '../../../src/components/page-header';
import MainLayout from '../../../src/layouts/main';
import PracticeLayout from '../../../src/layouts/practice';
import { shuffleArray } from '../../../utils/array';
import { getSession } from '../../../utils/auth';
import { getCategory, getUserFromSession } from '../../../prisma/helpers';

type Props = {
  category: Category & { flashcards?: Flashcard[] };
};

export default function Page({ category }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const [displayedCards, setDisplayedCards] = useState(
    category?.flashcards ?? []
  );

  const showCompletion =
    index === displayedCards?.length &&
    !flipped &&
    (category?.flashcards?.length ?? 0) > 0;

  useEffect(() => {
    if (
      category?.flashcards &&
      category?.flashcards.length > 0 &&
      displayedCards.length === 0
    ) {
      setDisplayedCards(category?.flashcards);
    }
  }, [category?.flashcards, displayedCards]);

  useEffect(() => {
    setDisplayedCards(category?.flashcards ?? []);
  }, [category]);

  const shuffleCards = () => {
    setDisplayedCards(shuffleArray([...displayedCards]));
    setIndex(0);
    setFlipped(false);
  };

  const nextCard = () => {
    setIndex((index) => index + 1);
    setFlipped(false);
  };

  const flipCard = () => {
    setFlipped(true);
  };

  const restart = () => {
    setIndex(0);
    setFlipped(false);
  };

  return (
    <VStack w='full' h='full' spacing={16}>
      <PageHeader backHref='/practice'>
        <Spacer />
        <Tooltip label='Shuffle cards'>
          <IconButton
            aria-label='Shuffle'
            icon={<BsShuffle />}
            variant='ghost'
            size='sm'
            onClick={shuffleCards}
          />
        </Tooltip>
      </PageHeader>
      <Flex
        justifyContent='center'
        w='full'
        h='full'
        m={16}
        overflow='hidden'
        p={2}
      >
        <Box position='relative' boxSize='full'>
          {(category?.flashcards?.length ?? 0) === 0 && (
            <Heading
              position='absolute'
              left='50%'
              transform='translateX(-50%)'
            >
              Empty category!
            </Heading>
          )}
          {(category?.flashcards?.length ?? 0) > 0 && (
            <>
              <Card
                bg='cardBackground'
                position='absolute'
                left='50%'
                transitionProperty='transform'
                transitionDuration='0.15s'
                transitionDelay={flipped ? '0s' : '0.15s'}
                transitionTimingFunction='ease-out'
                transform={`translate(-50%, 0) rotateY(${
                  flipped ? '-90deg' : '0deg'
                }) scale(${flipped ? 1.25 : 1})`}
                w='full'
                maxW='md'
                maxH='600px'
              >
                <CardHeader>
                  <Heading size='lg'>{displayedCards[index]?.question}</Heading>
                </CardHeader>
                <CardFooter
                  alignItems='center'
                  justifyContent='space-between'
                  p={0}
                  pl={5}
                >
                  <Text>
                    {index + 1}/{displayedCards.length}
                  </Text>
                  <Tooltip label='Reveal answer'>
                    <IconButton
                      aria-label='Reveal answer'
                      icon={<BsEye />}
                      variant='ghost'
                      onClick={flipCard}
                      rounded='none'
                      p={8}
                    />
                  </Tooltip>
                </CardFooter>
              </Card>
              <Card
                bg='cardBackground'
                position='absolute'
                left='50%'
                transitionProperty='transform'
                transitionDuration='0.15s'
                transitionDelay={flipped ? '0.15s' : '0s'}
                transitionTimingFunction='ease-out'
                transform={`translate(-50%, 0) rotateY(${
                  flipped ? '0deg' : '90deg'
                }) scale(${flipped ? 1 : 1.25})`}
                w='full'
                maxW='md'
                maxH='600px'
              >
                <CardHeader>
                  <Heading size='lg'>{displayedCards[index]?.question}</Heading>
                </CardHeader>
                <CardBody overflowY='auto'>
                  <Text>{displayedCards[index]?.answer}</Text>
                </CardBody>
                <CardFooter
                  alignItems='center'
                  justifyContent='space-between'
                  p={0}
                  pl={5}
                >
                  <Text>
                    {index + 1}/{displayedCards.length}
                  </Text>
                  <Tooltip label='Next question'>
                    <IconButton
                      aria-label='Next question'
                      icon={<BsArrowRight />}
                      variant='ghost'
                      onClick={nextCard}
                      rounded='none'
                      p={8}
                    />
                  </Tooltip>
                </CardFooter>
              </Card>
            </>
          )}
          {showCompletion && (
            <ScaleFade initialScale={0.25} in={showCompletion}>
              <Card
                bg='cardBackground'
                position='absolute'
                left='50%'
                w='full'
                maxW='md'
                maxH='600px'
                transform='translate(-50%, 0)'
              >
                <CardHeader>
                  <Heading size='lg'>All done! 🎉</Heading>
                </CardHeader>
                <CardBody overflowY='auto'>
                  <Text>Do it again?</Text>
                </CardBody>
                <CardFooter
                  alignItems='center'
                  justifyContent='flex-end'
                  p={0}
                  pl={5}
                >
                  <Tooltip label='Restart'>
                    <IconButton
                      aria-label='Next Question'
                      icon={<BsArrowCounterclockwise />}
                      variant='ghost'
                      onClick={restart}
                      rounded='none'
                      p={8}
                    />
                  </Tooltip>
                </CardFooter>
              </Card>
            </ScaleFade>
          )}
        </Box>
      </Flex>
    </VStack>
  );
}

Page.getLayout = (page: ReactNode) => {
  return (
    <MainLayout>
      <PracticeLayout>{page}</PracticeLayout>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getSession(ctx.req, ctx.res);
  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

  const user = await getUserFromSession(session);
  if (!user)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

  const slug = ctx.params?.slug as string;
  const category = await getCategory(slug, user);

  if (!category) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
      slug,
    },
  };
};
