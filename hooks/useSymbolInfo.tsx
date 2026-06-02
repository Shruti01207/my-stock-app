

import { getSymbolsInfo } from "@/lib/api/stocks";
import { useQuery } from "@tanstack/react-query"


export const useSymbolInfo = (symbol: string) => {



    return useQuery({
        queryKey: ["etp-profile", symbol],
        queryFn: () => getSymbolsInfo(symbol),
        staleTime: 24 * 60 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        select: (data) => {
            return data.filter((symData: any) => symData.symbol == symbol)[0]
        }
    });
}