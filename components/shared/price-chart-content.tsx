
import { FILTER_KEY, PRICE_CHART_FILTER_CONFIG } from "@/lib/config/chartFilter"
import { useState } from "react"
import { Area, ComposedChart, Line, Tooltip, XAxis, YAxis } from "recharts"



export const PriceChartContent = ({ data, mainGraphFilter, symbol, chartColor }: { data: PriceChartData[], mainGraphFilter: FILTER_KEY, symbol: string, chartColor: string }) => {

    const [activeX, setActiveX] = useState(null)
    const handleClick = (e: any) => {
        if (e && e.activeLabel) {
            setActiveX(e.activeLabel);
        }
    }


    const LastPriceDot = ({ cx, cy, index, dataLength, dotColor }: any) => {
        if (index !== dataLength - 1) return null;

        return (
            <g>
                {/* pulse */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill={dotColor}
                    style={{
                        animation: "pricePulse 1.5s infinite"
                    }}
                />

                {/* actual dot */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={dotColor}
                />
            </g>
        );
    };

    return <>
        <ComposedChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            onClick={handleClick}


        >
            {/* <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.3}
            /> */}
            <XAxis

                type={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].type}
                scale={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].scale}
                dataKey="time"
                domain={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].getXAxisDomain(data)}
                tickFormatter={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].formatXAxis}
                ticks={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].generateTradingTicks(data)}
                padding={{ right: 10, left: 10 }}
                tick={{ fill: "#ffff" }}

            // interval="preserveStartEnd"
            />
            <Tooltip
                labelFormatter={(value) => PRICE_CHART_FILTER_CONFIG[mainGraphFilter].getToolTipFormatter(value)}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '4px' }}

            />

            <defs>
                <linearGradient
                    id={`miniChartGradient-${symbol}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stopColor={chartColor}
                        stopOpacity={0.5}
                    />
                    <stop
                        offset="100%"
                        stopColor={chartColor}
                        stopOpacity={0.1}
                    />
                </linearGradient>
            </defs>

            <YAxis
                type="number"
                domain={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].getYAxisRange(data)}
                padding={{ top: 10, bottom: 10 }}
                tick={{ fill: "#ffff" }}

            />

            <Area
                type="monotone"
                dataKey="close"
                stroke="none"
                fill={`url(#miniChartGradient-${symbol})`}
                fillOpacity={1}
                baseValue="dataMin"
                isAnimationActive={false}
                tooltipType="none"
            />

            <Line
                type={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].lineType}
                dataKey="close"
                stroke={chartColor}
                strokeWidth={2}
                // dot={false}
                strokeLinecap={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].strokeLinecap}
                strokeLinejoin={PRICE_CHART_FILTER_CONFIG[mainGraphFilter].strokeLinejoin}
                isAnimationActive={false}
                dot={(props) => (
                    <LastPriceDot
                        {...props}
                        dataLength={data.length}
                        dotColor={chartColor}
                    />
                )}
            // activeDot={{
            //     stroke: 'green',
            // }}
            />

        </ComposedChart>
    </>


}