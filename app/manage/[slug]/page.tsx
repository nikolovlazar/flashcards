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
import { useReducer } from 'react';

import { cards } from '../../../mock/cards';
import { categories } from '../../../mock/categories';
import { PageHeader } from '../../../src/components/page-header';

type Params = {
  slug: string;
};

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

export default function Page({ params: { slug } }: { params: Params }) {
  const card = cards.find((card) => card.slug === slug);
  const [values, dispatch] = useReducer(valuesReducer, {
    id: card?.id,
    question: card?.question,
    answer: card?.answer,
    categoryId: card?.categoryId,
  });

  return (
    <VStack w='full' h='full'>
      <PageHeader backHref='/manage' />
      <VStack w='full' h='full' p={4}>
        <Card w='full' bg='cardBackground'>
          <CardHeader>
            <Heading as='h2' size='md'>
              Editing {card?.question}
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
                  defaultValue={values?.categoryId}
                >
                  {categories.map((category) => (
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
              <Button colorScheme='green'>Update</Button>
            </HStack>
          </CardFooter>
        </Card>
      </VStack>
    </VStack>
  );
}
