import { NextResponse } from "next/server";
import { isCoursesAdmin } from "@/lib/courses-admin-auth";

export async function POST(request: Request) {
  return NextResponse.json({ ok: isCoursesAdmin(request) }, {
    status: isCoursesAdmin(request) ? 200 : 401,
    headers: { "Cache-Control": "no-store" },
  });
}
