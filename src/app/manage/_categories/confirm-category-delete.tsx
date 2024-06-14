'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { HiddenInput } from '@/components/ui/hidden-input';
import type { Category } from '@prisma/client';
import { useState, type ReactNode } from 'react';
import { deleteCategory } from '../actions';
import { toast } from 'sonner';

export default function ConfirmDelete({
  category,
  children,
}: {
  category: Category;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await deleteCategory(formData);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Category created');
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete the &quot;{category.name}&quot;
            category?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            category, <strong>and all its flashcards</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <AlertDialogFooter>
            <HiddenInput name='id' value={`${category.id}`} />
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              type='submit'
              className='bg-destructive hover:bg-destructive/80'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
