import { symbol } from "better-auth";
import { log } from "console";

export interface FinhubQuote {
    c: number,
    h: number,
    d: number;
    dp: number;
    l: number,
    o: number,
    pc: number,
    t: number
}

export const fetchStockPrice = async (symbol: string): Promise<FinhubQuote> => {

    const apiKey = process.env.FINNHUB_API_KEY
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error("Failed to fetch stock data");
    }

    return response.json();

}

export const searchStock = async (symbol: string): Promise<any> => {
    const apiKey = process.env.FINNHUB_API_KEY
    const url = `https://finnhub.io/api/v1/search?q=${symbol}&exchange=US&token=${apiKey}`;
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error("Failed to fetch stock data");
    }

    return response.json();
}

export const getTrendData = async (symbol: string, startDate: string, endDate: string): Promise<any> => {
    const apiKey = process.env.TWELVEDATA_API_KEY;
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=390&start_date=${startDate}&end_date=${endDate}&apikey=${apiKey}`;
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error("Failed to fetch stock data");
    }

    return response.json();
}

export const getGraphData = async (symbol: String | null, interval: string | null, outputSize: String | null, startDate: String | null, endDate: String | null): Promise<any> => {
    const apiKey = process.env.TWELVEDATA_API_KEY;
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&outputsize=${outputSize}&interval=${interval}&start_date=${startDate}&end_date=${endDate}&prepost=false&apikey=${apiKey}`;
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error("Failed to fetch stock data");
    }

    return response.json();
}

// arrow function-> ()=>{ }
export const getLatestNew = async (category: string) => {
    console.log("get latest news called");
    const apiKey = process.env.FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/news?category=${category}&token=${apiKey}`;

    // why await?
    // await is required because fetch-> makes an api call->it creates http request->communicate with network
    // fetch is asynchronous function and returns promise
    // by await wait for the promise to resolve and give us actual response data
    // without await response will contain promise object
    // instead of resolved promise data

    // promise-> a future value
    // **VERY IMPORTANT**
    //  await doesn't block the entire javascript thread means
    // browser remain responsive
    // event loop continues
    // other code can execute

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }

    return response.json();

}