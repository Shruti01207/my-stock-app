import { marketMovers } from "@/dummydata";
import { getTopGainersLosers } from "@/lib/api/stocks-server";
import { getCached, setCached } from "@/lib/server-cache";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {

    let cachedData = getCached(`market-movers`);

    if (cachedData == null) {
        // cachedData = await getTopGainersLosers();
        cachedData = marketMovers
        // caching ttl to be changed later according to market hrs 
        setCached(`market-movers`, cachedData, 24 * 60 * 60 * 1000)
    }
    { }
    return NextResponse.json({ success: true, data: cachedData }, { status: 200 })


}