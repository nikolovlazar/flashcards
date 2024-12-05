"use client";

import { useEffect, useMemo, useState } from "react";
import { shuffleArray } from "../../../utils/array";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowBigRight, RotateCcw } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Category, Flashcard } from "@/lib/models";

interface FlashcardsProps {
  category: Category;
}

export default function Flashcards({ category }: FlashcardsProps) {
  // Type-safe query result
  const { data } = useSuspenseQuery<Flashcard[]>({
    queryKey: [`${category.slug}-flashcards`],
    queryFn: async () => {
      const response = await fetch(
        `/api/categories/${category.id}/flashcards`,
        { cache: "no-store" },
      );
      const data = await response.json();
      return data.flashcards;
    },
  });

  // Ensure data is not undefined and handle empty arrays
  const flashcards = data ?? [];

  // Move shuffling logic to a separate effect to avoid state updates during render
  const [displayedFlashcards, setDisplayedFlashcards] = useState<Flashcard[]>([]);
  const [step, setStep] = useState(0);

  // Handle shuffling in an effect
  useEffect(() => {
    if (flashcards.length > 0) {
      setDisplayedFlashcards(shuffleArray([...flashcards]));
      setStep(0);
    }
  }, [flashcards]);

  // Reset step when category changes
  useEffect(() => {
    setStep(0);
  }, [category]);

  const nextStep = () => {
    if (step === displayedFlashcards.length - 1) {
      setStep(0);
      return;
    }
    setStep((s) => s + 1);
  };

  // Show loading state if no flashcards are available
  if (!displayedFlashcards.length) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Loading flashcards...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Safe access to current flashcard
  const currentFlashcard = displayedFlashcards[step];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{currentFlashcard.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value={currentFlashcard.slug}>
            <AccordionTrigger>Reveal answer</AccordionTrigger>
            <AccordionContent>
              {currentFlashcard.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="justify-between">
        <div>
          {step + 1} / {displayedFlashcards.length}
        </div>
        <Button onClick={nextStep} variant="outline" size="icon">
          {step === displayedFlashcards.length - 1 ? (
            <RotateCcw />
          ) : (
            <ArrowBigRight />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
