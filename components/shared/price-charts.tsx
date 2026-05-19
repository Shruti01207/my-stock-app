'use client'

import { getGraphData, getTrendData } from "@/lib/api/stocks";
import { getISOFormattedDate, getUSStockTime, isMarketOpen } from "@/lib/utils";
import { useLiveStore } from "@/stores/useLiveStore";
import { Mountain } from "lucide-react";
import { DateTime } from 'luxon'
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


    const [data, setData] = useState<any>([]);
    const [activeX, setActiveX] = useState(null)
    const subcribe = useLiveStore((state) => state.subscribe);
    const prices = useLiveStore((state) => state.prices);
    const [interval, setInterval] = useState<string>('1min');
    const [outputSize, setOutputSize] = useState<string>('390')
    const initialDates = getInitialMarketDates();
    const [startDate, setStartDate] = useState<string>(initialDates.startDate);
    const [endDate, setEndDate] = useState<string>(initialDates.endDate);
    const [mainGraphFilter, setMainGraphFilter] = useState<string>("1D");
    const [loading, setLoading] = useState<boolean>(false);



    useEffect(() => {
        subcribe(finHubSymbol);
    }, [subcribe, finHubSymbol])


    useEffect(() => {
        const currTime = getMarketTime();
        console.log("prices[finHubSymbol]=", prices[finHubSymbol])
        if (isMarketOpen()) {
            setData((prev: any) => [...prev, { close: prices[finHubSymbol], high: prices[finHubSymbol], low: prices[finHubSymbol], time: currTime }])
        }

    }, [prices[finHubSymbol]])

    const getMarketTime = () => {
        const now = new Date();
        // Convert current time to a string in New York time, then back to a Date object
        const etString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
        return new Date(etString).getTime();
    };


    // useEffect(() => {

    // }, []);


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


    const getYAxisRange = (data: CandleData[]): [number, number] => {

        if (data.length == 0) {
            return [0, 0]
        }
        let maxi = -Infinity;
        let mini = Infinity;

        //  console.log("data", data)

        for (let i = 0; i < data.length; i++) {
            maxi = Math.max(Number(data[i].high), maxi);
            mini = Math.min(Number(data[i].low), mini)
        }

        //console.log("max,min", [Math.ceil(mini), Math.ceil(maxi)]);
        return [Math.floor(mini), Math.ceil(maxi)]

    }

    const getUSMarketBounds = (filter: string) => {

        console.log("filter", filter);
        switch (filter) {

            case "1D":
                // We use a fixed date or the current date, but force the hours
                if (data.length === 0) return [0, 0];
                // Use the date from the actual data instead of "new Date()"
                // This ensures the X-axis matches the day of the stock prices
                const referenceDate = new Date(data[0].time)
                const open = new Date(referenceDate);
                open.setHours(9, 30, 0, 0); // 9:30 AM
                const close = new Date(referenceDate);
                close.setHours(16, 0, 0, 0); // 4:00 PM
                return [open.getTime(), close.getTime()];
        }

    };

    const formatXAxis = (tickItem: number) => {

        switch (mainGraphFilter) {
            case "1D":
                const date = new Date(tickItem);
                return date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                });
            case "5D":
                const date2 = new Date(tickItem);
                return date2.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
            default:
                const date3 = new Date(tickItem);
                return date3.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                });

        }



    };

    const generateTradingTicks = () => {

        switch (mainGraphFilter) {
            case "1D":
                let ticks = [];
                if (data.length == 0) return []
                const referenceDate = new Date(data?.[0].time)
                const startTime = new Date(referenceDate);
                startTime.setHours(9, 30, 0, 0); // Market Open
                const endTime = new Date(referenceDate);
                endTime.setHours(16, 0, 0, 0); // Market Close
                let current = new Date(startTime);
                while (current <= endTime) {
                    ticks.push(current.getTime()); // Push timestamps
                    current.setMinutes(current.getMinutes() + 30); // 30-minute intervals
                }
                return ticks;
            case "5D":
                const uniqueDays: any[] = [];
                const seenDays = new Set();
                data.forEach((candle: any) => {
                    const dateStr = new Date(candle.time).toLocaleDateString();
                    if (!seenDays.has(dateStr)) {
                        uniqueDays.push(candle.time);
                        seenDays.add(dateStr);
                    }
                });
                return uniqueDays;
            default:
                return [];
        }

    };


    const getToolTipFormatter = (value: any) => {

        switch (mainGraphFilter) {

            case "1D":
                const date = new Date(value);
                return date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true // Set to false if you want 24-hour HH:mm
                });

            case "5D":
                const date2 = new Date(value);
                return date2.toLocaleTimeString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true // Set to false if you want 24-hour HH:mm
                });


        }

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

    // const getFormttedDate


    return <>

        <div className="border border-red-400 p-7">

            <div className="flex gap-2">
                <span><Mountain size={18} /></span>
                <span> INVESCO QQQ Trust, Series 1</span>
            </div>
            <div className="market-status">
                {isMarketOpen() ? <span className="text-green-400">OPEN</span> : <span className="text-danger-400">CLOSED</span>}
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

                                type={mainGraphFilter == '1D' ? 'number' : 'category'}
                                scale={mainGraphFilter == '1D' ? 'time' : undefined}
                                dataKey="time"
                                domain={mainGraphFilter == '1D' ? getUSMarketBounds(mainGraphFilter) : ['dataMin', 'dataMax']}
                                tickFormatter={formatXAxis}
                                ticks={generateTradingTicks()}
                                padding={{ right: 40, left: 40 }}

                            />
                            <Tooltip
                                labelFormatter={(value) => getToolTipFormatter(value)}
                                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '4px' }}
                            />

                            <YAxis
                                type="number"
                                domain={getYAxisRange(data)}
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