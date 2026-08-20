import { syncWatchlist } from "./actions/watchlist.actions";
import { LocalStorageKeys } from "./enums";

export const syncDataWithServer = async () => {
    const storageString = localStorage.getItem(LocalStorageKeys.watchlistStorage)
    if (storageString == null) {
        return;
    }
    const localWatchlist = JSON.parse(storageString).state?.watchlist
    await syncWatchlist(localWatchlist);
}