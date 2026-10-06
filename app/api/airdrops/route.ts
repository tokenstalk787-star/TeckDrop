import { NextResponse } from "next/server";
import { z } from "zod";
import { getAirdrops } from "@/lib/airdrops";

const querySchema = z.object({
  ecosystem: z.string().optional(),
  status: z.enum(["ACTIVE", "UPCOMING", "WARNING"]).optional(),
  verification: z.enum(["VERIFIED", "UNVERIFIED", "WARNING"]).optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
});

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.flatten() }, { status: 400 });

  const filters = parsed.data;
  const items = (await getAirdrops()).filter((item) =>
    (!filters.ecosystem || item.ecosystem.toLowerCase() === filters.ecosystem.toLowerCase()) &&
    (!filters.status || item.status === filters.status) &&
    (!filters.verification || item.verificationStatus === filters.verification) &&
    (filters.minScore === undefined || item.opportunityScore >= filters.minScore)
  );

  return NextResponse.json({ data: items, count: items.length });
}
