import { useSearchStore } from "@/stores/useSearchStore";
import { useWatchlistStore } from "@/stores/useWatchlistStore";
import { CommandItem } from "cmdk";
import { Plus, Trash } from "lucide-react";
import Link from "next/link";

export const StockRow = ({ result }: { result: Stock }) => {
  const addToWatchlist = useWatchlistStore((state) => state.addStock);
  const isInWatchList = useWatchlistStore((state) => state.isInWatchList);
  const removeFromWatchlist = useWatchlistStore((state) => state.removeStock);
  const inWatchList = isInWatchList(result.symbol);
  const { isOpen, onClose, onOpen, mode } = useSearchStore();

  return (
    <CommandItem key={result.symbol} className="flex hover:bg-muted justify-between">
      <Link
        className="label flex"
        href={`/overview/${result.symbol}`}
        onClick={() => onClose()}
      >
        <div>{result.displaySymbol}</div>
        <div className="ms-2">{result.description}</div>
      </Link>

      {mode == "watchlist" && (
        <button
          onClick={() => {
            inWatchList
              ? removeFromWatchlist(result.symbol)
              : addToWatchlist(result.symbol);
          }}
        >
          {inWatchList ? (
            <Trash strokeWidth={4}></Trash>
          ) : (
            <Plus strokeWidth={4}></Plus>
          )}
        </button>
      )}

      {/* {!isInWatchList(result.symbol) && <button className="font-bold"
                onClick={() => addToWatchlist(result.symbol)}>
                <Plus strokeWidth={4}></Plus>
            </button>}
            {isInWatchList(result.symbol) && <button className="font-bold"
                onClick={() => removeFromWatchlist(result.symbol)}>
                <Trash strokeWidth={4}></Trash>
            </button>} */}

    </CommandItem>
  );
};
