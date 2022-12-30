'use client';

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
import { useEffect, useState } from 'react';
import {
  BsArrowCounterclockwise,
  BsArrowRight,
  BsEye,
  BsShuffle,
} from 'react-icons/bs';

import { useCategory } from '../../../hooks';
import { PageHeader } from '../../../src/components/page-header';
import { shuffleArray } from '../../../utils/array';

type Params = {
  slug: string;
};

export default function Page({ params: { slug } }: { params: Params }) {
  const { data: category, isLoading: loadingCategory } = useCategory(slug);

  const isLoading = loadingCategory;

  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const [displayedCards, setDisplayedCards] = useState(
    category?.flashcards ?? []
  );

  const showCompletion =
    index === displayedCards?.length &&
    !flipped &&
    !isLoading &&
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
          {isLoading && <Spinner size='xl' position='absolute' left='50%' />}

          {!isLoading && (category?.flashcards?.length ?? 0) === 0 && (
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
