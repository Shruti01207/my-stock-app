import { getNewsSentiments } from "@/lib/api/stocks-server";
import { getCached, setCached } from "@/lib/server-cache";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {


    const symbol = request.nextUrl.searchParams.get('symbol');

    if (!symbol || symbol == null) {
        return NextResponse.json({
            error: "Symbol is required"
        }, { status: 400 });

    }

    let cachedData = getCached(`news-sentiment-${symbol}`);

    if (cachedData == null) {
        cachedData = await getNewsSentiments(symbol);
        setCached(`news-sentiment-${symbol}`, cachedData, 24 * 60 * 60 * 1000);
    }


    return NextResponse.json(cachedData, {
        status: 200
    });


}