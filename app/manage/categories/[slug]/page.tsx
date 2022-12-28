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
import { useCategories } from '../../../../hooks';

import { PageHeader } from '../../../../src/components/page-header';

type Params = {
  slug: string;
};

export default function Page({ params: { slug } }: { params: Params }) {
  const { data: categories } = useCategories();
  const category = categories?.find((cat) => cat.slug === slug);
  const [name, setName] = useState(category?.name);

  return (
    <VStack w='full' h='full'>
      <PageHeader backHref='/manage' />
      <VStack w='full' h='full' p={4}>
        <Card w='full' bg='cardBackground'>
          <CardHeader>
            <Heading as='h2' size='md'>
              Editing {category?.name}
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
