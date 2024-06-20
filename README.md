# Flashcards 🧠

Flashcards is a simple CRUD app that allows users to create their own flashcards and categories, and lets them practice by showing them the cards (can be by order or random). The goal of this app is to demonstrate Distributed Tracing in [Next.js](https://nextjs.org) using [Sentry](https://sentry.io/welcome).

## Getting started
- `npm install`
- `cp .example.env .env`
- `npx prisma migrate reset`
- Create Sentry account
- Create Sentry project "flashcards"
- Add project DSN (Sentry Settings -> Project -> DSN) to the `.env`

## Finding Bugs
- Test out all the features of the Flashcards app
- When you encounter an error or notice a performance issue, go check Sentry
- It's more than likely your error has been picked up by Sentry
  - Click on the issue in your dashboard to see in depth details about where the issue happened, who it affected and what led to it.
