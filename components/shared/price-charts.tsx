'use client'
import { useMarketQuote } from "@/hooks/useMarketQuote";
import { getGraphData } from "@/lib/api/stocks";
import { FILTER_KEY, PRICE_CHART_FILTER_CONFIG } from "@/lib/config/chartFilter";
import { getFormatedDate, getISOFormattedDate, getMarketTime, isMarketOpen } from "@/lib/utils";
import { useLiveStore } from "@/stores/useLiveStore";
import { ArrowDown, ArrowUp, Mountain } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { PriceChartContent } from "./price-chart-content";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";




export const PriceCharts = ({ symbol, finHubSymbol }: { symbol: string, finHubSymbol: string }) => {

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


    const [data, setData] = useState<PriceChartData[]>([]);

    const subcribe = useLiveStore((state) => state.subscribe);
    const prices = useLiveStore((state) => state.prices);
    const [interval, setInterval] = useState<string>('1min');
    const [outputSize, setOutputSize] = useState<string>('390')
    const initialDates = getInitialMarketDates();
    const [startDate, setStartDate] = useState<string>(initialDates.startDate);
    const [endDate, setEndDate] = useState<string>(initialDates.endDate);
    const [mainGraphFilter, setMainGraphFilter] = useState<FILTER_KEY>("1D");
    const [loading, setLoading] = useState<boolean>(true);
    const { data: quoteData, isLoading, isError } = useMarketQuote(finHubSymbol);
    const { data: companyProfile, isLoading: companyProfileLoading, isLoadingError } = useCompanyProfile(finHubSymbol)

    let livePrice = prices[finHubSymbol];


    useEffect(() => {
        subcribe(finHubSymbol);
    }, [subcribe, finHubSymbol])


    useEffect(() => {
        const currTime = getMarketTime();
        livePrice = prices[finHubSymbol];
        if (isMarketOpen()) {
            setData((prev: any) => [...prev, { close: prices[finHubSymbol], high: prices[finHubSymbol], low: prices[finHubSymbol], time: currTime }])
        }

    }, [prices[finHubSymbol]])





    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            let data = await getGraphData(symbol, interval, outputSize, startDate, endDate);
            console.log(`graph data called for${symbol}`);
            parseData(data);
            setLoading(false);
        }
        getData();

    }, [interval, startDate, endDate, outputSize])


    const parseData = (data: any) => {
        const d = data.values;

        const trendData = d.map((val: any) => ({
            time: new Date(val.datetime).getTime(),
            close: Number(val.close),
            low: Number(val.low),
            high: Number(val.high)
        })).reverse();

        setData(trendData);
    }



    const setIntervalAndBlocks = (interval: string, block: string, filter: "1D" | "5D" | "1M" | "6M") => {
        setLoading(true);
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



    const displayPrice = livePrice || quoteData?.c
    const absoluteChange = livePrice ? (livePrice - (quoteData?.pc ?? 0)) : quoteData?.d ?? 0;
    const percentageChange = livePrice ? ((absoluteChange / (quoteData?.pc ?? 1)) * 100) : quoteData?.dp ?? 0;
    const sign = (absoluteChange > 0) ? '+' : (absoluteChange < 0) ? '-' : '';
    const color = (absoluteChange > 0) ? 'text-green-400' : (absoluteChange < 0) ? 'text-red-400' : 'text-gray-400';
    const chartColor = (absoluteChange > 0) ? 'green' : (absoluteChange < 0) ? 'red' : 'gray';




    return <>
        <div className="my-3 bg-[#17181f] p-0 lg:p-3 rounded-md">
            <div className="chart-header p-2 ms-[2.5%] my-2">
                <div className="flex gap-2">
                    {/* <span><Mountain size={25} /></span>
                    <span className="font-semibold text-xl"> {companyProfile.name}</span> */}
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
                    <div>{(data.length > 0) ? getFormatedDate(new Date(data[data.length - 1].time)) : ""}</div>
                </div>
            </div>

            {loading ?
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
                                <PriceChartContent data={data} mainGraphFilter={mainGraphFilter} symbol={symbol} chartColor={chartColor}></PriceChartContent>
                            </ResponsiveContainer>
                        </div>
                        <div className="hidden lg:block h-[100%] w-full min-w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PriceChartContent data={data} mainGraphFilter={mainGraphFilter} symbol={symbol} chartColor={chartColor}></PriceChartContent>
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