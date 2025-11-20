import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Set your secret token in .env.local as REVALIDATE_SECRET
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/api/v1/doctors";

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    // Revalidate the path (App Router)
    await revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now(), path });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 },
    );
  }
}
