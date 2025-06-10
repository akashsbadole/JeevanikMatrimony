import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  sendInterest,
  getInterestsSent,
  getInterestsReceived,
} from "@/lib/database/connection";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'sent' or 'received'
    const limit = parseInt(searchParams.get("limit") || "20");

    let interests;

    if (type === "sent") {
      interests = await getInterestsSent(session.user.id, limit);
    } else if (type === "received") {
      interests = await getInterestsReceived(session.user.id, limit);
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: interests,
    });
  } catch (error) {
    console.error("Get interests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch interests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, interestType = "standard", message } = body;

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 }
      );
    }

    const interest = await sendInterest({
      senderId: session.user.id,
      receiverId,
      interestType,
      message,
    });

    return NextResponse.json({
      success: true,
      data: interest,
      message: "Interest sent successfully",
    });
  } catch (error) {
    console.error("Send interest error:", error);
    return NextResponse.json(
      { error: "Failed to send interest" },
      { status: 500 }
    );
  }
}
