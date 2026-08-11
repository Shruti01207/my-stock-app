import { useMarketQuote } from "@/hooks/useMarketQuote";
import { useLiveStore } from "../stores/useLiveStore";
import { getMarketMetrics } from "@/lib/market-metrics";
import { useMemo } from "react";

export function useMarketData(symbol: string) {

    const { data: stockPrice, isLoading, isError } = useMarketQuote(symbol);
    const livePrice = useLiveStore(state => state.prices[symbol]);

    const currentPrice = (stockPrice?.c ?? 0);
    const prevClose = (stockPrice?.pc ?? 0);
    const displayPrice = livePrice ?? currentPrice;

    const metrics = useMemo(() => {
        return getMarketMetrics(displayPrice,
            prevClose,
            stockPrice?.dp ?? 0
        )
    }, [displayPrice, prevClose, stockPrice?.dp])

    return {
        isLoading,
        isError,
        displayPrice,
        prevClose,
        ...metrics
    }





}