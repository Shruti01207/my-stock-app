
'use client'
import { Plus } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import { WatchlistTable } from './WatchlistTable';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useSearchStore } from '@/stores/useSearchStore';
import { fetchStockPrice } from '@/lib/api/stocks';
import { useWatchlistData } from './useWatchlistData';
import { addSymbolToWatchlist, getWatchlist } from '@/lib/actions/watchlist.actions';


// const dummyData: Stock[] = [
//     { symbol: "AAPL", name: "Apple Inc.", price: 185.92, change: 0.45 },
//     { symbol: "MSFT", name: "Microsoft Corp.", price: 402.12, change: -1.2 },
//     { symbol: "GOOGL", name: "Alphabet Inc.", price: 145.67, change: 0.82 },
//     { symbol: "TSLA", name: "Tesla, Inc.", price: 193.57, change: -2.4 },
//     { symbol: "AMZN", name: "Amazon.com, Inc.", price: 174.42, change: 1.15 },
// ];

export const WatchList = () => {

    const watchlist = useWatchlistStore((state) => state.watchlist)// explicit return when without {}
    const addStock = useWatchlistStore((state) => state.addStock)
    const onOpen = useSearchStore((state) => state.onOpen);
    const setWatchlist = useWatchlistStore((state) => state.setWatchList)
    // const [stockData, setStockData] = useState<StockData[]>([]);

    // useEffect(() => {

    //     const getStockData = async () => {
    //         const promises: Promise<StockData>[] = watchlist.map(async (sym) => {
    //             const data = await fetchStockPrice(sym);
    //             return {
    //                 symbol: sym,
    //                 price: data.c,
    //                 change: data.pc,
    //                 high: data.h,
    //                 low: data.l
    //             }
    //         })
    //         const stockData: StockData[] = await Promise.all(promises);
    //         setStockData(stockData)
    //         console.log("stockData", stockData)
    //     }

    //     getStockData()
    //     // Only seed if the watchlist is currently empty
    //     // if (watchlist.length === 0) {
    //     //     dummyData.forEach(stock => addStock(stock.symbol));
    //     // }









    // }, [watchlist]);

    const { data, isLoading, isError } = useWatchlistData(watchlist)

    useEffect(() => {
        const getList = async () => {
            const list = await getWatchlist()

            if (list) {
                setWatchlist(list.symbols)
            }
        }
        getList();
    }, [])






    // const filteredData = dummyData.filter((stock) => watchlist.includes(stock.symbol))


    return (
        <>   <div className="header flex justify-between p-4">
            <h1 className='text-xl font-medium' >Watchlist</h1>
            <div className="action-btn">
                <button onClick={() => onOpen("watchlist")} className='inline-flex items-center justify-center rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"'>
                    <Plus />
                </button>
            </div>
        </div>

            <WatchlistTable data={data} />

        </>



    );
}

export default memo(WatchList);
