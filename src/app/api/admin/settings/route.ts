import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const SETTINGS_KEY = "global_settings";

// GET handler to fetch settings
export async function GET() {
  try {
    // Find or create the settings row. Ensures it always exists.
    let settings = await prisma.siteSettings.findUnique({
      where: { uniqueKey: SETTINGS_KEY },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          uniqueKey: SETTINGS_KEY,
          currency: "EGP", // Default currency
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET_SETTINGS_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


// PATCH handler to update settings
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();

    const updatedSettings = await prisma.siteSettings.update({
      where: {
        uniqueKey: SETTINGS_KEY,
      },
      data: body,
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("UPDATE_SETTINGS_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
