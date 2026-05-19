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
  const url = `/api/market/quotes?symbols=${symbol}`;
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch stock data");
  }

  const data = await response.json();

  return data[symbol];

}

export const searchStock = async (symbol: string): Promise<any> => {
  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
  const url = `https://finnhub.io/api/v1/search?q=${symbol}&exchange=US&token=${apiKey}`;
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch stock data");
  }

  return response.json();
}

export const getTrendData = async (symbol: string, startDate: string, endDate: string): Promise<any> => {
  const apiKey = process.env.TWELVEDATA_API_KEY;
  const url = `/api/market/timeseries?symbols=${symbol}&interval=1min&outputSize=390&startDate=${startDate}&endDate=${endDate}&ttlMs=300000`;
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch stock data");
  }

  const data = await response.json();
  return data[symbol];
}

export const getGraphData = async (symbol: string, interval: string | null, outputSize: String | null, startDate: String | null, endDate: String | null): Promise<any> => {
  const apiKey = process.env.TWELVEDATA_API_KEY;
  const url = `/api/market/timeseries?symbols=${symbol}&outputSize=${outputSize}&interval=${interval}&startDate=${startDate}&endDate=${endDate}&ttlMs=120000`;
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch stock data");
  }

  const data = await response.json();
  return data[symbol];
}

// arrow function-> ()=>{ }
export const getLatestNew = async () => {
  // const url = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`;
  const url = `/api/market/news?category=general`;
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