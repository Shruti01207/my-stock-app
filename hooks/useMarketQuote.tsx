import { fetchStockPrice } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"

// use query- from tanstack react
export const useMarketQuote = (symbol: string) => {


    return useQuery({
        // query key is crucial
        // This is how React Query identifies the data
        // if symbol changes,it's treated as a completely different query
        queryKey: ['market-quote', symbol],
        // function that actually does fetching
        queryFn: () => fetchStockPrice(symbol),
        // optional but recommended: keep the data fresh
        // if a component mounts and the data is older than 60 ,
        // it will refetch in the background
        staleTime: 60 * 1000
    })


}