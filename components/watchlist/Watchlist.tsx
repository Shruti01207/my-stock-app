
'use client'
import { getWatchlist } from '@/lib/actions/watchlist.actions';
import { useSearchStore } from '@/stores/useSearchStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { Plus } from 'lucide-react';
import { memo, useEffect } from 'react';
import { useWatchlistData } from './useWatchlistData';
import { WatchlistTable } from './WatchlistTable';




export const WatchList = () => {

    const onOpen = useSearchStore((state) => state.onOpen);
    const setWatchlist = useWatchlistStore((state) => state.setWatchList)



    useEffect(() => {
        const getList = async () => {
            const res = await getWatchlist()
            const list = res.data;
            if (list) {
                setWatchlist(list.symbols)
            }
        }
        getList();
    }, [])








    return (
        <>
            <div className="flex justify-between items-center p-2">
                <h1 className='text-xl font-medium' >Watchlist</h1>
                <div className="action-btn">
                    <button onClick={() => onOpen("watchlist")} className='inline-flex items-center justify-center rounded-full p-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"'>
                        <Plus />
                    </button>
                </div>
            </div>

            <WatchlistTable />

        </>



    );
}

export default memo(WatchList);
