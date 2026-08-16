import { getSymbolsInfo } from "@/lib/api/stocks-server";
import { SUPPORTED_MICS, SUPPORTED_TYPES } from "@/lib/constants";
import { getCached, setCached } from "@/lib/server-cache";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {


    // const symbol = request.nextUrl.searchParams.get('symbol');

    // if (!symbol || symbol == null) {
    //     return NextResponse.json({
    //         error: "Symbol is required"
    //     }, { status: 400 });

    // }

    let cachedData = getCached(`etp-profile`);

    if (cachedData == null) {
        const allSymbols = await getSymbolsInfo();
        cachedData = (allSymbols as SymbolInfo[]).filter((s: SymbolInfo) => SUPPORTED_MICS.includes(s.mic) && SUPPORTED_TYPES.includes(s.type))
        setCached(`etp-profile`, cachedData, 24 * 60 * 60 * 1000);
    }


    return NextResponse.json(cachedData, {
        status: 200
    });


}