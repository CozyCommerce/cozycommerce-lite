/**
 * Central validation schemas using Zod
 * All API routes and forms should use these schemas for input validation
 */

import { z } from 'zod';

// ============================================
// COMMON SCHEMAS
// ============================================

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must not exceed 255 characters');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(255, 'Slug must not exceed 255 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const urlSchema = z.string().url('Invalid URL format');

export const positiveNumberSchema = z
  .number()
  .positive('Must be a positive number')
  .finite('Must be a finite number');

export const nonNegativeNumberSchema = z
  .number()
  .nonnegative('Must be a non-negative number')
  .finite('Must be a finite number');

// ============================================
// USER & AUTH SCHEMAS
// ============================================

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: emailSchema.optional(),
  image: urlSchema.optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ============================================
// PRODUCT SCHEMAS
// ============================================

export const productVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().optional(),
  price: positiveNumberSchema,
  quantity: nonNegativeNumberSchema.int(),
  image: z.string(),
  color: z.string(),
  size: z.string(),
  isDefault: z.boolean().default(false),
  options: z.record(z.string(), z.any()),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  title: z.string().min(1).max(255),
  slug: slugSchema,
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().min(10).max(500),
  price: positiveNumberSchema,
  comparePrice: positiveNumberSchema.optional(),
  discountedPrice: positiveNumberSchema.optional(),
  cost Price: positiveNumberSchema.optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  quantity: nonNegativeNumberSchema.int(),
  trackInventory: z.boolean().default(true),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  thumbnail: z.string().url().optional(),
  categoryId: z.string().cuid(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  productVariants: z.array(productVariantSchema).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const productFilterSchema = z.object({
  categoryId: z.string().cuid().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  featured: z.boolean().optional(),
  minPrice: positiveNumberSchema.optional(),
  maxPrice: positiveNumberSchema.optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['price', 'createdAt', 'updatedAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// CATEGORY SCHEMAS
// ============================================

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  title: z.string().min(1).max(100),
  slug: slugSchema,
  description: z.string().optional(),
  image: z.string().url().optional(),
  img: z.string().url().optional(),
  parentId: z.string().cuid().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// ============================================
// CART SCHEMAS
// ============================================

export const addToCartSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be at least 1').max(99, 'Quantity cannot exceed 99'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().max(99),
});

export const removeFromCartSchema = z.object({
  productId: z.string().cuid(),
});

// ============================================
// ORDER SCHEMAS
// ============================================

export const shippingAddressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  zipCode: z.string().min(1, 'ZIP/Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: phoneSchema.optional(),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  billingAddress: shippingAddressSchema.optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  customerNote: z.string().max(500).optional(),
});

export const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED']).optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED']).optional(),
  fulfillmentStatus: z.enum(['UNFULFILLED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'RETURNED']).optional(),
  trackingNumber: z.string().optional(),
  shippingCarrier: z.string().optional(),
  internalNote: z.string().optional(),
});

// ============================================
// REVIEW SCHEMAS
// ============================================

export const createReviewSchema = z.object({
  productId: z.string().cuid(),
  productSlug: slugSchema,
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must not exceed 5'),
  ratings: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000).optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  ratings: z.number().int().min(1).max(5).optional(),
  title: z.string().max(100).optional(),
  comment: z.string().min(10).max(1000).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  isApproved: z.boolean().optional(),
});

export const getReviewsSchema = z.object({
  productSlug: slugSchema,
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  isApproved: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// ============================================
// CMS SCHEMAS
// ============================================

export const updateHeaderSettingSchema = z.object({
  headerLogo: z.string().url().optional(),
  logoText: z.string().max(50).optional(),
  headerText: z.string().max(200).optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  socialLinks: z.record(z.string(), urlSchema).optional(),
});

export const updateFooterSettingSchema = z.object({
  about: z.string().max(500).optional(),
  copyright: z.string().max(200).optional(),
  socialLinks: z.record(z.string(), urlSchema).optional(),
  paymentMethods: z.array(z.string()).optional(),
});

export const createPageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: slugSchema,
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const updatePageSchema = createPageSchema.partial();

export const createBannerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  subtitle: z.string().max(200).optional(),
  image: z.string().url('Invalid image URL'),
  link: z.string().url().optional(),
  buttonText: z.string().max(50).optional(),
  position: z.number().int().nonnegative().default(0),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateBannerSchema = createBannerSchema.partial();

export const newsletterSubscribeSchema = z.object({
  email: emailSchema,
});

// ============================================
// STRIPE WEBHOOK SCHEMAS
// ============================================

export const stripeWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validate data against a Zod schema
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data or throws error
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safely validate data and return result
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Success object with data or error object
 */
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Format Zod errors for API responses
 * @param error Zod error object
 * @returns Formatted error messages
 */
export function formatZodError(error: z.ZodError): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(err.message);
  });

  return formattedErrors;
}
