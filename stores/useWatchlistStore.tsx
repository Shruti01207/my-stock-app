import { addSymbolToWatchlist, removeSymbolFromWatchlist } from '@/lib/actions/watchlist.actions';
import { symbol } from 'better-auth';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WatchlistStore {
  watchlist: string[];
  addStock: (symbol: string) => void
  removeStock: (symbol: string) => void
  toggleStock: (symbol: string) => void
  isInWatchList: (symbol: string) => boolean
  setWatchList: (symbols: string[]) => void
}


export const useWatchlistStore = create<WatchlistStore>()(persist((set, get) => ({
  watchlist: [],
  addStock: async (symbol) => {
    const oldlist = get().watchlist;
    if (oldlist.includes(symbol))
      return;
    set({
      watchlist: [...oldlist, symbol]
    })
    //server sync
    try {
      await addSymbolToWatchlist(symbol);
    }
    catch {
      // if adding in db fails rollback on frontend also
      set({ watchlist: oldlist })
    }
    console.log("watchlist", [...oldlist, symbol])
  },

  removeStock: async (symbol) => {

    const oldlist = get().watchlist;

    const updated = oldlist.filter((oldlist) => oldlist != symbol);
    set({ watchlist: updated });

    try {
      await removeSymbolFromWatchlist(symbol)
    }
    catch {
      console.log("catch called");
      set({ watchlist: oldlist });

    }

  },
  toggleStock: (symbol) => {
    set((state) => {
      if (state.watchlist.includes(symbol)) {
        return { watchlist: state.watchlist.filter((sym) => sym != symbol) }
      }
      else {
        return { watchlist: [...state.watchlist, symbol] }
      }
    })
  },
  isInWatchList: (symbol) => {
    return get().watchlist.includes(symbol);
  },
  setWatchList: (symbols: string[]) => {
    set({ watchlist: symbols })
  } // function setting watchlist
}), {
  name: "watchlist-storage",
}))

