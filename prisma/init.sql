-- CozyCommerce Database Initialization
-- This SQL creates all necessary tables for the e-commerce platform
-- Execute this in Supabase SQL Editor if prisma db push fails

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User & Authentication tables
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMP,
  image TEXT,
  password TEXT,
  role TEXT DEFAULT 'CUSTOMER',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Account" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  scope TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  UNIQUE(provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "Session" (
  id TEXT PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  UNIQUE(identifier, token)
);

-- Categories table
CREATE TABLE IF NOT EXISTS "Category" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  "parentId" TEXT REFERENCES "Category"(id),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS "Product" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL NOT NULL,
  "comparePrice" DECIMAL,
  "costPrice" DECIMAL,
  sku TEXT UNIQUE,
  barcode TEXT,
  quantity INTEGER DEFAULT 0,
  "trackInventory" BOOLEAN DEFAULT true,
  images TEXT[],
  thumbnail TEXT,
  "categoryId" TEXT NOT NULL REFERENCES "Category"(id),
  tags TEXT[],
  status TEXT DEFAULT 'DRAFT',
  featured BOOLEAN DEFAULT false,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "publishedAt" TIMESTAMP
);

-- Product Variants table
CREATE TABLE IF NOT EXISTS "ProductVariant" (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  price DECIMAL NOT NULL,
  quantity INTEGER DEFAULT 0,
  image TEXT,
  options JSONB,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Cart table
CREATE TABLE IF NOT EXISTS "Cart" (
  id TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Cart Items table
CREATE TABLE IF NOT EXISTS "CartItem" (
  id TEXT PRIMARY KEY,
  "cartId" TEXT NOT NULL REFERENCES "Cart"(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"(id),
  quantity INTEGER DEFAULT 1,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("cartId", "productId")
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS "Wishlist" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "productId")
);

-- Orders table
CREATE TABLE IF NOT EXISTS "Order" (
  id TEXT PRIMARY KEY,
  "orderNumber" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id),
  subtotal DECIMAL NOT NULL,
  tax DECIMAL DEFAULT 0,
  shipping DECIMAL DEFAULT 0,
  discount DECIMAL DEFAULT 0,
  total DECIMAL NOT NULL,
  status TEXT DEFAULT 'PENDING',
  "paymentStatus" TEXT DEFAULT 'PENDING',
  "fulfillmentStatus" TEXT DEFAULT 'UNFULFILLED',
  "paymentMethod" TEXT,
  "paymentIntentId" TEXT,
  "shippingAddress" JSONB NOT NULL,
  "billingAddress" JSONB,
  "trackingNumber" TEXT,
  "shippingCarrier" TEXT,
  "customerNote" TEXT,
  "internalNote" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "paidAt" TIMESTAMP,
  "shippedAt" TIMESTAMP,
  "deliveredAt" TIMESTAMP,
  "cancelledAt" TIMESTAMP
);

-- Order Items table
CREATE TABLE IF NOT EXISTS "OrderItem" (
  id TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"(id),
  quantity INTEGER NOT NULL,
  price DECIMAL NOT NULL,
  total DECIMAL NOT NULL,
  "productSnapshot" JSONB,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS "Review" (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  title TEXT,
  comment TEXT,
  verified BOOLEAN DEFAULT false,
  helpful INTEGER DEFAULT 0,
  status TEXT DEFAULT 'PENDING',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("productId", "userId")
);

-- Address table
CREATE TABLE IF NOT EXISTS "Address" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  company TEXT,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  "zipCode" TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  "isDefault" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS "Product_slug_idx" ON "Product"(slug);
CREATE INDEX IF NOT EXISTS "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE INDEX IF NOT EXISTS "CartItem_cartId_idx" ON "CartItem"("cartId");
CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"(status);
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "Review_productId_idx" ON "Review"("productId");
CREATE INDEX IF NOT EXISTS "Review_userId_idx" ON "Review"("userId");
CREATE INDEX IF NOT EXISTS "Address_userId_idx" ON "Address"("userId");

-- Sample data
INSERT INTO "Category" (id, name, slug, description) VALUES
  ('cat1', 'Electronics', 'electronics', 'Electronic devices and gadgets'),
  ('cat2', 'Clothing', 'clothing', 'Apparel and fashion items'),
  ('cat3', 'Home & Garden', 'home-garden', 'Home and garden products')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "Product" (id, name, slug, description, price, "categoryId", status, featured) VALUES
  ('prod1', 'Wireless Headphones', 'wireless-headphones', 'High-quality wireless headphones with noise cancellation', 129.99, 'cat1', 'ACTIVE', true),
  ('prod2', 'Cotton T-Shirt', 'cotton-tshirt', 'Comfortable 100% cotton t-shirt', 24.99, 'cat2', 'ACTIVE', false),
  ('prod3', 'LED Table Lamp', 'led-table-lamp', 'Modern LED table lamp with adjustable brightness', 49.99, 'cat3', 'ACTIVE', true)
ON CONFLICT (slug) DO NOTHING;
