import { fetchScammersFromSheet } from "@/lib/google-sheets"
import { NextResponse } from "next/server"

export const revalidate = 60 // revalidate ทุก 60 วินาที

export async function GET() {
  const scammers = await fetchScammersFromSheet()
  return NextResponse.json(scammers)
}
