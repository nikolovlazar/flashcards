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
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateCategory() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch('/api/categories', {
      method: 'POST',
      body: formData,
    });

    toast.success('Category created');
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' size='icon'>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className='gap-6'>
        <DialogHeader>
          <DialogTitle>Create a new category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} id='create-category' className=''>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' name='name' placeholder='JavaScript' />
          </div>
        </form>
        <DialogFooter>
          <Button form='create-category' type='submit'>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
