import { fetchStockPrice } from '@/lib/api/stocks';
import { useQueries } from '@tanstack/react-query';



export function useWatchlistData(watchlist: string[]) {
    return useQueries({
        queries: watchlist.map((sym) => ({
            queryKey: ['stock', sym],
            queryFn: () => fetchStockPrice(sym),
            refetchInterval: 10000
        })),
        combine: (results) => {
            return {
                data: results.map((result, index) => {
                    const sym = watchlist[index]
                    const apiData = result.data;
                    return {
                        symbol: sym,
                        price: apiData?.c ?? 0,
                        change: apiData?.dp ?? 0, // Using 'dp' for percent change
                        high: apiData?.h ?? 0,
                        low: apiData?.l ?? 0,
                    }
                }),
                isLoading: results.some(r => r.isLoading),
                isError: results.some(r => r.isError)
            }
        },
    })
}