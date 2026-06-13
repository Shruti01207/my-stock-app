import { useMarketQuote } from "@/hooks/useMarketQuote";
import { useLiveStore } from "../stores/useLiveStore";
import { getMarketMetrics } from "@/lib/market-metrics";

export function useMarketData(symbol: string) {

    const { data: stockPrice, isLoading, isError } = useMarketQuote(symbol);
    const livePrice = useLiveStore(state => state.prices[symbol]);

    const currentPrice = (stockPrice?.c ?? 0);
    const prevClose = (stockPrice?.pc ?? 0);
    const displayPrice = livePrice ?? currentPrice;

    return {
        isLoading,
        isError,
        displayPrice,
        prevClose,
        ...getMarketMetrics(displayPrice,
            prevClose,
            stockPrice?.dp ?? 0
        )

    }





}