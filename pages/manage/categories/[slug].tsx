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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState, useEffect } from "react";
import type { Category } from "@prisma/client";
import type { GetServerSideProps } from "next/types";

import { useCategory } from "../../../src/hooks";
import { PageHeader } from "../../../src/components/page-header";
import MainLayout from "../../../src/layouts/main";
import ManageLayout from "../../../src/layouts/manage";
import { getSession } from "../../../utils/auth";
import { getCategory, getUserFromSession } from "../../../prisma/helpers";

type Props = {
  category: Category;
  slug: string;
};

export default function Page({ category, slug }: Props) {
  const toast = useToast();
  const { replace } = useRouter();

  const { remove, update } = useCategory(slug);

  const [name, setName] = useState(category.name);
  const [removing, setRemoving] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (category.name !== name) {
      setName(category.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const updated = await update(slug, name);
      replace(`/manage/categories/${updated.slug}`);
      toast({
        status: "success",
        title: "Category updated",
        description: `Category ${updated.name} has been updated`,
      });
    } catch (e) {
      toast({
        status: "error",
        title: "Error updating category",
        description: (e as Error).message,
      });
      throw e;
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await remove();
      replace("/manage/categories");
      toast({
        status: "success",
        title: "Category deleted",
        description: `Category ${category?.name} has been deleted`,
      });
    } catch (e) {
      toast({
        status: "error",
        title: "Error deleting category",
        description: (e as Error).message,
      });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <VStack w="full" h="full">
      <PageHeader backHref="/manage/categories" />
      <VStack w="full" h="full" p={4}>
        <Card w="full" maxW="sm" bg="cardBackground">
          <CardHeader>
            <Heading as="h2" size="md">
              Editing {category?.name}
            </Heading>
          </CardHeader>
          <CardBody>
            <form id="edit-category">
              <VStack>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="React"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                  />
                </FormControl>
              </VStack>
            </form>
          </CardBody>
          <CardFooter>
            <HStack w="full" justifyContent="flex-end">
              <Popover>
                <PopoverTrigger>
                  <Button variant="ghost" colorScheme="red">
                    Delete
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton size="md" />
                  <PopoverHeader>Confirmation!</PopoverHeader>
                  <PopoverBody>
                    Are you sure you want to delete this category?
                  </PopoverBody>
                  <PopoverFooter>
                    <Button variant="ghost">Cancel</Button>
                    <Button
                      variant="ghost"
                      colorScheme="red"
                      onClick={handleRemove}
                      isLoading={removing}
                    >
                      Delete
                    </Button>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
              <Button
                colorScheme="green"
                onClick={handleUpdate}
                isLoading={updating}
                form="edit-category"
                type="submit"
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
        destination: "/login",
        permanent: false,
      },
    };

  const user = await getUserFromSession(session);
  if (!user)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const slug = ctx.params?.slug as string;
  const category = await getCategory(slug, user);

  if (!category) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
      slug,
    },
  };
};
