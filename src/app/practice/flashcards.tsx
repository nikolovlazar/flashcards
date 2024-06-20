'use client';

import { Category, Flashcard } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import { shuffleArray } from '../../../utils/array';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowBigRight, RotateCcw } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function Flashcards({ category }: { category: Category }) {
  const { data } = useSuspenseQuery({
    queryKey: [`${category.slug}-flashcards`],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${category.id}/flashcards`);
      return await response.json();
    },
  });

  const flashcards = data.flashcards as Flashcard[];

  const displayedFlashcards = useMemo(
    () => shuffleArray(flashcards),
    [flashcards]
  );
  const [answerShown, setAnswerShown] = useState(false);
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step === displayedFlashcards.length - 1) {
      setAnswerShown(false);
      setStep(0);
      return;
    }
    setAnswerShown(false);
    setStep((s) => s + 1);
  };

  useEffect(() => {
    setAnswerShown(false);
    setStep(0);
  }, [category]);

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>{displayedFlashcards[step].question}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          value={answerShown ? displayedFlashcards[step].slug : undefined}
          onValueChange={(value) => setAnswerShown(!!value)}
          type='single'
          collapsible
        >
          <AccordionItem value={displayedFlashcards[step].slug}>
            <AccordionTrigger>Reveal answser</AccordionTrigger>
            <AccordionContent>
              {answerShown && displayedFlashcards[step].answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className='justify-between'>
        <div>
          {step + 1} / {displayedFlashcards.length}
        </div>
        <Button
          onClick={nextStep}
          disabled={!answerShown}
          variant='outline'
          size='icon'
        >
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
