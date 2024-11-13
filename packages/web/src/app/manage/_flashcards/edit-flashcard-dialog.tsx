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
import { type ReactNode, useState } from 'react';
import type { FlashcardColumn } from './flashcards-columns';
import { HiddenInput } from '@/components/ui/hidden-input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function EditFlashcard({
  flashcard,
  categories,
  children,
}: {
  flashcard: FlashcardColumn;
  categories: Category[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const res = await fetch(`/api/flashcards/${flashcard.id}`, {
      method: 'PATCH',
      body: formData,
    });

    if (res.ok) {
      toast.success('Flashcard updated');
      setOpen(false);
      router.refresh();
    } else {
      const message = await res.text();
      toast.error(message);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<Category>(
    flashcard.category
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='gap-6'>
        <DialogHeader>
          <DialogTitle>Edit {flashcard.question}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          id='edit-flashcard'
          className='grid gap-4'
        >
          <HiddenInput name='id' value={`${flashcard.id}`} />
          <div className='grid gap-2'>
            <Label htmlFor='question'>Question</Label>
            <Input
              id='question'
              name='question'
              defaultValue={flashcard.question}
              placeholder={flashcard.question}
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='answer'>Answer</Label>
            <Textarea
              id='answer'
              name='answer'
              required
              placeholder={flashcard.answer}
              defaultValue={flashcard.answer}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='answer'>Add to category</Label>
            <input
              name='category_id'
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
          <Button form='edit-flashcard' type='submit'>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
