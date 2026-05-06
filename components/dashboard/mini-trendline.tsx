import { getTrendData } from '@/lib/api/stocks';
import { useEffect, useState } from 'react';
import { Line, LineChart, ReferenceLine, ResponsiveContainer, YAxis } from 'recharts';






export const MiniTrendLineChart = ({ symbol, prevClose }: { symbol: string, prevClose: number }) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<any[]>([]);
    const [refPos, setRefPos] = useState<"inside" | "above" | "below">("inside");

    useEffect(() => {

        const getData = async () => {
            console.log(`%c API CALL TRIGGERED FOR: ${symbol}`, "color: yellow; background: red;");
            setLoading(true);
            let data = await getTrendData(symbol);
            console.log(`data for ${symbol}`, data)
            setLoading(false);
            parseData(data);
        }

        console.log("prev close", prevClose);
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


        console.log(`data for ${symbol}`, trendData);



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
            newRange = [mini, maxi + (range * 0.2)];
            setRefPos("above");

        }
        else if (maxi > 0 && mini > 0) {
            // if all numbers are positive then, ref line below.
            newRange = [mini - (range * 0.2), maxi];
            setRefPos("below");
        }
        else {
            newRange = [mini, maxi];
            setRefPos("inside");
        }

        console.log("range", newRange)
        setRange(newRange)
        // return newRange;

    }




    if (loading || data.length === 0 || prevClose == 0) {
        return <div style={{ height: 50, width: '100%', background: '#1a1a1a' }} />;
    }

    return <>
        <ResponsiveContainer width="100%" height={50}>
            <LineChart
                data={data}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
                <YAxis
                    domain={range}
                    // domain={[
                    //     (dataMin: number) => Math.min(dataMin, 0),
                    //     (dataMax: number) => Math.max(dataMax, 0),
                    // ]}
                    hide

                />

                <ReferenceLine
                    y={refPos == "inside" ? 0 : refPos == "above" ? (range[1] + ((range[1] - range[0]) * 0.5)) : (range[0] - ((range[1] - range[0]) * 0.5))}
                    stroke="green" // Subtle grey/white
                    strokeDasharray="2 2"
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
            </LineChart>
        </ResponsiveContainer>

    </>

}