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
import type { Category, Flashcard } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useReducer, useState, type ReactNode } from 'react';

import {
  getCategories,
  getFlashcard,
  getUserFromSession,
} from '../../../prisma/helpers';
import { PageHeader } from '../../../src-old/components/page-header';
import { useFlashcard } from '../../../src-old/hooks';
import MainLayout from '../../../src-old/layouts/main';
import ManageLayout from '../../../src-old/layouts/manage';
import { getSession } from '../../../utils/auth';

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

type Props = {
  categories: Category[];
  flashcard: Flashcard;
  slug: string;
};

export default function Page({ categories, flashcard, slug }: Props) {
  const router = useRouter();
  const { update, remove } = useFlashcard(slug);
  const toast = useToast();

  const [values, dispatch] = useReducer(valuesReducer, {
    id: flashcard.id,
    question: flashcard.question,
    answer: flashcard.answer,
    categoryId: flashcard.categoryId,
  });

  useEffect(() => {
    if (flashcard.question !== values.question) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashcard]);

  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleUpdate = async () => {
    if (
      values.question.length === 0 ||
      values.answer.length === 0 ||
      values.categoryId === 0
    )
      return;

    setUpdating(true);
    await update({
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
    await remove();
    setRemoving(false);
    router.replace('/manage/flashcards');
    toast({
      status: 'success',
      title: 'Flashcard deleted',
      description: `Flashcard ${values.question} has been deleted`,
    });
  };

  return (
    <VStack w='full' h='full'>
      <PageHeader backHref='/manage/flashcards' />
      <VStack w='full' h='full' p={4}>
        <Card w='full' maxW='lg' bg='cardBackground'>
          <CardHeader>
            <Heading as='h2' size='md'>
              Editing {flashcard?.question}
            </Heading>
          </CardHeader>
          <CardBody>
            <form id='edit-flashcard'>
              <VStack>
                <FormControl isRequired>
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
                <FormControl isRequired>
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
                <FormControl isRequired>
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
            </form>
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
                type='submit'
                form='edit-flashcard'
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

Page.getLayout = (page: ReactNode) => {
  return (
    <MainLayout>
      <ManageLayout>{page}</ManageLayout>
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
  const categories = await getCategories(user);

  const flashcard = await getFlashcard(slug, user);
  if (!flashcard) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      categories,
      flashcard,
      slug,
    },
  };
};
