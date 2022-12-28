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
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { PageHeader } from '../../../../src/components/page-header';

export default function Page() {
  const [name, setName] = useState('');

  const handleCreate = () => {
    console.log(name);
  };

  return (
    <VStack w='full' h='full'>
      <PageHeader backHref='/manage' />
      <VStack w='full' h='full' p={4}>
        <Card w='full' bg='cardBackground'>
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
