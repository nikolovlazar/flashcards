'use client';

import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from '@/lib/models';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';

export default function EditCategory({
  category,
  children,
}: {
  category: Category;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await Sentry.startSpan(
      {
        name: 'edit-category',
      },
      async () => {
        const formData = new FormData(event.currentTarget);
        const res = await fetch(`/api/categories/${category.id}`, {
          method: 'PATCH',
          body: formData,
        });

        if (res.ok) {
          toast.success('Category updated');
          setOpen(false);
          router.refresh();
        } else {
          const message = await res.text();
          toast.error(message);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='gap-6'>
        <DialogHeader>
          <DialogTitle>Edit {category.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} id='create-category'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              name='name'
              placeholder={category.name}
              defaultValue={category.name}
            />
          </div>
        </form>
        <DialogFooter>
          <Button form='create-category' type='submit'>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
