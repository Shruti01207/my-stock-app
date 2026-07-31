'use client'
import { useLiveStore } from "@/stores/useLiveStore";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect } from "react"
// import { MiniTrendLineChart } from "./mini-trendline";
import { useMarketQuote } from "@/hooks/useMarketQuote";
import { CHART_COLOR_MAP, COLOR_MAP } from "@/lib/constants";
import { Skeleton } from "../ui/skeleton";
import dynamic from "next/dynamic"
import { useMarketData } from "@/hooks/useMarketData";

const MiniTrendLineChart = dynamic(
    () => import("./mini-trendline").then(
        (mod) => mod.MiniTrendLineChart
    ),
    {
        ssr: false,
        loading: () => (
            <div className="h-[60px] animate-pulse rounded bg-muted" />
        )
    }
)



export const MarketOverviewWidget = ({ symbol, finHubSymbol }: { symbol: string, finHubSymbol: string }) => {


    const { data: stockPrice, isLoading, isError } = useMarketQuote(finHubSymbol);
    const subscribe = useLiveStore((state) => state.subscribe);
    const unsubscribe = useLiveStore((state) => state.unsubscribe);
    // const livePrice = useLiveStore((state) => state.prices[finHubSymbol])
    const marketData = useMarketData(finHubSymbol);

    useEffect(() => {
        subscribe(finHubSymbol);
        return () => {
            unsubscribe(finHubSymbol)
        }
    }, [finHubSymbol, subscribe, unsubscribe]);

    if (isLoading) return <Skeleton className="h-[150px] w-[200px] opacity-30 rounded-xl" />;
    if (isError || !stockPrice) return <div>Error loading data</div>;



    return (
        <>
            <div className="m-0 bg-[#17181f] w-[24%] rounded-md">
                <div className="card-content w-full p-3 pb-1">
                    <h1 className="font-semibold">{symbol}</h1>
                    <div className="text-sm text-white/80 font-semibold">{marketData.displayPrice}</div>
                    <div className="leading-none text-sm text-white/80 font-semibold">
                        <span>(</span>
                        <span >{marketData.sign}</span>
                        <span> {Math.abs(marketData.absoluteChange).toFixed(2)}</span>
                        <span>)</span>
                    </div>
                    <div className={`mt-1 flex items-center text-md font-semibold ${marketData.color}`}>
                        <span>{marketData.sign}</span>
                        <span >{Math.abs(marketData.percentageChange).toFixed(2)}%</span>
                        <span>
                            {marketData.trend === 'up' && <ArrowUp size={20} className={`${marketData.color}`} />}
                            {marketData.trend == 'down' && <ArrowDown size={20} className={`${marketData.color}`} />}
                        </span>
                    </div>
                </div>

                <div className="line-chart">
                    <MiniTrendLineChart symbol={symbol}></MiniTrendLineChart>
                </div>

            </div>
        </>
    )



}

//getprice = ()=>{} getprice(){ }