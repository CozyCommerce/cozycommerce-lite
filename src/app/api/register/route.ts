import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prismaDB";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Missing name, email, or password", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse("Email already in use", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    // Return the user without the password
    const { hashedPassword: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
