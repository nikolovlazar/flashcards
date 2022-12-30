'use client';

import NextLink from 'next/link';
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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { useCategories } from '../../../../hooks';
import { PageHeader } from '../../../../src/components/page-header';

export default function Page() {
  const { create } = useCategories();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (name.length === 0) return;

    setIsLoading(true);

    await create(name);

    toast({
      status: 'success',
      title: 'Category created',
      description: `Category ${name} has been created`,
    });
    setName('');

    setIsLoading(false);
  };

  return (
    <VStack w='full' h='full'>
      <PageHeader backHref='/manage/categories' />
      <VStack w='full' h='full' p={4}>
        <Card w='full' maxW='sm' bg='cardBackground'>
          <CardHeader>
            <Heading as='h2' size='md'>
              Creating a new category
            </Heading>
          </CardHeader>
          <CardBody>
            <form id='create-category'>
              <VStack>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder='React'
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                  />
                </FormControl>
              </VStack>
            </form>
          </CardBody>
          <CardFooter>
            <HStack w='full' justifyContent='flex-end'>
              <Button as={NextLink} href='/manage/categories' variant='ghost'>
                Cancel
              </Button>
              <Button
                colorScheme='green'
                isLoading={isLoading}
                onClick={handleCreate}
                type='submit'
                form='create-category'
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
