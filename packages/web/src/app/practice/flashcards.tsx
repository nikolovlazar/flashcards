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

export default function Flashcards({ category }: { category: Category }) {
  const { data } = useSuspenseQuery({
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

  const flashcards = (data as Flashcard[]) || [];

  const displayedFlashcards = useMemo(
    () => flashcards.length > 0 ? shuffleArray(flashcards) : [],
    [flashcards],
  );

  // Early return if no flashcards
  if (displayedFlashcards.length === 0) {
    return (
      <Card className="w-full max-w-md p-6 text-center">
        <p>No flashcards available for this category.</p>
      </Card>
    );
  }
  
  const [step, setStep] = useState(0);


  const nextStep = () => {
    if (step === displayedFlashcards.length - 1) {
      setStep(0);
      return;
    }
    setStep((s) => s + 1);
  };

  // Reset step when category or flashcards change
  useEffect(() => {
    setStep(0);
  }, [category, displayedFlashcards]);

  const currentFlashcard = displayedFlashcards[step];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{currentFlashcard?.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem 
            value={currentFlashcard?.slug || 'answer'}
          >
            <AccordionTrigger>Reveal answer</AccordionTrigger>
            <AccordionContent>
              {currentFlashcard?.answer}
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
