import { Card } from '@prisma/client';

export const cards: Card[] = [
  {
    id: 1,
    question: 'What is React?',
    answer: 'A JavaScript library for building user interfaces',
    categoryId: 1,
    slug: 'what-is-react',
  },
  {
    id: 2,
    question: 'What is a component?',
    answer: 'A component is a function that returns a React element',
    categoryId: 1,
    slug: 'what-is-a-component',
  },
  {
    id: 3,
    question: 'What is a hook?',
    answer: 'A hook is a function that lets you “hook into” React features',
    categoryId: 1,
    slug: 'what-is-a-hook',
  },
  {
    id: 4,
    question: 'What is a state?',
    answer:
      'State is a JavaScript object that stores a component’s dynamic data and determines the component’s behavior',
    categoryId: 1,
    slug: 'what-is-a-state',
  },
  {
    id: 5,
    question: 'What is a closure?',
    answer:
      'A closure is a function that remembers its outer variables and can access them',
    categoryId: 2,
    slug: 'what-is-a-closure',
  },
  {
    id: 6,
    question: 'What is a callback?',
    answer:
      'A callback is a function passed as an argument to another function',
    categoryId: 2,
    slug: 'what-is-a-callback',
  },
  {
    id: 7,
    question: 'What is a promise?',
    answer:
      'A promise is an object that may produce a single value some time in the future',
    categoryId: 2,
    slug: 'what-is-a-promise',
  },
  {
    id: 8,
    question: 'What is a discriminated union?',
    answer:
      'A discriminated union is a union type that has a common property that identifies which type it is',
    categoryId: 3,
    slug: 'what-is-a-discriminated-union',
  },
  {
    id: 9,
    question: 'What is a type guard?',
    answer:
      'A type guard is a function that checks whether a value is of a specific type',
    categoryId: 3,
    slug: 'what-is-a-type-guard',
  },
  {
    id: 10,
    question: 'What is Node.js?',
    answer:
      'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser',
    categoryId: 4,
    slug: 'what-is-nodejs',
  },
  {
    id: 11,
    question: 'What are node modules?',
    answer:
      'Node modules are JavaScript libraries that can be imported into a Node.js application',
    categoryId: 4,
    slug: 'what-are-node-modules',
  },
  {
    id: 12,
    question: 'What is flexbox?',
    answer:
      'Flexbox is a CSS layout mode that makes it easier to design flexible responsive layout structure without using float or positioning',
    categoryId: 5,
    slug: 'what-is-flexbox',
  },
  {
    id: 13,
    question: 'What is a grid?',
    answer: 'A grid is a two-dimensional arrangement of elements',
    categoryId: 5,
    slug: 'what-is-a-grid',
  },
  {
    id: 14,
    question: 'What is a CSS selector?',
    answer:
      'A CSS selector is a pattern used to select the element(s) you want to style',
    categoryId: 5,
    slug: 'what-is-a-css-selector',
  },
];
