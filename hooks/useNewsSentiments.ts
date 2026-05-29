

import { getNewsSentiments } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"


export const useNewsSentiments = (symbol: string) => {

    return useQuery({
        queryKey: ["news-sentiment", symbol],
        queryFn: () => getNewsSentiments(symbol),
        staleTime: (10 * 60 * 1000)
    })



}