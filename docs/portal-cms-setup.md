# ROMADI portal CMS setup

The portal is available at `/portal/login`; authenticated users are sent to
`/portal/dashboard`. There is deliberately no signup page or signup endpoint.

## 1. Apply the database migration

Link the repository to the intended Supabase project, review the generated
diff, and apply `supabase/migrations/20260919095052_portal_cms_security.sql`.
The migration:

- enables role-aware RLS for `projects`, `reviews`, and `pricing_plans`;
- stores CMS authorization only in the signed `app_metadata.role` claim;
- adds an append-only audit log with database triggers;
- adds an atomic, server-only login attempt limiter using hashed identifiers;
- does not create public views. Future public views must use
  `WITH (security_invoker = true)`.

## 2. Configure server environment variables

Set the values listed in `.env.example` in Netlify. `SUPABASE_SECRET_KEY`,
`TURNSTILE_SECRET_KEY`, and `PORTAL_RATE_LIMIT_SECRET` are server-only secrets
and must never use a `PUBLIC_` prefix.

Use a random value of at least 32 characters for `PORTAL_RATE_LIMIT_SECRET`.
Cloudflare's documented dummy keys are for local development and automated
tests only; they must never be used in production.

## 3. Disable public registration in Supabase

In Supabase Dashboard, open **Authentication → Sign In / Providers → Email**
and disable **Allow new users to sign up**. Also keep anonymous sign-ins off.
This project intentionally exposes no client or server signup path, but the
Supabase project setting is the authoritative control for direct Auth API
requests.

## 4. Create portal users through the Admin API

Create users only with a server-side Supabase Admin client. Put one of these
values in `app_metadata.role`:

- `admin` — read drafts and create/update CMS content;
- `super-admin` — the same access plus deletion and audit-log access.

Never put the authorization role in `user_metadata`; users can modify that
field themselves. Do not place credentials in migrations, source files, shell
arguments, or committed environment files.

## 5. Configure Turnstile

Create a Turnstile widget for the login form, restrict it to the production
hostnames, and set its public and secret keys in Netlify. The server validates
the token, expected `portal_login` action, and production hostname before
attempting authentication. Turnstile is paired with the Supabase-backed rate
limiter; it is not treated as a rate limiter by itself.
