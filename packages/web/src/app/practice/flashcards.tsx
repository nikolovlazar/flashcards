"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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

// Validation function for flashcard data
const isValidFlashcard = (card: any): card is Flashcard => {
  return (
    typeof card === 'object' &&
    card !== null &&
    typeof card.id === 'number' &&
    typeof card.question === 'string' &&
    typeof card.answer === 'string' &&
    typeof card.slug === 'string' &&
    typeof card.category_id === 'number'
  );
};

// Validation function for flashcards array
const validateFlashcards = (data: any): Flashcard[] => {
  if (!Array.isArray(data)) {
    throw new Error('Invalid flashcards data: expected an array');
  }
  
  if (!data.every(isValidFlashcard)) {
    throw new Error('Invalid flashcards data: invalid flashcard format');
  }
  
  return data;
};

export default function Flashcards({ category }: { category: Category }) {
  const { data } = useSuspenseQuery({
    queryKey: [`${category.slug}-flashcards`],
    queryFn: async () => {
      const response = await fetch(
        `/api/categories/${category.id}/flashcards`,
        { cache: "no-store" },
      );
      const responseData = await response.json();
      return validateFlashcards(responseData.flashcards);
    },
  });

  const flashcards = data;

  const displayedFlashcards = useMemo(
    () => shuffleArray(flashcards),
    [flashcards],
  );
  
  const [step, setStep] = useState(0);

  // Ensure step stays within bounds
  useEffect(() => {
    if (displayedFlashcards.length === 0) {
      setStep(0);
    } else if (step >= displayedFlashcards.length) {
      setStep(displayedFlashcards.length - 1);
    }
  }, [displayedFlashcards.length, step]);

  const nextStep = useCallback(() => {
    if (step === displayedFlashcards.length - 1) {
      setStep(0);
      return;
    }
    setStep((s) => s + 1);
  }, [step, displayedFlashcards.length]);

  useEffect(() => {
    setStep(0);
  }, [category]);

  if (!displayedFlashcards.length) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>No flashcards available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There are no flashcards available for this category.</p>
        </CardContent>
      </Card>
    );
  }

  const currentCard = displayedFlashcards[step];
  if (!currentCard) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{currentCard.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value={currentCard.slug}>
            <AccordionTrigger>Reveal answer</AccordionTrigger>
            <AccordionContent>
              {currentCard.answer}
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
