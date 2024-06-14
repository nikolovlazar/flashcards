'use client';

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
import { Category } from '@prisma/client';
import { useState, type ReactNode } from 'react';
import { updateCategory } from '../actions';
import { toast } from 'sonner';
import { HiddenInput } from '@/components/ui/hidden-input';

export default function EditCategory({
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
    const res = await updateCategory(formData);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Category updated');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='gap-6'>
        <DialogHeader>
          <DialogTitle>Edit {category.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} id='create-category' className=''>
          <HiddenInput name='id' value={`${category.id}`} />
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
