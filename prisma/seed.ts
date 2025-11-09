import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  try {
    // Create categories
    const electronics = await prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
      },
    });

    const clothing = await prisma.category.create({
      data: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Apparel and fashion items',
      },
    });

    const home = await prisma.category.create({
      data: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home and garden products',
      },
    });

    // Create demo products
    const product1 = await prisma.product.create({
      data: {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 129.99,
        comparePrice: 199.99,
        costPrice: 45.0,
        sku: 'WH-001',
        quantity: 50,
        categoryId: electronics.id,
        status: 'ACTIVE',
        featured: true,
        metaTitle: 'Wireless Headphones - Premium Audio',
        metaDescription: 'Experience premium sound with our wireless headphones',
        tags: ['audio', 'wireless', 'headphones'],
        images: ['https://via.placeholder.com/400x400?text=Headphones'],
      },
    });

    const product2 = await prisma.product.create({
      data: {
        name: 'Cotton T-Shirt',
        slug: 'cotton-tshirt',
        description: 'Comfortable 100% cotton t-shirt',
        price: 24.99,
        comparePrice: 39.99,
        costPrice: 8.0,
        sku: 'TS-001',
        quantity: 200,
        categoryId: clothing.id,
        status: 'ACTIVE',
        featured: false,
        metaTitle: 'Comfortable Cotton T-Shirt',
        metaDescription: 'Premium quality cotton t-shirt for everyday wear',
        tags: ['clothing', 'cotton', 'casual'],
        images: ['https://via.placeholder.com/400x400?text=T-Shirt'],
      },
    });

    const product3 = await prisma.product.create({
      data: {
        name: 'LED Table Lamp',
        slug: 'led-table-lamp',
        description: 'Modern LED table lamp with adjustable brightness',
        price: 49.99,
        comparePrice: 79.99,
        costPrice: 15.0,
        sku: 'LAMP-001',
        quantity: 75,
        categoryId: home.id,
        status: 'ACTIVE',
        featured: true,
        metaTitle: 'Modern LED Table Lamp',
        metaDescription: 'Energy-efficient LED table lamp for your home',
        tags: ['lighting', 'led', 'home'],
        images: ['https://via.placeholder.com/400x400?text=Lamp'],
      },
    });

    console.log('✅ Categories created:', { electronics: electronics.id, clothing: clothing.id, home: home.id });
    console.log('✅ Products created:', { product1: product1.id, product2: product2.id, product3: product3.id });
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
