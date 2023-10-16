# Flashcards 🧠

Flashcards is a simple CRUD app that allows users to create their own flashcards and categories, and lets them practice by showing them the cards (can be by order or random). The goal of this app is to demonstrate Distributed Tracing in [Next.js](https://nextjs.org) using [Sentry](https://sentry.io/welcome).

## Running it locally

To get it up and running, first you'd need to rename the `.example.env` file to `.env` file. Then, you'd need to replace your `DATABASE_URL` value. You can use any MySQL service (like [Cloud SQL](https://cloud.google.com/sql) or [PlanetScale](https://planetscale.com/)), or spin up a local MySQL instance. For the `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` paste your project's DSN string. For the `NEXTAUTH_SECRET` value you can use a random string generator. The value can also contain numbers and special characters. The Sentry values aren't required to run the app, so you can skip them for now.

Once you have the environment variables set, you can proceed to install the dependencies by running `pnpm install`.

Then you'd need to setup your database, so follow these instructions:

1. Run `npx prisma generate` to generate the Prisma client based on the schema.
2. Run `npx prisma db push` to initialize your database branch.
3. Run `npx prisma db seed` to add demo data so you don't have to manually create the categories and flashcards.

When you're done with that, you can start the app locally by running `pnpm dev` and visiting [localhost:3000](http://localhost:3000).

You'll be met with a sign in screen. If you did the seed data, you can sign in with `admin@admin.com` as the email and `admin` as the password. Otherwise, you can create an account just by typing in your email and a password. The "sign in" is actually "sign in or register".
