import { getStockMetric } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"


export const useStockMetric = (symbol: string) => {


    return useQuery({
        queryKey: ["stock-metric", symbol],
        queryFn: () => getStockMetric(symbol),
        staleTime: (10 * 60 * 1000)
    })



}