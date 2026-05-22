'use client'

import { fetchStockPrice, FinhubQuote } from "@/lib/api/stocks"
import { useLiveStore } from "@/stores/useLiveStore";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react"
import { MiniTrendLineChart } from "./mini-trendline";
import { useMarketQuote } from "@/hooks/useMarketQuote";
import { CHART_COLOR_MAP, COLOR_MAP } from "@/lib/constants";



export const MarketOverviewWidget = ({ symbol, finHubSymbol }: { symbol: string, finHubSymbol: string }) => {


    const { data: stockPrice, isLoading, isError } = useMarketQuote(finHubSymbol);
    const subscribe = useLiveStore((state) => state.subscribe);
    const unsubscribe = useLiveStore((state) => state.unsubscribe);
    const livePrice = useLiveStore((state) => state.prices[finHubSymbol])

    useEffect(() => {
        subscribe(finHubSymbol);
        return () => {
            unsubscribe(finHubSymbol)
        }
    }, [finHubSymbol, subscribe, unsubscribe]);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !stockPrice) return <div>Error loading data</div>;

    const currentPrice = (stockPrice?.c ?? 0);
    const prevClose = (stockPrice?.pc ?? 0);
    const displayPrice = livePrice ?? currentPrice;
    const absoluteChange = (displayPrice - prevClose);
    const percentageChange = (prevClose > 0) ? (absoluteChange / prevClose) * 100 : (stockPrice?.dp ?? 0);
    const trend: Trend = (absoluteChange > 0) ? 'up' : (absoluteChange < 0) ? 'down' : 'flat'
    const sign = (trend == 'up') ? '+' : (trend == 'down') ? '-' : '';
    const color = COLOR_MAP[trend]
    const chartColor = CHART_COLOR_MAP[trend]



    return (
        <>
            <div className="m-0 bg-[#91919129] w-[200px] rounded-md">
                <div className="card-content p-3">
                    <h1 className="font-semibold">{symbol}</h1>
                    <div className="text-sm text-white/80 font-semibold">{displayPrice}</div>
                    <div className="leading-none text-sm text-white/80 font-semibold">
                        <span>(</span>
                        <span >{sign}</span>
                        <span> {Math.abs(absoluteChange).toFixed(2)}</span>
                        <span>)</span>
                    </div>
                    <div className={`mt-1 flex items-center text-md font-semibold ${color}`}>
                        <span>{sign}</span>
                        <span >{Math.abs(percentageChange).toFixed(2)}%</span>
                        <span>
                            {trend === 'up' && <ArrowUp size={20} className={`${color}`} />}
                            {trend == 'down' && <ArrowDown size={20} className={`${color}`} />}
                        </span>
                    </div>
                </div>

                <div className="line-chart py-2">
                    <MiniTrendLineChart symbol={symbol} prevClose={Number(stockPrice.pc)} chartColor={chartColor}></MiniTrendLineChart>
                </div>

            </div>
        </>
    )



}

//getprice = ()=>{} getprice(){ }