# 🚀 Production Deployment Checklist

**Project:** CozyCommerce-Lite v2.0.0
**Date:** 2025-11-09
**Status:** Pre-Production Verification

---

## ⚡ CRITICAL PATH TO PRODUCTION

### Phase 1: Security (MUST DO FIRST) 🔴

#### 1.1 Credential Rotation
- [ ] **Rotate Supabase Credentials**
  ```bash
  # 1. Go to Supabase Dashboard
  # https://app.supabase.com/project/smbdlxkgidxtvfouowpt/settings/api

  # 2. Reset Database Password
  # 3. Generate new Service Role Key
  # 4. Update .env.local with new credentials
  ```

- [ ] **Generate New NextAuth Secret**
  ```bash
  openssl rand -base64 32
  # Copy output to .env.local NEXTAUTH_SECRET
  ```

- [ ] **Remove .env.local from Git History**
  ```bash
  # Install BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/

  # Clone a fresh copy (backup)
  git clone --mirror https://github.com/CozyCommerce/cozycommerce-lite.git

  # Remove .env.local from history
  bfg --delete-files .env.local cozycommerce-lite.git

  # Clean up
  cd cozycommerce-lite.git
  git reflog expire --expire=now --all
  git gc --prune=now --aggressive
  git push
  ```

#### 1.2 Environment Configuration
- [ ] **Copy Environment Template**
  ```bash
  cp .env.example .env.local
  ```

- [ ] **Fill Required Variables**
  ```env
  # Database (REQUIRED)
  DATABASE_URL="postgresql://NEW_USER:NEW_PASSWORD@..."

  # NextAuth (REQUIRED)
  NEXTAUTH_URL="https://yourdomain.com"
  NEXTAUTH_SECRET="[NEW_SECRET_FROM_OPENSSL]"

  # Admin Emails (REQUIRED)
  ADMIN_EMAILS="admin@yourdomain.com"

  # OAuth Providers (REQUIRED for social login)
  GOOGLE_CLIENT_ID="..."
  GOOGLE_CLIENT_SECRET="..."
  GITHUB_ID="..."
  GITHUB_SECRET="..."

  # Stripe (REQUIRED for payments)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
  STRIPE_SECRET_KEY="sk_live_..."
  STRIPE_WEBHOOK_SECRET="whsec_..."

  # Cloudinary (REQUIRED for image uploads)
  CLOUDINARY_CLOUD_NAME="..."
  CLOUDINARY_API_KEY="..."
  CLOUDINARY_API_SECRET="..."
  ```

---

### Phase 2: Database Migration 🟡

#### 2.1 Backup Current Database
```bash
# Export current database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
ls -lh backup_*.sql
```

#### 2.2 Run Prisma Migration
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name comprehensive_cms_and_fixes

# If migration fails, restore backup:
# psql $DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql
```

#### 2.3 Run Data Transformation SQL
Execute the following SQL in your database:

```sql
-- 1. Update Review table: sync isApproved with status
UPDATE "Review"
SET "isApproved" = ("status" = 'APPROVED')
WHERE "isApproved" IS NULL;

-- 2. Update Review table: add productSlug from Product
UPDATE "Review" r
SET "productSlug" = p.slug
FROM "Product" p
WHERE r."productId" = p.id
AND r."productSlug" IS NULL;

-- 3. Update Review table: sync ratings with rating
UPDATE "Review"
SET "ratings" = "rating"
WHERE "ratings" IS NULL;

-- 4. Update Product table: sync title with name
UPDATE "Product"
SET "title" = "name"
WHERE "title" IS NULL OR "title" = '';

-- 5. Update Product table: sync discountedPrice with comparePrice
UPDATE "Product"
SET "discountedPrice" = "comparePrice"
WHERE "discountedPrice" IS NULL;

-- 6. Update Product table: create shortDescription from description
UPDATE "Product"
SET "shortDescription" = LEFT("description", 200) || '...'
WHERE "shortDescription" IS NULL OR "shortDescription" = '';

-- 7. Update Category table: sync title with name
UPDATE "Category"
SET "title" = "name"
WHERE "title" IS NULL OR "title" = '';

-- 8. Update Category table: sync img with image
UPDATE "Category"
SET "img" = "image"
WHERE "img" IS NULL;

