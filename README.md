# Flashcards 🧠

Flashcards is a simple CRUD app that allows users to create their own flashcards and categories, and lets them practice by showing them the cards. This project is part of a workshop we're doing at [Sentry.io](https://sentry.io/welcome).

## Getting started

- `docker compose up --build`
- Create Sentry account
- Create a Sentry Next.js project
- Set up Sentry with the Next.js wizard: `npx @sentry/wizard@latest -i nextjs`
- Create a Sentry Django project
- Add Sentry's Django SDK in `requirements.txt`: `sentry-sdk[django]`
- Configure the [Sentry Django SDK](https://docs.sentry.io/platforms/python/integrations/django/#configure)
- Re-run `docker compose up --build` if needed

## Finding Bugs

- Test out all the features of the Flashcards app
- When you encounter an error or notice a performance issue, go check Sentry
- It's more than likely your error has been picked up by Sentry
  - Click on the issue in your dashboard to see in depth details about where the issue happened, who it affected and what led to it.
