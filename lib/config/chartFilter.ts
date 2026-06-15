import { MONTH_NUMBER_MAP } from "../constants";

export interface FILTER_CONFIG {
    type: "number" | "category",
    scale: "time" | undefined,
    strokeLinecap: 'round' | 'butt',
    strokeLinejoin: 'round' | 'miter',
    lineType: "monotone" | "linear",
    getXAxisDomain: (data: PriceChartData[]) => number[] | string[],
    formatXAxis: (tickItem: number) => string,
    generateTradingTicks: (data: PriceChartData[]) => number[],
    getToolTipFormatter: (value: any) => string,
    getYAxisRange: (data: PriceChartData[]) => [number, number]

}


export type FILTER_KEY = "1D" | "5D" | "1M" | "6M"
// | "1M"

export const PRICE_CHART_FILTER_CONFIG: Record<FILTER_KEY, FILTER_CONFIG> = {

    "1D": {
        type: "number",
        scale: 'time',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        lineType: "monotone",
        getXAxisDomain: (data: PriceChartData[]) => {
            if (data.length === 0) return [0, 0];
            // Use the date from the actual data instead of "new Date()"
            // This ensures the X-axis matches the day of the stock prices
            const referenceDate = new Date(data[0].time)
            const open = new Date(referenceDate);
            open.setHours(9, 30, 0, 0); // 9:30 AM
            const close = new Date(referenceDate);
            close.setHours(16, 0, 0, 0); // 4:00 PM
            return [open.getTime(), close.getTime()];
        },
        formatXAxis: (tickItem: number) => {
            const date = new Date(tickItem);
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        },
        generateTradingTicks: (data: PriceChartData[]) => {
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
        },
        getToolTipFormatter: (value: any) => {
            const date = new Date(value);
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true // Set to false if you want 24-hour HH:mm
            });
        },
        getYAxisRange: (data: PriceChartData[]): [number, number] => {
            if (data.length == 0) {
                return [0, 0]
            }
            let maxi = -Infinity;
            let mini = Infinity;
            for (let i = 0; i < data.length; i++) {
                maxi = Math.max(Number(data[i].high), maxi);
                mini = Math.min(Number(data[i].low), mini)
            }
            return [Math.floor(mini), Math.ceil(maxi)]
        }
    },
    "5D": {
        type: "category",
        scale: undefined,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        lineType: "monotone",
        getXAxisDomain: () => {
            return ['dataMin', 'dataMax'];
        },
        formatXAxis: (tickItem: number) => {
            const date2 = new Date(tickItem);
            return date2.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        },
        generateTradingTicks: (data: PriceChartData[]) => {
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
        },
        getToolTipFormatter: (value: any) => {
            const date2 = new Date(value);
            return date2.toLocaleTimeString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true // Set to false if you want 24-hour HH:mm
            });
        },
        getYAxisRange: (data: PriceChartData[]): [number, number] => {
            if (data.length == 0) {
                return [0, 0]
            }
            let maxi = -Infinity;
            let mini = Infinity;
            for (let i = 0; i < data.length; i++) {
                maxi = Math.max(Number(data[i].high), maxi);
                mini = Math.min(Number(data[i].low), mini)
            }
            return [Math.floor(mini), Math.ceil(maxi)]
        }

    },
    "1M": {
        type: "category",
        scale: undefined,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        lineType: "linear",
        getXAxisDomain: () => {
            return ['dataMin', 'dataMax'];
        },
        formatXAxis: (tickItem: number) => {
            const date2 = new Date(tickItem);
            return date2.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        },
        generateTradingTicks: (data: PriceChartData[]) => {
            const uniqueDays: any[] = [];
            const seenDays = new Set();
            data.forEach((candle: any, i) => {
                const dateStr = new Date(candle.time).toLocaleDateString();
                if (((i + 1) % 5 == 1) && !seenDays.has(dateStr)) {
                    uniqueDays.push(candle.time);
                    seenDays.add(dateStr);
                }
            });
            return uniqueDays;
        },
        getToolTipFormatter: (value: any) => {
            const date2 = new Date(value);
            return date2.toLocaleTimeString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true // Set to false if you want 24-hour HH:mm
            });
        },
        getYAxisRange: (data: PriceChartData[]): [number, number] => {
            if (data.length == 0) {
                return [0, 0]
            }
            let maxi = -Infinity;
            let mini = Infinity;
            for (let i = 0; i < data.length; i++) {
                maxi = Math.max(Number(data[i].high), maxi);
                mini = Math.min(Number(data[i].low), mini)
            }
            return [Math.floor(mini), Math.ceil(maxi)]
        }


    },
    "6M": {
        type: "category",
        scale: undefined,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        lineType: "monotone",
        getXAxisDomain: () => {
            return ['dataMin', 'dataMax'];
        },
        formatXAxis: (tickItem: number) => {
            const date2 = new Date(tickItem);
            return date2.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
            });
        },
        generateTradingTicks: (data: PriceChartData[]) => {
            const uniqueDays: any[] = [];
            const seenMonthYear = new Set();
            data.forEach((candle: any, i) => {
                const date = new Date(candle.time);
                const month = MONTH_NUMBER_MAP[date.getMonth()]
                const year = date.getFullYear();
                const monthYear = month + " " + year;
                if (!seenMonthYear.has(monthYear)) {
                    uniqueDays.push(candle.time);
                    seenMonthYear.add(monthYear);
                }
            });
            console.log("uniqueMonthYears=", uniqueDays);
            return uniqueDays;
        },
        getToolTipFormatter: (value: any) => {
            const date2 = new Date(value);
            return date2.toLocaleTimeString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true // Set to false if you want 24-hour HH:mm
            });
        },
        getYAxisRange: (data: PriceChartData[]): [number, number] => {
            if (data.length == 0) {
                return [0, 0]
            }
            let maxi = -Infinity;
            let mini = Infinity;
            for (let i = 0; i < data.length; i++) {
                maxi = Math.max(Number(data[i].high), maxi);
                mini = Math.min(Number(data[i].low), mini)
            }
            return [Math.floor(mini), Math.ceil(maxi)]
        }


    }





}

export const TIMEFRAME_CONFIGS: Record<FILTER_KEY, { interval: string, outputSize: string }> = {
    "1D": { interval: '1min', outputSize: '390' },
    "5D": { interval: '5min', outputSize: '390' },
    "1M": { interval: '1day', outputSize: '23' },
    "6M": { interval: '1day', outputSize: '138' }
}