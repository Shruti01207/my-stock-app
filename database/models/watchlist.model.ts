import { model, models, Schema, setDriver } from "mongoose";

const WatchlistSchema = new Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    symbols: { type: [String], default: [] }
}, { timestamps: true })


// when this line execute while running the server of next.js , then mongoose "compiles" in to the 
// javascript constructor function=>model object sit in the server's RAM memory.
// It acts as a bridge  . It knows the rules of schema and knows how to talk to mongodb setDriver
const Watchlist = models?.Watchlist || model("Watchlist", WatchlistSchema);


export default Watchlist;

