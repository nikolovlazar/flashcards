'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { HiddenInput } from '@/components/ui/hidden-input';
import type { Category } from '@/lib/models';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';

export default function ConfirmDelete({
  category,
  children,
}: {
  category: Category;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    const res = await fetch(`/api/categories/${category.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      toast.success('Category deleted');
      setOpen(false);
      router.refresh();
    } else {
      const message = await res.text();
      toast.error(message);
    }

    setIsDeleting(false);
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
        <AlertDialogFooter>
          <HiddenInput name='id' value={`${category.id}`} />
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isDeleting}
            onClick={handleDelete}
            className='bg-destructive hover:bg-destructive/80'
          >
            {isDeleting ? <Loader className='animate-spin' /> : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
