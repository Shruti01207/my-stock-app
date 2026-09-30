'use client'

import { useTopGainersLoosers } from "@/hooks/useTopGainersLoosers";
import { useSupportedSymbols } from "@/stores/useSupportedSymbolStore";
import Widget from "../shared/widget";
import { useEffect, useState } from "react";

export const MarketMovers = () => {

    const { data, isLoading } = useTopGainersLoosers();
    const [topGainers, setTopGainers] = useState<AlphaVantageTickData[]>([]);
    const [topLoosers, setTopLoosers] = useState<AlphaVantageTickData[]>([]);
    const [mostActivelyTraded, setMostActivelyTraded] = useState<AlphaVantageTickData[]>([])

    const supportedSymbols = useSupportedSymbols((state) => state.supportedSymbols);

    useEffect(() => {
        console.log("data", data);
        if (!data)
            return
        const tG = data?.top_gainers?.filter((tick: AlphaVantageTickData) => supportedSymbols.find((sym) => sym.symbol == tick.ticker || sym.symbol2 == tick.ticker)).slice(0, Math.min(4, data?.top_gainers.length)) ?? []
        setTopGainers(tG)
        const tL = data?.top_losers?.filter((tick: AlphaVantageTickData) => supportedSymbols.find((sym) => sym.symbol == tick.ticker || sym.symbol2 == tick.ticker)).slice(0, Math.min(4, data?.top_gainers.length)) ?? []
        setTopLoosers(tL)
        const mAT = data?.most_actively_traded?.filter((tick: AlphaVantageTickData) => supportedSymbols.find((sym) => sym.symbol == tick.ticker || sym.symbol2 == tick.ticker)).slice(0, Math.min(4, data?.top_gainers.length)) ?? []
        setMostActivelyTraded(mAT)
    }, [data])


    return <>

        <div className="market-movers grid grid-cols-3 gap-7">
            {data &&
                <>
                    {topGainers && <div>
                        <Widget title="Most active" data={topGainers}></Widget>
                    </div>}
                    {
                        topLoosers &&
                        <div>
                            <Widget title="Top Gainers" data={topLoosers}></Widget>
                        </div>
                    }

                    {
                        mostActivelyTraded &&
                        <div>
                            <Widget title="Top Loosers" data={mostActivelyTraded}></Widget>
                        </div>
                    }

                </>


            }


        </div>

    </>


}

export default MarketMovers;
