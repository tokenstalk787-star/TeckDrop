import { NextResponse } from "next/server";
import { getAirdropBySlug } from "@/lib/airdrops";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getAirdropBySlug(slug);
  if (!item) return NextResponse.json({ error: "Airdrop not found" }, { status: 404 });
  return NextResponse.json({ data: item });
}
