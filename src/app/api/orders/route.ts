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
    const { items, addressId } = body;

    if (!items || items.length === 0 || !addressId) {
      return new NextResponse("Missing items or address information", {
        status: 400,
      });
    }

    // Use a Prisma transaction to ensure all operations succeed or fail together
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Verify products and calculate total price
      let totalPrice = 0;
      const productChecks = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for ${product.name}.`);
        }

        totalPrice += product.price.toNumber() * item.quantity;
        productChecks.push({
            ...item,
            price: product.price // Use server-side price
        });
      }

      // 2. Create the Order
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          addressId: addressId,
          total: totalPrice,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productChecks.find(p => p.productId === item.productId)!.price
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 3. Decrement stock for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    return NextResponse.json(newOrder);
  } catch (error: any) {
    console.error("CREATE_ORDER_ERROR", error);
    // Check for specific errors thrown in the transaction
    if (error.message.includes("not found") || error.message.includes("Not enough stock")) {
        return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
