'use client';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useReducer } from 'react';

import { PageHeader } from '../../../../src/components/page-header';
import { useCategories, useFlashcard } from '../../../../hooks';

type Params = {
  slug: string;
};

enum ValuesActionKind {
  SET_QUESTION = 'SET_QUESTION',
  SET_ANSWER = 'SET_ANSWER',
  SET_CATEGORY = 'SET_CATEGORY',
  SET_STATE = 'SET_STATE',
}

type ValuesAction = {
  type: ValuesActionKind;
  payload: any;
};

type ValuesState = Partial<{
  id: number;
  question: string;
  answer: string;
  categoryId: number;
}>;

function valuesReducer(state: ValuesState, action: ValuesAction) {
  switch (action.type) {
    case ValuesActionKind.SET_QUESTION:
      return { ...state, question: action.payload };
    case ValuesActionKind.SET_ANSWER:
      return { ...state, answer: action.payload };
    case ValuesActionKind.SET_CATEGORY:
      return { ...state, categoryId: action.payload };
    case ValuesActionKind.SET_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export default function Page({ params: { slug } }: { params: Params }) {
  const { data: categories } = useCategories();
  const { data: flashcard } = useFlashcard(slug);

  const [values, dispatch] = useReducer(valuesReducer, {
    id: flashcard?.id,
    question: flashcard?.question,
    answer: flashcard?.answer,
    categoryId: flashcard?.categoryId,
  });

  useEffect(() => {
    if (flashcard) {
      dispatch({
        type: ValuesActionKind.SET_STATE,
        payload: {
          id: flashcard.id,
          question: flashcard.question,
          answer: flashcard.answer,
          categoryId: flashcard.categoryId,
        },
      });
    }
  }, [flashcard]);

  const handleUpdate = () => {};

  return (
    <VStack w='full' h='full'>
      <PageHeader backHref='/manage' />
      <VStack w='full' h='full' p={4}>
        <Card w='full' maxW='lg' bg='cardBackground'>
          <CardHeader>
            <Heading as='h2' size='md'>
              Editing {flashcard?.question}
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack>
              <FormControl>
                <FormLabel>Question</FormLabel>
                <Input
                  placeholder='What is React?'
                  value={values?.question}
                  onChange={(e) =>
                    dispatch({
                      type: ValuesActionKind.SET_QUESTION,
                      payload: e.currentTarget.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Answer</FormLabel>
                <Textarea
                  placeholder='In hac habitasse platea dictumst. Nam auctor, metus imperdiet commodo ultricies, ante libero malesuada libero, a hendrerit ex nisl a tellus.'
                  value={values?.answer}
                  onChange={(e) =>
                    dispatch({
                      type: ValuesActionKind.SET_ANSWER,
                      payload: e.currentTarget.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder='Select category'
                  value={values?.categoryId}
                >
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </CardBody>
          <CardFooter>
            <HStack w='full' justifyContent='flex-end'>
              <Button variant='ghost' colorScheme='red'>
                Delete
              </Button>
              <Button colorScheme='green' onClick={handleUpdate}>
                Update
              </Button>
            </HStack>
          </CardFooter>
        </Card>
      </VStack>
    </VStack>
  );
}
