# StockFlow SaaS v1 (Supabase + Vercel)

Production-ready starter: Inventory + Movements + Form Builder + Public Forms + Tasks + Reports + Auth (Email OTP).

## Deploy (No local install)
1. Create Supabase project → open SQL editor → run `supabase/schema.sql`
2. Create a new GitHub repo and upload this folder
3. On Vercel → New Project → import the repo
4. Add Environment Variables:
   - `VITE_SUPABASE_URL` = <your supabase url>
   - `VITE_SUPABASE_ANON_KEY` = <your anon key>
5. Deploy. Done.

Pages: `/` (Dashboard), `/products`, `/movements`, `/templates`, `/builder`, `/publish`, `/tasks`, `/reports`, `/p/:slug`