-- 9. Create default HeaderSetting
INSERT INTO "HeaderSetting" ("id", "logoText", "headerText", "createdAt", "updatedAt")
VALUES (
  'default-header',
  'CozyCommerce',
  'Get free delivery on orders over $100',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- 10. Create default FooterSetting
INSERT INTO "FooterSetting" ("id", "copyright", "createdAt", "updatedAt")
VALUES (
  'default-footer',
  '© 2025 CozyCommerce. All rights reserved.',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;
```

#### 2.4 Verify Migration
```bash
# Regenerate Prisma Client
npx prisma generate

# Check database schema
npx prisma db pull

# Validate schema
npx prisma validate
```

---

### Phase 3: Build & Test 🟢

#### 3.1 Test Build
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build project
npm run build

# Expected output: ✓ Compiled successfully
```

#### 3.2 Test Development Server
```bash
# Start dev server
npm run dev

# Visit: http://localhost:3000

# Test checklist:
# [ ] Homepage loads
# [ ] Products display
# [ ] Categories work
# [ ] Reviews show
# [ ] No console errors
```

#### 3.3 Test Authentication
```bash
# Visit: http://localhost:3000/auth/signin

# Test:
# [ ] Google OAuth (if configured)
# [ ] GitHub OAuth (if configured)
# [ ] Email/Password login works
# [ ] Protected routes redirect to signin
# [ ] Admin routes check role
```

#### 3.4 Test API Routes
```bash
# Test Products API
curl http://localhost:3000/api/products?limit=5

# Test Reviews API
curl "http://localhost:3000/api/review?productSlug=test-product"

# Expected: JSON responses, no errors
```

---

### Phase 4: Third-Party Setup 🔵

#### 4.1 Configure OAuth Providers

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create New OAuth App
3. Add callback URL: `https://yourdomain.com/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

#### 4.2 Configure Stripe

1. **Get API Keys**
   - Visit [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy Publishable Key and Secret Key
   - Add to `.env.local`

2. **Set Up Webhook**
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to send:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
   - Copy webhook signing secret to `.env.local`

#### 4.3 Configure Cloudinary

1. Visit [Cloudinary Console](https://cloudinary.com/console)
2. Copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add to `.env.local`

---

### Phase 5: Production Configuration ⚙️

#### 5.1 Update next.config.js

```javascript
// Uncomment HSTS header for production
{
  key: "Strict-Transport-Security",
  value: "max-age=31536000; includeSubDomains; preload",
}
```

#### 5.2 Set Production Environment Variables

In your hosting platform (Vercel, AWS, etc.):

```env
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://...
# ... (all other env vars from .env.local)
```

#### 5.3 Configure DNS & SSL

- [ ] Point domain to hosting provider
- [ ] Configure SSL certificate (auto with Vercel)
- [ ] Verify HTTPS works

---

### Phase 6: Deployment 🚀

#### 6.1 Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Expected output:
# ✓ Production: https://yourdomain.vercel.app
```

#### 6.2 Alternative: Docker Deployment

```dockerfile
# Dockerfile (create if needed)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t cozycommerce .
docker run -p 3000:3000 --env-file .env.local cozycommerce
```

---

### Phase 7: Post-Deployment Verification ✅

#### 7.1 Production Smoke Tests

- [ ] **Homepage** - https://yourdomain.com
  - Loads without errors
  - Products display correctly
  - Images load from Cloudinary

- [ ] **Authentication**
  - Google login works
  - GitHub login works
  - Email/password works
  - Session persists

- [ ] **Protected Routes**
  - `/account` requires login
  - `/admin` requires admin role
  - Unauthorized users redirected

- [ ] **API Routes**
  - `/api/products` returns products
  - `/api/review` returns reviews
  - Rate limiting works (test 100+ requests)

- [ ] **Stripe Integration**
  - Test payment succeeds
  - Webhook receives event
  - Order status updates

#### 7.2 Security Verification

- [ ] **Headers**
  ```bash
  curl -I https://yourdomain.com

  # Verify presence of:
  # X-Frame-Options: DENY
  # X-Content-Type-Options: nosniff
  # Content-Security-Policy: ...
  # Referrer-Policy: ...
  ```

- [ ] **Rate Limiting**
  ```bash
  # Test rate limit (should get 429 after 100 requests)
  for i in {1..110}; do curl https://yourdomain.com/api/products; done
  ```

- [ ] **SSL/TLS**
  - Visit https://www.ssllabs.com/ssltest/
  - Enter your domain
  - Expect: A or A+ rating

---

### Phase 8: Monitoring & Maintenance 📊

#### 8.1 Set Up Monitoring

**Recommended: Sentry**
```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

**Alternative: LogRocket**
```bash
npm install logrocket
```

#### 8.2 Configure Database Backups

**Supabase:** Auto-backups enabled

**Self-hosted:**
```bash
# Create daily backup cron job
0 2 * * * pg_dump $DATABASE_URL > /backups/cozycommerce_$(date +\%Y\%m\%d).sql
```

#### 8.3 Set Up Analytics

- [ ] Google Analytics 4
- [ ] Stripe Dashboard analytics
- [ ] Custom metrics (conversion rate, cart abandonment)

---

## 🎯 QUICK REFERENCE

### Estimated Time Requirements

| Phase | Time | Complexity |
|-------|------|------------|
| 1. Security | 1-2 hours | Medium |
| 2. Database | 30-60 min | Medium |
| 3. Build & Test | 30 min | Low |
| 4. Third-Party | 1-2 hours | Medium |
| 5. Production Config | 30 min | Low |
| 6. Deployment | 15-30 min | Low |
| 7. Verification | 1 hour | Medium |
| 8. Monitoring | 1-2 hours | Medium |
| **TOTAL** | **6-9 hours** | **Medium** |

### Critical Blockers

Must complete before going live:
1. ✅ Database migration
2. ✅ Credential rotation
3. ✅ OAuth providers configured
4. ✅ Stripe webhook configured
5. ✅ Build succeeds
6. ✅ Production env vars set

### Support Resources

- **Documentation:** See all `*.md` files in project root
- **Schema Migration:** [SCHEMA_MIGRATION_GUIDE.md](SCHEMA_MIGRATION_GUIDE.md)
- **Security:** [SECURITY_NOTICE.md](SECURITY_NOTICE.md)
- **Implementation:** [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)

---

## 📝 COMPLETION SIGN-OFF

```
Pre-Production Checklist Complete: [ ]

Signed: _________________
Date: ___________________

Ready for Production: [ ]

Approved By: _________________
Date: ___________________
```

---

**Last Updated:** 2025-11-09
**Version:** 2.0.0
**Status:** Ready for Deployment
