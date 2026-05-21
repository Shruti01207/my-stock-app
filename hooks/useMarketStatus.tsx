import { getMarketStatus } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"


export const useMarketStatus = (exchange: string) => {

    return useQuery({
        queryKey: ['market-status', exchange],
        queryFn: () => getMarketStatus(exchange),
        staleTime: 30000,
        refetchInterval: 30000
    });

}

