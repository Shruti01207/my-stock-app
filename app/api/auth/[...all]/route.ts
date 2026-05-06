import { NextRequest } from "next/server";
import { getAuth } from "@/lib/better-auth/auth";

// We have to await getAuth() inside the handlers because your 
// auth instance setup connects to MongoDB asynchronously

export async function GET(request: NextRequest) {
    const auth = await getAuth();
    return auth.handler(request);
}

export async function POST(request: NextRequest) {
    const auth = await getAuth();
    return auth.handler(request);
}
