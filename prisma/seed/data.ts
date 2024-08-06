import { faker } from "@faker-js/faker";
import slugify from "slugify";

export const categories = Array(40)
  .fill(0)
  .map((_, i) => {
    const name = faker.company.name();
    const slug = slugify(name, { lower: true });
    return {
      id: i,
      name,
      slug,
    };
  });

export const flashcards = Array(250)
  .fill(0)
  .map((_, i) => {
    const question = faker.commerce.productName();
    const slug = slugify(question, { lower: true });
    const categoryId = faker.number.int({ min: 0, max: categories.length - 1 });
    const answer = faker.commerce.department();

    return {
      id: i,
      question,
      answer,
      categoryId,
      slug,
    };
  });
