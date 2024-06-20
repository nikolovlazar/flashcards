'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Flashcard, Category } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import EditFlashcard from './edit-flashcard-dialog';
import ConfirmDelete from './confirm-flashcard-delete';

export type FlashcardColumn = Omit<Flashcard, 'categoryId'> & {
  category: Category;
};

export const generateFlashcardsColumns: (
  categories: Category[]
) => ColumnDef<FlashcardColumn>[] = (categories) => [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'question',
    header: 'Question',
  },
  {
    accessorKey: 'answer',
    header: 'Answer',
    cell: ({ getValue }) => <p className=''>{getValue() as string}</p>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const flashcard = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-3 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <EditFlashcard flashcard={flashcard} categories={categories}>
              <DropdownMenuItem
                className='cursor-pointer'
                onSelect={(e) => e.preventDefault()}
              >
                Edit
              </DropdownMenuItem>
            </EditFlashcard>
            <ConfirmDelete flashcard={flashcard}>
              <DropdownMenuItem
                className='cursor-pointer text-red-500'
                onSelect={(e) => e.preventDefault()}
              >
                Delete
              </DropdownMenuItem>
            </ConfirmDelete>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
