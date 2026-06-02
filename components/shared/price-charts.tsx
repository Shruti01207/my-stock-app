'use client'
import { useMarketQuote } from "@/hooks/useMarketQuote";
import { getGraphData } from "@/lib/api/stocks";
import { FILTER_KEY, PRICE_CHART_FILTER_CONFIG } from "@/lib/config/chartFilter";
import { getFormatedDate, getISOFormattedDate, getMarketTime, isMarketOpen } from "@/lib/utils";
import { useLiveStore } from "@/stores/useLiveStore";
import { ArrowDown, ArrowUp, Mountain } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { PriceChartContent } from "./price-chart-content";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { CHART_COLOR_MAP, COLOR_MAP } from "@/lib/constants";
import { useSymbolInfo } from "@/hooks/useSymbolInfo";
import { useMainChartData } from "@/hooks/useMainChartData";




export const PriceCharts = ({ symbol, symbolDetails }: { symbol: string, symbolDetails: SymbolDetails }) => {

    const getInitialMarketDates = () => {
        if (!isMarketOpen()) {
            return {
                startDate: '',
                endDate: ''
            };
        }

        const ISODate = getISOFormattedDate(new Date());

        return {
            startDate: `${ISODate} 09:30:00`,
            endDate: `${ISODate} 16:00:00`
        };
    };

    const subcribe = useLiveStore((state) => state.subscribe);
    const unsubscribe = useLiveStore((state) => state.unsubscribe);
    const prices = useLiveStore((state) => state.prices);
    const [interval, setInterval] = useState<string>('1min');
    const [outputSize, setOutputSize] = useState<string>('390')
    const initialDates = getInitialMarketDates();
    const [startDate, setStartDate] = useState<string>(initialDates.startDate);
    const [endDate, setEndDate] = useState<string>(initialDates.endDate);
    const [mainGraphFilter, setMainGraphFilter] = useState<FILTER_KEY>("1D");
    const { data: quoteData, isLoading, isError } = useMarketQuote(symbolDetails.symbol);
    const companyProfileQuery = useCompanyProfile(symbolDetails.symbol);
    const symbolsData = useSymbolInfo(symbolDetails.symbol);
    const { data, isLoading: chartDataLoading } = useMainChartData(symbolDetails.symbol, interval, startDate, endDate, outputSize);
    const profile = (symbolDetails.type == 'Stock') ? companyProfileQuery.data : symbolsData.data
    const [livePrices, setLivePrices] = useState<PriceChartData[]>([]);


    useEffect(() => {
        subcribe(symbolDetails.symbol);
        return () => {
            unsubscribe(symbolDetails.symbol);
        }

    }, [subcribe, unsubscribe, symbolDetails.symbol])


    useEffect(() => {
        const currTime = getMarketTime();
        if (isMarketOpen() && prices[symbolDetails.symbol]) {
            setLivePrices((prev: PriceChartData[]) => [...prev, { close: prices[symbolDetails.symbol], high: prices[symbolDetails.symbol], low: prices[symbolDetails.symbol], time: currTime }])
        }

    }, [prices[symbolDetails.symbol]])

    useEffect(() => {
        setLivePrices([]);
    }, [symbolDetails.symbol, interval, startDate, endDate, outputSize])


    const chartData = useMemo(() => {
        return [...(data ?? []), ...livePrices]
    }, [livePrices, data])


    const setIntervalAndBlocks = (interval: string, block: string, filter: "1D" | "5D" | "1M" | "6M") => {
        setInterval(interval);
        if (filter == '1D') {
            const date = new Date();
            const ISODate = getISOFormattedDate(date);
            if (isMarketOpen()) {
                setStartDate(`${ISODate} 09:30:00`);
                setEndDate(`${ISODate} 16:00:00`)
            }
            else {
                setStartDate('');
                setEndDate('')
            }
        }
        else {
            console.log("mainGraphFilter", mainGraphFilter)
            setStartDate('');
            setEndDate('')
        }

        setOutputSize(block);
        setMainGraphFilter(filter);
    }

    const currentPrice = (quoteData?.c ?? 0);
    const prevClose = (quoteData?.pc ?? 0);
    const livePrice = prices[symbolDetails.symbol];
    const displayPrice = livePrice ?? currentPrice;
    const absoluteChange = (displayPrice - prevClose);
    const percentageChange = (prevClose > 0) ? (absoluteChange / prevClose) * 100 : (quoteData?.dp ?? 0);
    const trend: Trend = (absoluteChange > 0) ? 'up' : (absoluteChange < 0) ? 'down' : 'flat'
    const sign = (trend == 'up') ? '+' : (trend == 'down') ? '-' : '';
    const color = COLOR_MAP[trend]
    const chartColor = CHART_COLOR_MAP[trend]

    return <>
        <div className="my-3 bg-[#17181f] p-0 lg:p-3 rounded-md">
            <div className="chart-header p-2 ms-[2.5%] my-2">
                <div className="flex gap-2">
                    <span><Mountain size={25} /></span>
                    {profile && <span className="font-semibold text-xl"> {profile.description}</span>}

                </div>
                <div className="flex gap-2">
                    <div className="text-2xl font-semibold text-white/80"> ${displayPrice}</div>
                    <div className={`text-xl mt-1 flex items-center text-md font-semibold ${color}`}>
                        <span>
                            {absoluteChange > 0 && <ArrowUp size={20} className={`${color}`} />
                            }
                            {absoluteChange < 0 &&
                                <ArrowDown size={20} className={`${color}`}></ArrowDown>
                            }

                        </span>
                        <span >{Math.abs(percentageChange).toFixed(2)}%</span>
                    </div>
                    <div className="text-xl mt-1 flex items-center text-md font-semibold ${color}">
                        <span>
                            <span>(</span>
                            <span >{sign}</span>
                            <span> {Math.abs(absoluteChange).toFixed(2)}</span>
                            <span>)</span>
                        </span>

                    </div>
                </div>
                <div className="market-status flex gap-2">
                    {isMarketOpen() ? <div className="text-green-400">OPEN</div> : <div className="text-danger-400">CLOSED</div>}
                    <div>{(data && data.length > 0) ? getFormatedDate(new Date(data[data.length - 1].time)) : ""}</div>
                </div>
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
                                {chartData && <PriceChartContent data={chartData} mainGraphFilter={mainGraphFilter} symbol={symbol} chartColor={chartColor}></PriceChartContent>}
                            </ResponsiveContainer>
                        </div>
                        <div className="hidden lg:block h-[100%] w-full min-w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartData && <PriceChartContent data={chartData} mainGraphFilter={mainGraphFilter} symbol={symbol} chartColor={chartColor}></PriceChartContent>}
                            </ResponsiveContainer>
                        </div>
                    </div>

                </>

            }


            <button type="button" className="text-white bg-dark box-border border border-transparent hover:bg-dark-strong focus:ring-1 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-2 py-1 focus:outline-none" onClick={() => setIntervalAndBlocks('1min', '390', "1D")}>1D</button>
            <button type="button" className="text-white bg-dark box-border border border-transparent hover:bg-dark-strong focus:ring-1 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-2 py-1 focus:outline-none" onClick={() => setIntervalAndBlocks('5min', '390', "5D")}  >5D</button>
            <button type="button" className="text-white bg-dark box-border border border-transparent hover:bg-dark-strong focus:ring-1 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-2 py-1 focus:outline-none" onClick={() => setIntervalAndBlocks('1day', '23', "1M")}  >1M</button>
            <button type="button" className="text-white bg-dark box-border border border-transparent hover:bg-dark-strong focus:ring-1 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-2 py-1 focus:outline-none" onClick={() => setIntervalAndBlocks('1day', '138', "6M")}  >6M</button>
        </div>


    </>


}