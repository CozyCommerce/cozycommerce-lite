import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating || !comment) {
      return new NextResponse("Missing product ID, rating, or comment", {
        status: 400,
      });
    }

    // Optional: Check if the user has purchased this product
    const order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        items: {
          some: {
            productId: productId,
          },
        },
        status: "DELIVERED", // Only allow reviews for delivered orders
      },
    });

    if (!order) {
      return new NextResponse("You can only review products you have purchased and received.", {
        status: 403,
      });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
        where: {
            userId: session.user.id,
            productId: productId,
        }
    });

    if(existingReview) {
        return new NextResponse("You have already reviewed this product.", { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        rating,
        comment,
        userId: session.user.id,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("POST_REVIEW_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
