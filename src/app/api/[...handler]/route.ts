import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log("test fra hele api");
  return new NextResponse("test fra routes alle");
}
