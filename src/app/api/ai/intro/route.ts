import { NextRequest, NextResponse } from "next/server";
import { generateMatchIntro } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { customerName, matchName, reasons } = await req.json();
    if (!customerName || !matchName || !Array.isArray(reasons)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const intro = await generateMatchIntro(customerName, matchName, reasons);
    return NextResponse.json({ intro });
  } catch {
    return NextResponse.json({ error: "Failed to generate intro" }, { status: 500 });
  }
}
