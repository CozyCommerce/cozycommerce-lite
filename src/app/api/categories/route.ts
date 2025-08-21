import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";

export async function GET(request: Request) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET_CATEGORIES_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// We will add POST for creating a category later, restricted to ADMINS
// export async function POST(request: Request) { ... }
