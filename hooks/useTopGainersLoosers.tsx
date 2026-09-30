


import { getMarketMovers } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"

export const useTopGainersLoosers = () => {


    return useQuery({
        queryKey: ['top-gainers-loosers'],
        queryFn: getMarketMovers,
        select: (res) => res?.data

    })


}