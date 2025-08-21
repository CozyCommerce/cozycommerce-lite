import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface IParams {
  productId?: string;
}

export async function GET(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { productId } = params;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        reviews: {
          include: {
            user: true, // Also include user info for each review
          },
        },
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET_PRODUCT_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: IParams }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { productId } = params;
    const body = await request.json();

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: body,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("UPDATE_PRODUCT_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { productId } = params;

        if (!productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        await prisma.product.delete({
            where: {
                id: productId,
            },
        });

        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        console.error("DELETE_PRODUCT_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
