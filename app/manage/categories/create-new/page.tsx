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
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { useCategories } from '../../../../hooks';
import { PageHeader } from '../../../../src/components/page-header';

export default function Page() {
  const { create, isValidating, isLoading } = useCategories();
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (name.length === 0) return;

    create(name);
  };

  return (
    <VStack w='full' h='full'>
      <PageHeader backHref='/manage' />
      <VStack w='full' h='full' p={4}>
        <Card w='full' maxW='sm' bg='cardBackground'>
          <CardHeader>
            <Heading as='h2' size='md'>
              Creating a new category
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder='React'
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </FormControl>
            </VStack>
          </CardBody>
          <CardFooter>
            <HStack w='full' justifyContent='flex-end'>
              <Button as={NextLink} href='/manage' variant='ghost'>
                Cancel
              </Button>
              <Button
                colorScheme='green'
                isLoading={isValidating || isLoading}
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
