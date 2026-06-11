import { CHART_COLOR_MAP, COLOR_MAP } from "./constants";

export function getMarketMetrics(
    currentPrice: number,
    prevClose: number,
    fallbackDp: number
) {
    const absoluteChange = (currentPrice - prevClose);
    const percentageChange = (prevClose > 0) ? (absoluteChange / prevClose) * 100 : (fallbackDp ?? 0);
    const trend: Trend = (absoluteChange > 0) ? 'up' : (absoluteChange < 0) ? 'down' : 'flat'
    const sign = (trend == 'up') ? '+' : (trend == 'down') ? '-' : '';
    const color = COLOR_MAP[trend]
    const chartColor = CHART_COLOR_MAP[trend]


    return {
        absoluteChange,
        percentageChange,
        trend,
        sign,
        color,
        chartColor
    }


}