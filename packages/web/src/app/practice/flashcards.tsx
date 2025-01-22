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

  const flashcards = data as Flashcard[];

  const displayedFlashcards = useMemo(
    () => shuffleArray(flashcards),
    [flashcards],
  );
  const [step, setStep] = useState(0);

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

  if (!displayedFlashcards?.length) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>No flashcards</CardTitle>
        </CardHeader>
        <CardContent>No flashcards available for this category.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{displayedFlashcards[step].question}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value={displayedFlashcards[step].slug}>
            <AccordionTrigger>Reveal answer</AccordionTrigger>
            <AccordionContent>
              {displayedFlashcards[step].answer}
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
