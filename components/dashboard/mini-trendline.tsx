import { useMarketData } from '@/hooks/useMarketData';
import { useMiniTrend } from '@/hooks/useMiniTrend';;
import { getISOFormattedDate, isMarketOpen } from '@/lib/utils';
import { useMemo } from 'react';
import { Area, ComposedChart, Line, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';






export const MiniTrendLineChart = ({ symbol }: { symbol: string }) => {

    const date = new Date();
    const ISODate = getISOFormattedDate(date);
    let startDate = '';
    let endDate = '';
    if (isMarketOpen()) {
        startDate = `${ISODate} 09:30:00`;
        endDate = `${ISODate} 16:00:00`;
    }
    const marketData = useMarketData(symbol);
    const { data, isLoading, isError, isFetching } = useMiniTrend(symbol, startDate, endDate, marketData.prevClose);


    // useEffect(() => {
    //     const getData = async () => {
    //         setLoading(true);

    //         let data = await getTrendData(symbol, startDate, endDate);
    //         setLoading(false);
    //         parseData(data);
    //     }


    //     if (prevClose > 0) {
    //         getData();
    //     }

    // }, [prevClose, symbol])


    // const parseData = (data: any) => {

    //     if (!prevClose || prevClose === 0) {
    //         return;
    //     }

    //     const d = data.values;
    //     const trendData = data.values.map((val: any) => ({
    //         datetime: new Date(val.datetime).getTime(),
    //         close: ((Number(val.close) - prevClose) / prevClose) * 100
    //     })).reverse();

    //     // console.log(`trendData for ${symbol}`, trendData);
    //     // const isPositive = trendData[trendData.length - 1].close >= trendData[0].close;
    //     // const color = isPositive ? 'green' : 'red';
    //     // setColor(color);




    //     setData(trendData);
    //     getRefLinePos(trendData)






    // }

    const { range, refPos } = useMemo(() => {

        if (!data || data.length == 0) {
            return {
                range: [0, 0],
                refPos: "inside"
            }
        }

        let maxi = data?.[0].close;
        let mini = data?.[0].close;

        // find min and max
        data.forEach((d: any) => {
            maxi = Math.max(maxi, d.close);
            mini = Math.min(mini, d.close);
        })

        let range = maxi - mini;

        let newRange;
        if (maxi < 0 && mini < 0) {
            // if all numbers are negative then, ref line above.
            newRange = [mini - (range * 0.2), maxi + (range * 0.2)];
            return {
                range: newRange,
                refPos: "above"
            }
        }
        else if (maxi > 0 && mini > 0) {
            // if all numbers are positive then, ref line below.
            newRange = [mini - (range * 0.2), maxi + (range * 0.2)];
            //setRefPos("below");
            return {
                range: newRange,
                refPos: "below"
            }

        }
        else {
            newRange = [mini, maxi];
            return {
                range: newRange,
                refPos: "inside"
            }

        }

    }, [data])




    const getUSMarketBounds = (): [number, number] => {
        // We use a fixed date or the current date, but force the hours
        if (data.length === 0) return [0, 0];
        // Use the date from the actual data instead of "new Date()"
        // This ensures the X-axis matches the day of the stock prices

        const referenceDate = new Date(data[0].datetime)
        const open = new Date(referenceDate);
        open.setHours(9, 30, 0, 0); // 9:30 AM
        const close = new Date(referenceDate);
        close.setHours(16, 0, 0, 0); // 4:00 PM
        return [open.getTime(), close.getTime()];

    };



    if (isLoading || !data || data.length === 0 || marketData.prevClose == 0) {
        return <div className="h-[60px] animate-pulse rounded bg-muted" />;
    }

    return <>

        <ResponsiveContainer width="100%" height={60} className="focus:outline-none" style={{ outline: 'none' }}>
            <ComposedChart
                data={data}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                accessibilityLayer={false}
                style={{ pointerEvents: 'none' }}
            >

                <defs>
                    <linearGradient
                        id={`miniChartGradient-${symbol}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                        style={{ outline: 'none' }}
                    >
                        <stop
                            offset="0%"
                            stopColor={marketData.chartColor}
                            stopOpacity={0.35}
                        />
                        <stop
                            offset="100%"
                            stopColor={marketData.chartColor}
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>

                <YAxis
                    domain={range}
                    hide
                />
                {/* <XAxis hide dataKey="datetime"  /> */}

                <XAxis
                    hide
                    type={'number'}
                    scale={'time'}
                    dataKey="datetime"
                    domain={getUSMarketBounds}
                />
                <ReferenceLine
                    y={refPos == "inside" ? 0 : refPos == "above" ? range[1] : range[0]}
                    stroke="white" // Subtle grey/white
                    strokeDasharray="1 6"
                />

                <Area
                    type="monotone"
                    dataKey="close"
                    stroke="none"
                    fill={`url(#miniChartGradient-${symbol})`}
                    fillOpacity={1}
                    isAnimationActive={false}
                />

                <Line
                    type="monotone"
                    dataKey="close"
                    stroke={marketData.chartColor}
                    strokeWidth={1}
                    isAnimationActive={false}
                    dot={false}
                    activeDot={false}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                // activeDot={{
                //     stroke: 'green',
                // }}
                />


            </ComposedChart>
        </ResponsiveContainer >

    </>

}