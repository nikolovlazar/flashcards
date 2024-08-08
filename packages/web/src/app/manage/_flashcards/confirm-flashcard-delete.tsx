"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, type ReactNode } from "react";
import { FlashcardColumn } from "./flashcards-columns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function ConfirmDelete({
  flashcard,
  children,
}: {
  flashcard: FlashcardColumn;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await fetch(`/api/flashcards/${flashcard.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Flashcard deleted");
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
            Are you sure you want to delete the &quot;{flashcard.question}&quot;
            flashcard?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            flashcard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/80"
          >
            {isDeleting ? <Loader className="animate-spin" /> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
