import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    // Later, we can add pagination, filtering, sorting, etc. via searchParams
    const products = await prisma.product.findMany({
      include: {
        category: true, // Include category information
        reviews: true, // Include reviews
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, price, categoryId, slug, quantity, images } = body;

    if (!title || !description || !price || !categoryId || !slug || !quantity) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        categoryId,
        slug,
        quantity,
        // This is a simplified version, a real implementation would handle image uploads
        productVariants: {
            create: {
                image: images?.[0] || "/images/products/product-1-bg-1.png",
                isDefault: true,
            }
        }
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
