// This store holds the central websocket connection, the dictionary of live prices
// list of symbols u care about.

import { symbol } from "better-auth";
import { create } from "zustand/react";

interface LivePricesState {

    // data
    prices: Record<string, number>,
    //private network state
    socket: WebSocket | null;
    isConnected: boolean;
    // using set prevent duplicate suscription
    subscribedSymbols: Set<string>;

    //actions components will call
    connect: () => void;
    disconnect: () => void;
    subscribe: (symbol: string) => void;
    unsubscribe: (symbol: string) => void;

}



export const useLiveStore = create<LivePricesState>((set, get) => ({

    prices: {},
    socket: null,
    isConnected: false,
    subscribedSymbols: new Set(),

    connect: () => {
        // step1: check if the connection is already opened or not?
        /// if not then connect otherwise prevent
        // readyState => give the current state of the socket connection
        const currSocketState = get().socket?.readyState
        // if connection is already open no need to reconnect
        if (currSocketState == WebSocket.OPEN)
            return;

        const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;


        // Websocket creates a persistent 2 way connection
        // between client and server
        const ws = new WebSocket(`wss://ws.finnhub.io?token=${token}`)

        // onopen is the event handler property of websocket
        // This get triggered when the connection between
        // client and server is successfully established
        // so, when connection opens/successful connection between client and server run this function
        ws.onopen = () => {
            console.log("WEBSOCKET CONNECTION ESTABLISHED BETWEEN CLIENT AND SERVER");
            set({ isConnected: true, socket: ws })
            // CRITICAL: IF THE CONNECTION DROPS
            // AND RECONNECT , WE MUST TELL THE SERVER WHAT SYMBOLS WE CARE ABOUT

            get().subscribedSymbols.forEach((sym) => {
                // ws.send()=>this comes from web socket api browser built in.
                ws.send(JSON.stringify({ type: 'subscribe', symbol: sym }))
            });
        }

        ws.onmessage = (event) => {

            const response = JSON.parse(event.data);

            // take latest prices and append in prices state of type dictionary

            if (response.type === 'trade') {
                // response.data= array of trade object

                const trades = response.data;
                // console.log("socket data", trades)
                const latestPrices: Record<string, number> = {};
                trades.forEach((trade: any) => {
                    latestPrices[trade.s] = trade.p
                })
                // passing zustand state (state) in to the function
                // (state)=>{}
                // Now this set function will ofcourse expect an object
                // (state)=>({})
                set((state) => ({
                    prices: { ...state.prices, ...latestPrices }
                }))


            }


        }

        ws.onclose = () => {
            console.log("Websocket disconnected");
            set({ isConnected: false, socket: null })
        }


    },

    disconnect: () => {
        const socket = get().socket;
        if (socket) {
            socket.close()
        }
        set({ isConnected: false, socket: null, prices: {} })

    },
    subscribe: (symbol: string) => {
        const { socket, isConnected, subscribedSymbols } = get();
        const newSymbols = new Set(subscribedSymbols);
        newSymbols.add(symbol);
        set({ subscribedSymbols: newSymbols })
        console.log("newSymbols", newSymbols)

        if (isConnected && socket) {
            socket.send(JSON.stringify({ type: 'subscribe', symbol: symbol }))
            console.log("symbols suscribed");
        }
    },
    unsubscribe: (symbol: string) => {

        const { socket, isConnected, subscribedSymbols } = get();
        const newSymbols = new Set(subscribedSymbols);
        newSymbols.delete(symbol);
        set({ subscribedSymbols: newSymbols });

        if (isConnected && socket) {
            socket.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }))
        }


    }


}))