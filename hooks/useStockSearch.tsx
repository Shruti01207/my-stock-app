import { searchStock } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "./useDebounce";
import { LocalStorageKeys } from "@/lib/enums";
import { useSupportedSymbols } from "@/stores/useSupportedSymbolStore";

export const useStockSearch = (symbol: string) => {

    const debouncedQuery = useDebounce(symbol.trim(), 400);
    const supportedSymbols = useSupportedSymbols(state => state.supportedSymbols)

    console.log("supportedSymbols", supportedSymbols)




    return useQuery({
        queryKey: ["search-symbol", debouncedQuery],
        queryFn: () => searchStock(debouncedQuery),
        select: (data) => {
            const filteredSymbols = data.result.filter((sym) => supportedSymbols.some((s: SymbolInfo) => s.symbol === sym.symbol || s.symbol2 === sym.symbol))
            return filteredSymbols;
        },
        enabled: (debouncedQuery.length > 2),
        staleTime: 10 * 60 * 1000,

    })


}