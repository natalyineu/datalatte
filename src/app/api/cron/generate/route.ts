import { NextResponse } from "next/server";

// Article generation is disabled.
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ disabled: true, message: "Article generation is disabled." }, { status: 503 });
}
