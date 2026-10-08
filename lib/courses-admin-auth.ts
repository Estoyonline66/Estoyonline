import { timingSafeEqual } from "node:crypto";

export function isCoursesAdmin(request: Request): boolean {
  // Retain the deployed password while allowing a server-only variable name.
  const expected = process.env.COURSES_ADMIN_PASSWORD || process.env.NEXT_PUBLIC_COURSES_ADMIN_PASSWORD;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  return Boolean(expected && Buffer.byteLength(expected) === Buffer.byteLength(supplied) &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(supplied)));
}
