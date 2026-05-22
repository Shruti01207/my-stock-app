'use client'
import { useMarketQuote } from "@/hooks/useMarketQuote";
import { getGraphData } from "@/lib/api/stocks";
import { FILTER_KEY, PRICE_CHART_FILTER_CONFIG } from "@/lib/config/chartFilter";
import { getFormatedDate, getISOFormattedDate, getMarketTime, isMarketOpen } from "@/lib/utils";
import { useLiveStore } from "@/stores/useLiveStore";
import { ArrowDown, ArrowUp, Mountain } from "lucide-react";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"




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
    const [activeX, setActiveX] = useState(null)
    const subcribe = useLiveStore((state) => state.subscribe);
    const prices = useLiveStore((state) => state.prices);
    const [interval, setInterval] = useState<string>('1min');
    const [outputSize, setOutputSize] = useState<string>('390')
    const initialDates = getInitialMarketDates();
    const [startDate, setStartDate] = useState<string>(initialDates.startDate);
    const [endDate, setEndDate] = useState<string>(initialDates.endDate);
    const [mainGraphFilter, setMainGraphFilter] = useState<FILTER_KEY>("1D");
    const [loading, setLoading] = useState<boolean>(false);
    const { data: quoteData, isLoading, isError } = useMarketQuote(finHubSymbol);
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


    const handleClick = (e: any) => {
        if (e && e.activeLabel) {
            setActiveX(e.activeLabel);
        }
    }


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



    const setIntervalAndBlocks = (interval: string, block: string, filter: "1D" | "5D") => {
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
        <div className="border p-7">
            <div className="flex gap-2">
                <span><Mountain size={25} /></span>
                <span className="font-semibold text-xl"> INVESCO QQQ Trust, Series 1</span>
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

            {loading ?
                <>
                    <div className="animate-pulse">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /> <XAxis dataKey="time" /> <YAxis /> <Line type="monotone" dataKey="close" stroke="#9ca3af" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>

                    </div>
                </> :
                <>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={data}
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            onClick={handleClick}
                        >
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3}
                            />
                            <XAxis

                                type={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].type}
                                scale={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].scale}
                                dataKey="time"
                                domain={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].getXAxisDomain(data)}
                                tickFormatter={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].formatXAxis}
                                ticks={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].generateTradingTicks(data)}
                                padding={{ right: 40, left: 40 }}

                            />
                            <Tooltip
                                labelFormatter={(value) => PRICE_CHART_FILTER_CONFIG[mainGraphFilter].getToolTipFormatter(value)}
                                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '4px' }}
                            />

                            <YAxis
                                type="number"
                                domain={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].getYAxisRange(data)}
                                padding={{ top: 40, bottom: 40 }}
                            />

                            <Line
                                type="monotone"
                                dataKey="close"
                                stroke="#f43f5e"
                                strokeWidth={1}
                                dot={false}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                isAnimationActive={false}
                                activeDot={{
                                    stroke: 'green',
                                }}
                            />

                        </LineChart>
                    </ResponsiveContainer>
                </>

            }


            <button type="button" className="text-white bg-dark box-border border border-transparent hover:bg-dark-strong focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none" onClick={() => setIntervalAndBlocks('1min', '390', "1D")}>1D</button>
            <button type="button" className="text-white bg-dark box-border border border-transparent hover:bg-dark-strong focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none" onClick={() => setIntervalAndBlocks('5min', '390', "5D")}  >5D</button>
        </div>


    </>


}