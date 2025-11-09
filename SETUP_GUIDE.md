# CozyCommerce Setup Guide

## Database Connection Issue Resolution

Your Supabase database uses **IPv6-only** direct connection, which may not be accessible from all networks. The solution is to use the **Supabase Connection Pooler** or access the database through Supabase's web interface to initialize the schema.

## Critical Configuration

### 1. Update DATABASE_URL in .env.local

Your `.env.local` must contain EXACTLY this format (replace password with your actual password):

```bash
DATABASE_URL="postgresql://postgres.smbdlxkgidxtvfouowpt:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres?schema=public"
```

**Key points:**
- Use the **pooler endpoint** (`aws-0-us-east-1.pooler.supabase.com`)
- User format: `postgres.PROJECT_REF` NOT `postgres`
- Port: `5432` for Session mode (required for Prisma migrations)
- Include `?schema=public` parameter

### 2. Database Initialization Options

#### Option A: Via Supabase Web Console (Recommended for Initial Setup)

1. Go to https://supabase.com/dashboard/project/smbdlxkgidxtvfouowpt
2. Click **SQL Editor** → **New Query**
3. Copy the SQL migration from `/prisma/migrations/[latest]/migration.sql`
4. Execute in Supabase console

#### Option B: Using Prisma (Once connection is working)

```bash
npx prisma migrate deploy
```

#### Option C: Create Migration Locally

```bash
npx prisma migrate dev --name init
```

## Next Steps

1. **Verify connection string** in Supabase Settings > Database > Connection string
2. **Update DATABASE_URL** in `.env.local` with exact format above
3. **Test connection**:
   ```bash
   npx prisma db execute --stdin < prisma/schema.prisma
   ```
4. **Run migrations**:
   ```bash
   npx prisma db push
   ```

## Troubleshooting

- **"FATAL: Tenant or user not found"**: Wrong user format or pooler endpoint
- **Connection timeout**: Use pooler (`aws-0-*`) not direct connection
- **IPv6 issues**: Ensure pooler endpoint is used (has IPv4 support)

## Environment Variables Required

```bash
# Database
DATABASE_URL="postgresql://postgres.smbdlxkgidxtvfouowpt:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres?schema=public"

# Supabase API
NEXT_PUBLIC_SUPABASE_URL="https://smbdlxkgidxtvfouowpt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generated-secret>"

# Payment & Services
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="<stripe-key>"
STRIPE_SECRET_KEY="<stripe-key>"
CLOUDINARY_CLOUD_NAME="<cloudinary-name>"
NEXT_PUBLIC_ALGOLIA_APP_ID="<algolia-id>"
```
