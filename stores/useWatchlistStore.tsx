import { addSymbolToWatchlist, removeSymbolFromWatchlist } from '@/lib/actions/watchlist.actions';
import { LocalStorageKeys } from '@/lib/enums';
import { toast } from 'sonner';
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

    const res = await addSymbolToWatchlist(symbol);
    if (!res.success) {
      if (res.error == 'UNAUTHORIZED') {
        toast.info("Stock added locally. Please login to sync across devices")
      }
      else {
        toast.error("Failed to add stock to your account.")
        set({ watchlist: oldlist })
      }
    }



  },

  removeStock: async (symbol) => {

    const oldlist = get().watchlist;

    const updated = oldlist.filter((oldlist) => oldlist != symbol);
    set({ watchlist: updated });


    const res = await removeSymbolFromWatchlist(symbol)
    if (!res.success) {
      if (res.error == 'UNAUTHORIZED') {
        toast.info("Stock removed locally. Please login to sync across devices")
      }
      else {
        toast.error("Failed to remove stock to your account.")
        set({ watchlist: oldlist })
      }
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
  name: LocalStorageKeys.watchlistStorage,
}))

