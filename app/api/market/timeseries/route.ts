
import { getGraphData } from "@/lib/api/stocks-server";
import { getCached, setCached } from "@/lib/server-cache";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {

    //symbol: String, interval: String, outputSize: String, startDate: String, endDate: String
    // first getting the symbols from request
    const symbols = request.nextUrl.searchParams.get('symbols')?.split(',');
    const interval = request.nextUrl.searchParams.get('interval');
    const outputSize = request.nextUrl.searchParams.get('outputSize');
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const ttlMs = request.nextUrl.searchParams.get('ttlMs') as string;
    const lastActiveTradingDay = request.nextUrl.searchParams.get('lastActiveTradingDay');


    if (symbols?.length == 0) {
        return NextResponse.json({
            error: "Symbols are required"
        }, { status: 400 })
    }


    const res: Record<string, any> = {};
    const cacheMissSym: string[] = [];

    symbols?.forEach((sym) => {
        let cachedData;
        if (outputSize) {
            cachedData = getCached(`timeseries-${sym}-${interval}-${outputSize}`)
        }
        else {
            cachedData = getCached(`timeseries-${sym}-${interval}-${startDate}-to-${endDate}`)
        }

        if (cachedData != null) {
            res[sym] = cachedData
        }
        else {
            cacheMissSym.push(sym);
        }
    })

    // promise is asyncronous , will give value later when op is finished
    const results = await Promise.all(
        cacheMissSym.map((sym) => {
            return getGraphData(sym, interval, outputSize, startDate, endDate);

        })
    );


    for (let index = 0; index < results.length; index++) {
        if (outputSize) {
            if (lastActiveTradingDay == "true") {
                const lastActiveTradingDay = results[index].values[0]?.datetime
                const dateObj = new Date(lastActiveTradingDay)
                let start_date = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 9, 30, 0)
                let end_date = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 16, 0, 0)
                const filtereddata = results[index].values.filter((r: any) => {
                    const candletime = new Date(r.datetime)
                    return (candletime >= start_date && candletime <= end_date)

                })
                results[index] = {
                    ...results[index],
                    values: filtereddata
                }
            }

            setCached(`timeseries-${cacheMissSym[index]}-${interval}-${outputSize}`, results[index], Number(ttlMs))
        }
        else {
            setCached(`timeseries-${cacheMissSym[index]}-${interval}-${startDate}-to-${endDate}`, results[index], Number(ttlMs))
        }

        res[cacheMissSym[index]] = results[index]
    }


    return NextResponse.json(res, { status: 200 })





}