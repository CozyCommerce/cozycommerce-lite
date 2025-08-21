import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";

interface IParams {
  categoryId?: string;
}

export async function GET(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { categoryId } = params;

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        products: { // Include all products in this category
          include: {
            reviews: true, // Also include reviews for each product
          },
        },
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("GET_CATEGORY_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
