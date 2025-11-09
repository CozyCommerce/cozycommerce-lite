import { Product as PrismaProduct, ProductVariant as PrismaProductVariant, Category as PrismaCategory, ProductStatus } from '@prisma/client';

export type Product = {
  id: string;
  title: string; // Mapped from name
  name?: string;
  price: number;
  discountedPrice?: number | null; // Mapped from comparePrice
  comparePrice?: number | null;
  slug: string;
  quantity: number;
  updatedAt: Date;
  reviews: number; // Computed field
  shortDescription: string; // Mapped from description (truncated)
  description?: string;
  status?: ProductStatus;
  productVariants: {
    color: string;
    image: string;
    size: string;
    isDefault: boolean;
  }[];
};


export type IProductByDetails = {
  id: string;
  title: string;
  shortDescription: string;
  description: string | null;
  price: number;
  discountedPrice?: number | null;
  slug: string;
  quantity: number;
  updatedAt: Date;
  category: {
    title: string;
    slug: string;
  } | null;
  productVariants: {
    color: string;
    image: string;
    size: string;
    isDefault: boolean;
  }[];
  reviews: number;
  additionalInformation: {
    name: string;
    description: string;
  }[];
  customAttributes: {
    attributeName: string;
    attributeValues: {
      id: string;
      title: string;
    }[];
  }[];
  body: string | null;
  tags: string[] | null;
  offers: string[] | null;
  sku: string | null;
};

