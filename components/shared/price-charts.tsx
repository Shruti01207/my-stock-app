'use client'
import { FILTER_KEY, TIMEFRAME_CONFIGS } from "@/lib/config/chartFilter";
import { getFormatedDate, getISOFormattedDate, getMarketTime, isMarketOpen } from "@/lib/utils";
import { useLiveStore } from "@/stores/useLiveStore";
import { ArrowDown, ArrowUp, Bell, Mountain } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer } from "recharts"
import { PriceChartContent } from "./price-chart-content";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useSymbolInfo } from "@/hooks/useSymbolInfo";
import { useMainChartData } from "@/hooks/useMainChartData";
import { Button } from "../ui/button";
import { useAlertStore } from "@/stores/useAlertStore";
import { useMarketData } from "@/hooks/useMarketData";




export const PriceCharts = ({ symbol, symbolDetails }: { symbol: string, symbolDetails: SymbolDetails }) => {

    const subcribe = useLiveStore((state) => state.subscribe);
    const unsubscribe = useLiveStore((state) => state.unsubscribe);
    const prices = useLiveStore((state) => state.prices);
    const setOpen = useAlertStore((state) => state.setOpen);
    const [mainGraphFilter, setMainGraphFilter] = useState<FILTER_KEY>("1D");
    const { interval, outputSize } = TIMEFRAME_CONFIGS[mainGraphFilter];
    const { startDate, endDate } = useMemo(() => {
        if (mainGraphFilter !== '1D' || !isMarketOpen()) {
            return {
                startDate: '',
                endDate: ''
            }
        }
        const ISODate = getISOFormattedDate(new Date());
        return {
            startDate: `${ISODate} 09:30:00`,
            endDate: `${ISODate} 16:00:00`,
        };

    }, [mainGraphFilter])
    const { data, isLoading: chartDataLoading } = useMainChartData(symbolDetails.symbol, interval, startDate, endDate, outputSize);

    const companyProfileQuery = useCompanyProfile(symbolDetails.symbol);
    const symbolsData = useSymbolInfo(symbolDetails.symbol);
    const profile = (symbolDetails.type == 'Common Stock') ? companyProfileQuery.data : symbolsData.data

    const [livePrices, setLivePrices] = useState<PriceChartData[]>([]);
    const marketData = useMarketData(symbolDetails.symbol);

    useEffect(() => {
        subcribe(symbolDetails.symbol);
        return () => {
            unsubscribe(symbolDetails.symbol);
        }

    }, [subcribe, unsubscribe, symbolDetails.symbol])


    useEffect(() => {
        const currTime = getMarketTime();
        if (isMarketOpen() && prices[symbolDetails.symbol]) {
            const date = new Date(currTime);
            setLivePrices((prev) => {
                if (prev.length == 0) {
                    return [
                        {
                            close: prices[symbolDetails.symbol],
                            high: prices[symbolDetails.symbol],
                            low: prices[symbolDetails.symbol],
                            time: currTime
                        }
                    ]
                }

                const lastCandleDateTime = new Date(prev[prev.length - 1]?.time);

                const isSameMinute = date.getDate() == lastCandleDateTime.getDate() && date.getHours() == lastCandleDateTime.getHours()
                    && date.getMinutes() == lastCandleDateTime.getMinutes();
                if (isSameMinute) {
                    const updatedCandle: PriceChartData = {
                        close: prices[symbolDetails.symbol],
                        high: Math.max(prices[symbolDetails.symbol], prev[prev.length - 1].high),
                        low: Math.min(prices[symbolDetails.symbol], prev[prev.length - 1].low),
                        time: currTime
                    }

                    return [...prev.slice(0, -1), updatedCandle]

                }
                else {
                    const newCandle: PriceChartData = {
                        close: prices[symbolDetails.symbol],
                        high: prices[symbolDetails.symbol],
                        low: prices[symbolDetails.symbol],
                        time: currTime
                    }
                    return [...prev, newCandle]
                }
            })

        }

    }, [prices[symbolDetails.symbol]])

    useEffect(() => {
        setLivePrices([]);
    }, [symbolDetails.symbol, interval, startDate, endDate, outputSize])


    const chartData = useMemo(() => {
        return [...(data ?? []), ...livePrices]
    }, [livePrices, data])


    const handleFilterChange = (filter: "1D" | "5D" | "1M" | "6M") => {
        setMainGraphFilter(filter);
    }



    return <>
        <div className="my-3 bg-[#17181f] p-0 lg:p-3 rounded-md">
            <div className="chart-header p-2 ms-[2.5%] my-2">
                <div className="flex gap-2">

                    {<div className="font-semibold w-full md:text-xl sm:text-sm flex justify-between items-center">

                        <div className="font-semibold md:text-xl sm:text-sm flex gap-2">
                            <span><Mountain size={25} />  </span>
                            <span>{symbolDetails.symbol}</span>
                            {profile && <span>| {profile.description}</span>}

                        </div>

                        <div className="action-btn">
                            <Button variant="outline" size="sm" className="gap-1" onClick={() => setOpen(true, symbolDetails)}>
                                <Bell
                                    size={16}
                                    className="text-[#D4AF37]"
                                    strokeWidth={3}
                                /> Set Alert
                            </Button>
                        </div>


                    </div>}
                </div>
                {(!marketData.isLoading && !marketData.isError) && <div className="flex gap-2">
                    <div className="text-2xl font-semibold text-white/80"> ${marketData.displayPrice}</div>
                    <div className={`text-xl mt-1 flex items-center text-md font-semibold ${marketData.color}`}>
                        <span>
                            {marketData.absoluteChange > 0 && <ArrowUp size={20} className={`${marketData.color}`} />}
                            {marketData.absoluteChange < 0 &&
                                <ArrowDown size={20} className={`${marketData.color}`}></ArrowDown>}
                        </span>
                        <span>{Math.abs(marketData.percentageChange).toFixed(2)}%</span>
                    </div>

                    <div className={`text-xl mt-1 flex items-center text-md font-semibold ${marketData.color}`}>
                        <span>
                            <span>(</span>
                            <span >{marketData.sign}</span>
                            <span> {Math.abs(marketData.absoluteChange).toFixed(2)}</span>
                            <span>)</span>
                        </span>

                    </div>





                </div>}

                {(data && data.length > 0) &&
                    <div className="market-status flex gap-2 text-zinc-400">
                        {isMarketOpen() ? <div className="text-green-400">OPEN</div> : <div className="text-red-400">CLOSED</div>}
                        <div>{getFormatedDate(new Date(data[data.length - 1].time))}</div>
                    </div>
                }

            </div>

            {chartDataLoading ?
                <>
                    <div className="w-full min-w-full">
                        <div className="h-[182px] md:h-[250px] lg:h-[300px] w-full">
                        </div>
                    </div>
                </> :
                <>
                    <div className="h-[182px] md:h-[250px] lg:h-[300px] w-full">
                        <div className="lg:hidden sm:block h-[100%] w-full min-w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartData && <PriceChartContent data={chartData} mainGraphFilter={mainGraphFilter} symbol={symbol} chartColor={marketData.chartColor}></PriceChartContent>}
                            </ResponsiveContainer>
                        </div>
                        <div className="hidden lg:block h-[100%] w-full min-w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartData && <PriceChartContent data={chartData} mainGraphFilter={mainGraphFilter} symbol={symbol} chartColor={marketData.chartColor}></PriceChartContent>}
                            </ResponsiveContainer>
                        </div>
                    </div>

                </>

            }


            <div className="action-btns mt-4">
                <button type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-1 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-2 py-1 focus:outline-none mr-1.5" onClick={() => handleFilterChange("1D")}>1D</button>
                <button type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-1 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-2 py-1 focus:outline-none mr-1.5" onClick={() => handleFilterChange("5D")}  >5D</button>
                <button type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-1 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-2 py-1 focus:outline-none mr-1.5" onClick={() => handleFilterChange("1M")}  >1M</button>
                <button type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-1 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-2 py-1 focus:outline-none mr-1.5" onClick={() => handleFilterChange("6M")}  >6M</button>
            </div>

        </div>


    </>


}