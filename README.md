# Tachemaster

# Getting Started

## .env setup

Create a [Supabase](#supabase) account and populate these .env vars:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Running the development server

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Supabase

Supabase is used for authentication and database management in this project.

## Migrations

To run migrations, first you may need to run `npx supabase init`.
Then, you must login to supabase with `npx supabase login`
Then link this project with `npx supabase link`
Finally, to run the migrations, use `npx supabase db push`

Migrations can be added using:

```bash
npx supabase migration new name_of_table
```

To reset the database entirely and start over:

```bash
npx supabase db reset --linked
```

Database types can be generated from Supabase using:

```bash
npx supabase gen types typescript --project-id abcdefghijklmnopqrst > database.types.ts
```

For more info, visit [Supabase TypeScript Support](https://supabase.com/docs/reference/javascript/typescript-support)

## Auth Callback

`/app/auth/callback/route.ts` handles the authentication callback from Supabase. It exchanges an authorization code for the user's session and redirects the user to the appropriate URL. If a `redirect_to` parameter is provided in the query string, the user is redirected to that URL after the session is established. Otherwise, the user is redirected to a protected ("inside") route.

# Libraries Used

This project uses the following libraries:

## HeroUI - responsive UI component library

HeroUI is used for building responsive UI components.

### Installing individual components

`npx heroui-cli@latest add component-name-here`

For setup help, visit [HeroUI Next.js Setup](https://www.heroui.com/docs/frameworks/nextjs).

# Actions

`/actions.ts` handles user authentication, password reset, and email confirmation. It includes actions for signing up, signing in, signing out, and resetting passwords. These actions interact with Supabase for authentication and use Next.js for navigation and redirection.

# Middleware

`/middleware.ts` sets up the configuration for handling user sessions. It does this with updateSession() which runs on most requests to protect logged-in routes and ensure that session cookies can be read and written. The middleware checks the user's authentication status and redirects them appropriately based on the route they are trying to access.

# Testing

For testing and paths to work correctly, the mapped "paths" in tsconfig.json should match the "moduleNameMapper" paths in jest.config.ts

To run the tests
`npm run test`
or
`npm run test:watch`

To check for typescript compilation errors
`npx tsc --noEmit`

To lint
`npx eslint . --ext .ts,.tsx`
