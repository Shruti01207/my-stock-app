import { WatchList } from "@/components/watchlist/Watchlist";


export default function WatchlistPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-white">Your Watchlist</h1>
            <WatchList />
        </div>
    )
}