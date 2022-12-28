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
  useToast,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useReducer, useState } from 'react';

import { PageHeader } from '../../../../src/components/page-header';
import { useCategories, useFlashcards } from '../../../../hooks';

enum ValuesActionKind {
  SET_QUESTION = 'SET_QUESTION',
  SET_ANSWER = 'SET_ANSWER',
  SET_CATEGORY = 'SET_CATEGORY',
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
    default:
      return state;
  }
}

export default function Page() {
  const { data: categories } = useCategories();
  const { create } = useFlashcards();
  const toast = useToast();

  const [creating, setCreating] = useState(false);

  const [values, dispatch] = useReducer(valuesReducer, {
    question: '',
    answer: '',
    categoryId: 0,
  });

  const resetValues = () => {
    dispatch({ type: ValuesActionKind.SET_QUESTION, payload: '' });
    dispatch({ type: ValuesActionKind.SET_ANSWER, payload: '' });
    dispatch({ type: ValuesActionKind.SET_CATEGORY, payload: 0 });
  };

  const handleCreate = async () => {
    setCreating(true);
    await create({
      question: values.question,
      answer: values.answer,
      categoryId: values.categoryId,
    });
    setCreating(false);
    resetValues();
    toast({
      status: 'success',
      title: 'Flashcard created',
      description: `Flashcard ${values.question} has been created`,
    });
  };

  return (
    <VStack w='full' h='full'>
      <PageHeader backHref='/manage' />
      <VStack w='full' h='full' p={4}>
        <Card w='full' maxW='lg' bg='cardBackground'>
          <CardHeader>
            <Heading as='h2' size='md'>
              Creating a new card
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
                  onChange={(e) => {
                    dispatch({
                      type: ValuesActionKind.SET_CATEGORY,
                      payload: e.currentTarget.value,
                    });
                  }}
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
              <Button as={NextLink} href='/manage/flashcards' variant='ghost'>
                Cancel
              </Button>
              <Button
                colorScheme='green'
                isLoading={creating}
                onClick={handleCreate}
              >
                Create
              </Button>
            </HStack>
          </CardFooter>
        </Card>
      </VStack>
    </VStack>
  );
}