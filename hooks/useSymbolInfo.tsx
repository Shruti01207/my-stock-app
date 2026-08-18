

import { getSymbolsInfo } from "@/lib/api/stocks";
import { useSupportedSymbols } from "@/stores/useSupportedSymbolStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";


const ONE_DAY_MS = 24 * 60 * 60 * 1000
export const useSymbolInfo = (symbol?: string) => {


    const queryClient = useQueryClient();
    const lastUpdated = useSupportedSymbols(state => state.lastUpdated)
    const supportedSymbols = useSupportedSymbols(state => state.supportedSymbols)


    const isStale = () => {
        if (typeof window == 'undefined') {
            return false;
        }
        //const lastUpdated = localStorage.getItem(LocalStorageKeys.signalistSymbolslastUpdated);
        return !lastUpdated || Date.now() > (Number(lastUpdated) + ONE_DAY_MS)
    }

    useEffect(() => {
        // const saved = localStorage.getItem(
        //     LocalStorageKeys.signalistSymbols
        // );
        if (supportedSymbols.length == 0) return

        queryClient.setQueryData(['etp-profile'], supportedSymbols)
    }, [queryClient])



    return useQuery({
        queryKey: ["etp-profile"],
        queryFn: () => getSymbolsInfo(),
        staleTime: ONE_DAY_MS,
        gcTime: ONE_DAY_MS,
        enabled: isStale(),
        select: (data) => {
            if (symbol) {
                return data.filter((symData: any) => symData.symbol == symbol)[0]
            }
            else {
                return data
            }
        }
    });
}



