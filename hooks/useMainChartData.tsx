import { getGraphData } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"


export const useMainChartData = (symbol: string, interval: string, startDate: string, endDate: string, outputSize: string, lastActiveTradingDay: boolean) => {


    return useQuery({
        queryKey: ["main-chart-data", symbol, interval, startDate, endDate, outputSize, lastActiveTradingDay],
        queryFn: () => { return getGraphData(symbol, interval, outputSize, startDate, endDate, lastActiveTradingDay) },
        select: (data: any): PriceChartData[] => {
            return data.values.map((val: any) => ({
                time: new Date(val.datetime).getTime(),
                close: Number(val.close),
                low: Number(val.low),
                high: Number(val.high)
            })).reverse()
        },
        staleTime: (2 * 60 * 1000)

    })


}

