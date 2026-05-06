import { useWatchlistStore } from "@/stores/useWatchlistStore";
import { CommandItem } from "cmdk"
import { Plus, Trash } from "lucide-react";

export const StockRow = ({ result, mode }: { result: Stock, mode: StockSearchMode }) => {

    const addToWatchlist = useWatchlistStore((state) => state.addStock);
    const isInWatchList = useWatchlistStore((state) => state.isInWatchList);
    const removeFromWatchlist = useWatchlistStore((state) => state.removeStock);
    const watchlist = useWatchlistStore((store) => store.watchlist)
    const inWatchList = isInWatchList(result.symbol)



    return (
        <CommandItem key={result.symbol} className="flex justify-between" >

            <div className="label flex justify-">
                <div>
                    {result.displaySymbol}
                </div>
                <div className="ms-2">
                    {result.description}
                </div>
            </div>

            {mode == "watchlist" && <button onClick={() => { inWatchList ? removeFromWatchlist(result.symbol) : addToWatchlist(result.symbol) }}>
                {inWatchList ? <Trash strokeWidth={4}></Trash> : <Plus strokeWidth={4}></Plus>}
            </button>}



            {/* {!isInWatchList(result.symbol) && <button className="font-bold"
                onClick={() => addToWatchlist(result.symbol)}>
                <Plus strokeWidth={4}></Plus>
            </button>}
            {isInWatchList(result.symbol) && <button className="font-bold"
                onClick={() => removeFromWatchlist(result.symbol)}>
                <Trash strokeWidth={4}></Trash>
            </button>} */}
        </CommandItem>
    )

}