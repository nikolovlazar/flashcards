"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import EditCategory from "./edit-category-dialog";
import ConfirmDelete from "./confirm-category-delete";
import { Category } from "@/lib/models";

export const categoriesColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "ID",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-3 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditCategory category={category}>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                Edit
              </DropdownMenuItem>
            </EditCategory>
            <ConfirmDelete category={category}>
              <DropdownMenuItem
                className="cursor-pointer text-red-500"
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
