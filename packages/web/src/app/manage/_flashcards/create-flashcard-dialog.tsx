'use client';

import { Button } from '@/components/ui/button';
import CategorySelect from './select-category';
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
import { Textarea } from '@/components/ui/textarea';
import type { Category } from '@/lib/models';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CreateFlashcard({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/flashcards', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      toast.success('Flashcard created');
      setOpen(false);
      router.refresh();
    } else {
      const message = await res.text();
      toast.error(message);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0]
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' size='icon'>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className='gap-6'>
        <DialogHeader>
          <DialogTitle>Create a new flashcard</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          id='create-flashcard'
          className='grid gap-4'
        >
          <div className='grid gap-2'>
            <Label htmlFor='question'>Question</Label>
            <Input
              id='question'
              name='question'
              placeholder='What is JavaScript?'
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='answer'>Answer</Label>
            <Textarea
              id='answer'
              name='answer'
              required
              placeholder='JavaScript is a programming language.'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='answer'>Add to category</Label>
            <input
              name='category'
              readOnly
              type='text'
              hidden
              aria-hidden
              aria-readonly
              value={selectedCategory.id}
              className='hidden'
            />
            <CategorySelect
              defaultValue={{
                label: selectedCategory.name,
                value: selectedCategory.slug,
              }}
              onSelect={(slug) =>
                setSelectedCategory(categories.find((c) => c.slug === slug)!)
              }
              categories={categories.map((category) => ({
                label: category.name,
                value: category.slug,
              }))}
            />
          </div>
        </form>
        <DialogFooter>
          <Button form='create-flashcard' type='submit'>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
