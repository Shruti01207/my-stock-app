import { getTrendData } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"

export const useMiniTrend = (symbol: string, startDate: string, endDate: string, prevClose: number) => {


    return useQuery({
        queryKey: ['mini-trend', symbol, startDate, endDate],
        queryFn: () => getTrendData(symbol, startDate, endDate),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        enabled: (!!symbol && prevClose > 0),
        select: (data) => {
            return data.values.map((val: any) => ({
                datetime: new Date(val.datetime).getTime(),
                close: ((Number(val.close) - prevClose) / prevClose) * 100
            })).reverse()
        }
    })


}