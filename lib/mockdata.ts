// mockStocks.ts
// export const mockStocks: Stock[] = [
//     { symbol: "AAPL", name: "Apple Inc." },
//     { symbol: "TSLA", name: "Tesla Inc.", price: 217.45, change: -0.8 },
//     { symbol: "NVDA", name: "NVIDIA Corp.", price: 721.30, change: 2.4 },
//     { symbol: "MSFT", name: "Microsoft Corp.", price: 404.22, change: 0.5 },
//     { symbol: "AMZN", name: "Amazon.com Inc.", price: 174.66, change: -0.3 },
// ]
// constants.js
export const POPULAR_STOCKS: Stock[] = [
    {
        symbol: 'AAPL',
        displaySymbol: 'AAPL',
        description: 'Apple Inc.'
    },
    { symbol: 'TSLA', displaySymbol: 'TSLA', description: 'Tesla Inc.' },
    { symbol: 'NVDA', displaySymbol: 'NVDA', description: 'NVIDIA Corp.' },
    { symbol: 'MSFT', displaySymbol: 'MSFT', description: 'Microsoft Corp.' },
    { symbol: 'AMZN', displaySymbol: 'AMZN', description: 'Amazon.com Inc.' },
    { symbol: 'GOOGL', displaySymbol: 'GOOGL', description: 'Alphabet Inc.' },
];