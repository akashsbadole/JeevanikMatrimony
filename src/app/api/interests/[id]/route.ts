import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateInterestStatus } from "@/lib/database/connection";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await request.json();
    const { status } = body;

    if (!["accepted", "declined"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const interest = await updateInterestStatus(resolvedParams.id, status);

    return NextResponse.json({
      success: true,
      data: interest,
      message: `Interest ${status} successfully`,
    });
  } catch (error) {
    console.error("Update interest error:", error);
    return NextResponse.json(
      { error: "Failed to update interest" },
      { status: 500 }
    );
  }
}
