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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCategories, useCategory } from '../../../../hooks';
import { PageHeader } from '../../../../src/components/page-header';

type Params = {
  slug: string;
};

export default function Page({ params: { slug } }: { params: Params }) {
  const toast = useToast();
  const { replace } = useRouter();
  const { remove, update } = useCategories();
  const { data: category } = useCategory(slug);

  const [name, setName] = useState(category?.name ?? '');
  const [removing, setRemoving] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (category && name.length === 0) {
      setName(category.name);
    }
  }, [category, name]);

  const handleUpdate = async () => {
    setUpdating(true);
    const updated = await update(slug, name);
    replace(`/manage/categories/${updated.slug}`);
    toast({
      status: 'success',
      title: 'Category updated',
      description: `Category ${updated.name} has been updated`,
    });
    setUpdating(false);
  };

  const handleRemove = async () => {
    setRemoving(true);
    await remove(slug);
    replace('/manage/categories');
    toast({
      status: 'success',
      title: 'Category deleted',
      description: `Category ${category?.name} has been deleted`,
    });
    setRemoving(false);
  };

  return (
    <VStack w='full' h='full'>
      <PageHeader backHref='/manage' />
      <VStack w='full' h='full' p={4}>
        <Card w='full' maxW='sm' bg='cardBackground'>
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
                    Are you sure you want to delete this category?
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
                onClick={handleUpdate}
                isLoading={updating}
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
