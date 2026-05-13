'use client'

import { fetchStockPrice, FinhubQuote } from "@/lib/api/stocks"
import { useLiveStore } from "@/stores/useLiveStore";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react"
import { MiniTrendLineChart } from "./mini-trendline";



export const MarketOverviewWidget = ({ symbol, finHubSymbol }: { symbol: string, finHubSymbol: string }) => {

    const [stockPrice, setStockPrice] = useState<FinhubQuote>({
        c: 0,
        h: 0,
        l: 0,
        o: 0,
        pc: 0,
        t: 0,
        d: 0,
        dp: 0
    });
    const subscribe = useLiveStore((state) => state.subscribe);
    const unsubcribe = useLiveStore((state) => state.unsubcribe);
    const livePrice = useLiveStore((state) => state.prices[symbol])


    useEffect(() => {

        const getStockPrice = async () => {
            const data = await fetchStockPrice(finHubSymbol);
            console.log("price=", data)
            setStockPrice(data)
        }


        getStockPrice();

    }, [finHubSymbol]);

    useEffect(() => {
        subscribe(finHubSymbol);
        return () => {
            unsubcribe(finHubSymbol)
        }

    }, [finHubSymbol]);


    const displayPrice = livePrice || stockPrice.c
    const absoluteChange = livePrice ? (livePrice - stockPrice.pc) : stockPrice.d;
    const percentageChange = livePrice ? (absoluteChange / stockPrice.pc) * 100 : stockPrice.dp;
    const sign = (absoluteChange > 0) ? '+' : (absoluteChange < 0) ? '-' : '';
    const color = (absoluteChange > 0) ? 'text-green-400' : (absoluteChange < 0) ? 'text-red-400' : 'text-gray-400';
    const chartColor = (absoluteChange > 0) ? 'green' : (absoluteChange < 0) ? 'red' : 'gray';

    return (
        <>
            <div className="m-0 bg-[#2e2e2e8f] w-[200px] rounded-md">
                <div className="card-content p-3">
                    <h1 className="font-bold">{symbol}</h1>
                    <div className="text-sm text-white/80"> {displayPrice}</div>

                    <div className="leading-none text-sm text-white/80">
                        <span>(</span>
                        <span >{sign}</span>
                        <span> {Math.abs(absoluteChange).toFixed(2)}</span>
                        <span>)</span>
                    </div>
                    <div className={`mt-1 flex items-center text-md font-bold ${color}`}>
                        <span >{sign}</span>
                        <span >{Math.abs(percentageChange).toFixed(2)}%</span>
                        <span>
                            {absoluteChange > 0 && <ArrowUp size={20} className={`${color}`} />
                            }
                            {absoluteChange < 0 &&
                                <ArrowDown size={20} className={`${color}`}></ArrowDown>
                            }
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