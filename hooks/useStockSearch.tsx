import { searchStock } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "./useDebounce";

export const useStockSearch = (symbol: string) => {

    const debouncedQuery = useDebounce(symbol.trim(), 400);

    return useQuery({
        queryKey: ["search-symbol", debouncedQuery],
        queryFn: () => searchStock(debouncedQuery),
        select: (data) => {
            return data.result;
        },
        enabled: (debouncedQuery.length > 2),
        staleTime: 10 * 60 * 1000,

    })


}