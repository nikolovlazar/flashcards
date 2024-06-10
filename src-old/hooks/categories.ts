import useSWR, { mutate } from "swr";
import type { Category, Flashcard } from "@prisma/client";

export function useCategories() {
  const { data: categories } = useSWR<Category[]>(
    "/api/categories",
    async () => {
      const res = await fetch("/api/categories", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(
          `Failed to fetch flashcards. Reason: ${res.statusText}`,
        );
      }
    },
  );

  const create = async (name: string) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (res.ok) {
      mutate("/api/categories");
      return await res.json();
    } else {
      throw new Error(`Failed to create category. Reason: ${res.statusText}`);
    }
  };

  return {
    categories,
    create,
  };
}

export function useCategory(slug?: string) {
  const { data: category, isLoading } = useSWR<
    Category & { flashcards?: Flashcard[] }
  >(slug && `/api/categories/${slug}`, async () => {
    const res = await fetch(`/api/categories/${slug}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      return await res.json();
    } else {
      throw new Error(`Failed to fetch categories. Reason: ${res.statusText}`);
    }
  });

  const remove = async () => {
    const res = await fetch(`/api/categories/${slug}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      mutate("/api/categories");
      return await res.json();
    } else {
      throw new Error(`Failed to delete category. Reason: ${res.statusText}`);
    }
  };

  const update = async (slug: string, name: string) => {
    const res = await fetch(`/api/categories/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (res.ok) {
      mutate(`/api/categories/${slug}`);
      mutate("/api/categories");
      return await res.json();
    } else {
      throw new Error(`Failed to update category. Reason: ${res.statusText}`);
    }
  };

  return {
    category,
    isLoading,
    remove,
    update,
  };
}
