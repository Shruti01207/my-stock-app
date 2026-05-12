import { getTrendData } from '@/lib/api/stocks';
import { getISOFormattedDate, isMarketOpen } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Area, ComposedChart, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';






export const MiniTrendLineChart = ({ symbol, prevClose }: { symbol: string, prevClose: number }) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<any[]>([]);
    const [refPos, setRefPos] = useState<"inside" | "above" | "below">("inside");

    useEffect(() => {

        const getData = async () => {
            setLoading(true);
            const date = new Date();
            const ISODate = getISOFormattedDate(date);
            let startDate = '';
            let endDate = '';
            if (isMarketOpen()) {
                startDate = `${ISODate} 09:30:00`;
                endDate = `${ISODate} 16:00:00`;
            }
            let data = await getTrendData(symbol, startDate, endDate);
            setLoading(false);
            parseData(data);
        }


        if (prevClose > 0) {
            getData();
        }

    }, [prevClose, symbol])


    const parseData = (data: any) => {

        if (!prevClose || prevClose === 0) {
            return;
        }

        const d = data.values;
        const trendData = d.map((val: any) => ({
            datetime: val.datetime,
            close: ((Number(val.close) - prevClose) / prevClose) * 100
        })).reverse();



        setData(trendData);
        getRefLinePos(trendData)






    }

    const getRefLinePos = (data: any) => {
        // how do we found max?
        // 1,5,3,2,7
        // 5,
        let maxi = data?.[0].close;
        let mini = data?.[0].close;

        // find min and max
        data.forEach((d: any) => {
            maxi = Math.max(maxi, d.close);
            mini = Math.min(mini, d.close);
        })

        // -5 ->-2=>-2-(-5)=3
        // 2->5=>5-3=2
        //-10->5=>5-(-10)=>15

        //-5->-2=>-2-(-5)=3
        // [-5, -2+(3*0.2)]
        //[-5, -2+0.6=]
        let range = maxi - mini;

        let newRange;
        if (maxi < 0 && mini < 0) {
            // if all numbers are negative then, ref line above.
            newRange = [mini - (range * 0.5), maxi + (range * 0.5)];
            setRefPos("above");

        }
        else if (maxi > 0 && mini > 0) {
            // if all numbers are positive then, ref line below.
            newRange = [mini - (range * 0.5), maxi + (range * 0.5)];
            setRefPos("below");
        }
        else {
            newRange = [mini, maxi];
            setRefPos("inside");
        }
        setRange(newRange)
        // return newRange;

    }




    if (loading || data.length === 0 || prevClose == 0) {
        return <div style={{ height: 50, width: '100%', background: '#1a1a1a' }} />;
    }

    return <>
        <ResponsiveContainer width="100%" height={60}>
            <ComposedChart
                data={data}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >

                <defs>
                    <linearGradient
                        id="miniChartGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="#f43f5e"
                            stopOpacity={0.35}
                        />
                        <stop
                            offset="100%"
                            stopColor="#f43f5e"
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>

                <YAxis
                    domain={range}
                    hide
                />
                <XAxis hide dataKey="datetime" />


                <ReferenceLine
                    y={refPos == "inside" ? 0 : refPos == "above" ? range[1] : range[0]}
                    stroke="white" // Subtle grey/white
                    strokeDasharray="2 2"
                />

                <Area
                    type="monotone"
                    dataKey="close"
                    stroke="none"
                    fill="url(#miniChartGradient)"
                    fillOpacity={1}
                    isAnimationActive={false}
                />

                <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#f43f5e"
                    strokeWidth={1}
                    dot={false}
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