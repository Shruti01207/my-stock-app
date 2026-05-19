import { fetchStockPrice } from "@/lib/api/stocks-server";
import { getCached, setCached } from "@/lib/server-cache";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    // NextRequest has a property called nextUrl
    // which has searchparams

    const symbols = request.nextUrl.searchParams.get('symbols')?.split(',');
    // searchparam property

    if (symbols?.length == 0) {
        return NextResponse.json({
            error: 'symbols is required'
        }, { status: 400 });
    }


    let res = {};
    let cacheMissSym: string[] = [];
    symbols?.forEach((sym: any) => {
        const cachedData = getCached(`quotes-${sym}`);
        if (cachedData != null) {
            res = {
                ...res,
                [sym]: cachedData
            }
        }
        else {
            cacheMissSym.push(sym);
        }
    })

    if (cacheMissSym.length > 0) {
        const results = await Promise.all(
            cacheMissSym.map(sym => {
                return fetchStockPrice(sym);
            })
        );

        for (let index = 0; index < results.length; index++) {

            setCached(`quotes-${cacheMissSym[index]}`, results[index], 60000)
            res = {
                ...res,
                [cacheMissSym[index]]: results[index]
            }
        }

    }

    return NextResponse.json(res, { status: 200 })

}