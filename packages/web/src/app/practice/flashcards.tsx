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
import { FlashcardsResponse } from "@/lib/types/api";
import { Category, Flashcard } from "@/lib/models";
import { isValidFlashcardArray } from "@/utils/type-guards";

export default function Flashcards({ category }: { category: Category }) {
  const { data } = useSuspenseQuery({
    queryKey: [`${category.slug}-flashcards`],
    queryFn: async () => {
      const response = await fetch(
        `/api/categories/${category.id}/flashcards`,
        { cache: "no-store" },
      );
      const result = await response.json() as FlashcardsResponse;
      
      if (!result?.flashcards || !isValidFlashcardArray(result.flashcards)) {
        throw new Error('Invalid flashcard data received');
      }
      return result.flashcards;
    },
  });

  const flashcards = data;

  const displayedFlashcards = useMemo(
    () => shuffleArray(flashcards),
    [flashcards],
  );
  
  const [step, setStep] = useState(() => 0);
  
  // Handle empty flashcards case
  if (!displayedFlashcards.length) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>No flashcards available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const nextStep = () => {
    if (step === displayedFlashcards.length - 1) {
      setStep(0);
      return;
    }
    setStep((s) => s + 1);
  };

  useEffect(() => {
    setStep(0);
  }, [category]);

  const currentStep = Math.min(step, displayedFlashcards.length - 1);
  const currentCard = displayedFlashcards[currentStep];

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
          {currentStep + 1} / {displayedFlashcards.length}
        </div>
        <Button onClick={nextStep} variant="outline" size="icon">
          {currentStep === displayedFlashcards.length - 1 ? (
            <RotateCcw />
          ) : (
            <ArrowBigRight />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
