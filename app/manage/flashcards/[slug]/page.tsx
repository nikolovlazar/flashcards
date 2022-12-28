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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useReducer, useState } from 'react';

import { PageHeader } from '../../../../src/components/page-header';
import { useCategories, useFlashcard, useFlashcards } from '../../../../hooks';
import { useRouter } from 'next/navigation';

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
  const { replace } = useRouter();
  const { data: categories } = useCategories();
  const { data: flashcard } = useFlashcard(slug);
  const { update, remove } = useFlashcards();
  const toast = useToast();

  const [values, dispatch] = useReducer(valuesReducer, {
    id: flashcard?.id,
    question: flashcard?.question,
    answer: flashcard?.answer,
    categoryId: flashcard?.categoryId,
  });
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

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

  const handleUpdate = async () => {
    setUpdating(true);
    await update(slug, {
      question: values.question,
      answer: values.answer,
      categoryId: values.categoryId,
    });
    setUpdating(false);
    toast({
      status: 'success',
      title: 'Flashcard updated',
      description: `Flashcard ${values.question} has been updated`,
    });
  };

  const handleRemove = async () => {
    setRemoving(true);
    await remove(slug);
    setRemoving(false);
    replace('/manage/flashcards');
    toast({
      status: 'success',
      title: 'Flashcard deleted',
      description: `Flashcard ${values.question} has been deleted`,
    });
  };

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
              <Popover>
                <PopoverTrigger>
                  <Button variant='ghost' colorScheme='red'>
                    Delete
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton size='md' />
                  <PopoverHeader>Confirmation!</PopoverHeader>
                  <PopoverBody>
                    Are you sure you want to delete this flashcard?
                  </PopoverBody>
                  <PopoverFooter>
                    <Button variant='ghost'>Cancel</Button>
                    <Button
                      variant='ghost'
                      colorScheme='red'
                      onClick={handleRemove}
                      isLoading={removing}
                    >
                      Delete
                    </Button>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
              <Button
                colorScheme='green'
                isLoading={updating}
                onClick={handleUpdate}
              >
                Update
              </Button>
            </HStack>
          </CardFooter>
        </Card>
      </VStack>
    </VStack>
  );
}
