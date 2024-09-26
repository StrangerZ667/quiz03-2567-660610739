import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Kanchai Khumdee",
    studentId: "660610739",
  });
};
