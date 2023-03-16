# Flashcards 🧠

Flashcards is a simple CRUD app that allows users to create their own flashcards and categories, and lets them practice by showing them the cards (can be by order or random). The goal of this app is to demonstrate Distributed Tracing in [Next.js](https://nextjs.org) using [Sentry](https://sentry.io/welcome).

## Running it locally

> ℹ️ Since this is a template repo, use it to create your own repo and clone that locally.

To get it up and running, first you'd need to rename the `.example.env` file to `.env` file. Then, you'd need to create and setup accounts on the following platforms:

- Sentry ([register here](https://sentry.io/welcome))
  - Sentry is an open source application monitoring platform. We're using Sentry in this project to implement distributed tracing.
  - Create an account and a project in order to obtain the DSN. Grab the DSN and replace the `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` values in your `.env` file.
- PlanetScale ([register here](https://planetscale.com))
  - PlanetScale is a serverless MySQL database.
  - Create an account and a database in order to obtain a connection string. Grab the connection string and replace the `DATABASE_URL` value in your `.env` file.
- Generate a random string for the `NEXTAUTH_SECRET` value.
  - It can include numbers and special characters as well.

Once you have the environment variables all set, you can proceed to install the dependencies by running `pnpm install`.

Then you'd need to setup your database, so follow these instructions:

1. Run `npx prisma generate` to generate the Prisma client based on the schema.
2. Run `npx prisma db push` to initialize your database branch.
3. Run `npx prisma db seed` to add demo data so you don't have to manually create the categories and flashcards.

When you're done with that, you can start the app locally by running `pnpm dev` and visiting [localhost:3000](http://localhost:3000).

You'll be met with a sign in screen. If you did the seed data, you can sign in with `admin@admin.com` as the email and `admin` as the password. Otherwise, you can create an account just by typing in your email and a passport. The "sign in" is actually "sign in / register".
