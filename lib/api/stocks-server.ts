
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
    console.log("response", response);

    if (!response.ok) {
        throw new Error("Failed to fetch stock data");
    }

    return response.json();
}


export const getLatestNew = async (category: string) => {
    console.log("get latest news called");
    const apiKey = process.env.FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/news?category=${category}&token=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }

    return response.json();

}


export async function getMarketStatus(exchange: string) {
    const API_KEY = process.env.ALPACAN_API_KEY!
    const SECRET_KEY = process.env.ALPACAN_SECRET_KEY!
    const url = `https://paper-api.alpaca.markets/v2/clock`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'APCA-API-KEY-ID': API_KEY,
            'APCA-API-SECRET-KEY': SECRET_KEY
        }
    });

    return response.json();


}


export async function getCompanyProfile(symbol: string) {
    const apiKey = process.env.FINNHUB_API_KEY
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
    const res = await fetch(url);
    return res.json();
}

export async function getStockMetric(symbol: string) {
    const apiKey = process.env.FINNHUB_API_KEY
    const url = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${apiKey}`;
    const res = await fetch(url);
    return res.json();
}


export async function getNewsSentiments(symbol: string) {
    const apiKey = process.env.ALPHA_VANTAGE_KEY
    const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&sort=RELEVANCE&apikey=${apiKey}`;
    const res = await fetch(url);
    return res.json();
}

export async function getSymbolsInfo(symbol: string) {
    const apiKey = process.env.FINNHUB_API_KEY
    const url = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`;
    const res = await fetch(url);
    return res.json();
}

export async function createAlert(alertRequest: AlertRequest): Promise<any> {
    try {
        const url = `/api/alerts`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(alertRequest)
        })

        if (!res.ok) {
            throw new Error("Failed to create alert");
        }

        const data = await res.json();
        return data;

    }
    catch (error) {
        console.error("error", error)
    }

}