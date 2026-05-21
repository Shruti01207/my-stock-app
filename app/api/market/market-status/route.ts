
import { getMarketStatus } from "@/lib/api/stocks-server";
import { getCached, setCached } from "@/lib/server-cache";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {

    const exchange = request.nextUrl.searchParams.get('exchange');

    if (!exchange || exchange == null) {
        return NextResponse.json({
            error: "Exchange is required"
        }, { status: 400 });
    }

    let cachedData = getCached(`market-status-${exchange}`);

    if (cachedData == null) {
        cachedData = await getMarketStatus(exchange);
        console.log("cachedData", cachedData);
        setCached(`market-status-${exchange}`, cachedData, 30000);
    }

    return NextResponse.json(cachedData, { status: 200 });

}