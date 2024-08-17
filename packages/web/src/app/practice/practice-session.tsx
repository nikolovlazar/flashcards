"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Category } from "@/lib/models";
import { Loader2, Play } from "lucide-react";
import { Suspense, useState } from "react";
import Flashcards from "./flashcards";

export default function Practice({ categories }: { categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0],
  );
  const [sessionStarted, setSessionStarted] = useState(false);

  return (
    <div className="flex flex-col items-center justify-start gap-12">
      <Card>
        <CardContent className="flex items-center p-6 gap-6">
          <Select
            defaultValue={categories[0].slug}
            value={selectedCategory.slug}
            onValueChange={(slug) =>
              setSelectedCategory(categories.find((c) => c.slug === slug)!)
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      {sessionStarted ? (
        <Suspense fallback={<Loader2 className="animate animate-spin" />}>
          <Flashcards category={selectedCategory} />
        </Suspense>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                aria-label="Start practice session"
                onClick={() => setSessionStarted(true)}
              >
                <Play className="h-4 w-4 mr-2" />
                Start practice session
              </Button>
            </TooltipTrigger>
            <TooltipContent>Start practice session</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
