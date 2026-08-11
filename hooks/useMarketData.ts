import { useMarketQuote } from "@/hooks/useMarketQuote";
import { useLiveStore } from "../stores/useLiveStore";
import { getMarketMetrics } from "@/lib/market-metrics";
import { useMemo } from "react";

export function useMarketData(symbol: string) {

    const { data: stockPrice, isLoading, isError } = useMarketQuote(symbol);
    const livePrice = useLiveStore(state => state.prices[symbol]);

    const currentPrice = (stockPrice?.c ?? undefined);
    const prevClose = (stockPrice?.pc ?? undefined);
    const displayPrice = livePrice ?? currentPrice;

    const metrics = useMemo(() => {
        return getMarketMetrics(displayPrice,
            prevClose,
            stockPrice?.dp ?? undefined
        )
    }, [displayPrice, prevClose, stockPrice?.dp])

    return {
        isLoading,
        isError,
        displayPrice,
        timestamp: stockPrice?.t,
        prevClose,
        ...metrics
    }





}