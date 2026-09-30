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

export const searchStock = async (symbol: string): Promise<FinnhubSearchResponse> => {
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

export const getGraphData = async (symbol: string, interval: string | null, outputSize: String | null, startDate: String | null, endDate: String | null, lastActiveTradingDay: boolean): Promise<any[]> => {
  const apiKey = process.env.TWELVEDATA_API_KEY;
  const url = `/api/market/timeseries?symbols=${symbol}&outputSize=${outputSize}&interval=${interval}&startDate=${startDate}&endDate=${endDate}&ttlMs=120000&lastActiveTradingDay=${lastActiveTradingDay}`;
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch stock data");
  }

  const data = await response.json();
  return data[symbol];
}


export const getLatestNew = async () => {
  const url = `/api/market/news?category=general`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }
  return response.json();

}

export async function getMarketStatus(exchange: string) {
  const url = `/api/market/market-status?exchange=${exchange}`;
  const response = await fetch(url);
  return response.json();
}

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile> {
  const url = `/api/market/company-profile?symbol=${symbol}`;
  const res = await fetch(url);
  return res.json();
}

export async function getStockMetric(symbol: string) {
  const url = `/api/market/stock-metric?symbol=${symbol}`;
  const res = await fetch(url);
  return res.json();
}



export async function getNewsSentiments(symbol: string): Promise<NewsSentimentApiResponse> {
  const url = `/api/market/news-sentiment?symbol=${symbol}`;
  const res = await fetch(url);
  return res.json();
}

export async function getSymbolsInfo(): Promise<SymbolInfo[]> {
  const url = `/api/market/symbols-info`;
  const res = await fetch(url);
  return res.json();
}

export async function createAlert(alertRequest: AlertRequest): Promise<ApiResponse<Alert>> {
  try {
    const url = `/api/alerts`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(alertRequest)
    })

    const data = await res.json();
    return data;

  }
  catch (error: any) {
    console.error("error", error);
    return ({ success: false, error: error?.message || "INTERNAL_SERVER_ERROR" })
  }

}

export async function editAlert(alertRequest: AlertRequest): Promise<ApiResponse<Alert>> {
  try {
    const url = `/api/alerts?id=${alertRequest.alertId}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(alertRequest)
    })
    const data = await res.json();
    return data;

  }
  catch (error: any) {
    console.error("error", error)
    return ({ success: false, error: error?.message || "INTERNAL_SERVER_ERROR" })
  }

}

export async function deleteAlert(alertId: string): Promise<ApiResponse<Alert>> {
  try {
    const url = `/api/alerts?id=${alertId}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data = await res.json();
    return data;

  }
  catch (error: any) {
    console.error("error", error)
    return ({ success: false, error: error?.message || "INTERNAL_SERVER_ERROR" })
  }

}


export async function getAlerts(): Promise<ApiResponse<Alert[]>> {

  try {
    const url = `/api/alerts`;
    const res = await fetch(url)
    const data = await res.json()
    console.log("data", data);
    return data;
  }
  catch (error: any) {
    console.error("error", error)
    return ({ success: false, error: error?.message || "INTERNAL_SERVER_ERROR" })
  }


}


export async function getMarketMovers(): Promise<ApiResponse<MarketMoversData>> {
  console.log("get market movers called");
  try {
    const url = '/api/market/market-movers';
    const res = await fetch(url)

    const data = await res.json()
    console.log("data in market movers func", data);
    return data;
  }
  catch (error: any) {
    console.error("error", error)
    return ({ success: false, error: error?.message || "INTERNAL_SERVER_ERROR" })
  }
}