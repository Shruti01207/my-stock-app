import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useMarketQuote } from "@/hooks/useMarketQuote";
import { useStockMetric } from "@/hooks/useStockMetric";
import { formatMarketCap } from "@/lib/utils";

export const StatsGrid = ({ finhubSymbol }: { finhubSymbol: string }) => {

    const { data: quoteData, isLoading, isLoadingError } = useMarketQuote(finhubSymbol)
    const { data: companyProfile, isLoading: companyDataLoading } = useCompanyProfile(finhubSymbol);
    const { data: stockMetric, isLoading: stockMetricLoading } = useStockMetric(finhubSymbol);





    return <>

        <h1 className="font-bold text-xl my-2">Overview</h1>
        <div className="grid grid-cols-4">
            <span className="border-t-1 border-zinc-500 text-zinc-500 p-1 flex items-center">
                Open
            </span>

            <span className="border-t-1 border-zinc-500 p-1 flex items-center">
                {quoteData?.o}
            </span>

            <span className="border-t-1 border-zinc-500 text-zinc-500 p-1 flex items-center">
                Day High
            </span>

            <span className="border-t-1 border-zinc-500 p-1 flex items-center">
                {quoteData?.h}
            </span>

            <span className="border-t-1 border-zinc-500 text-zinc-500 p-1 flex items-center">
                Day Low
            </span>

            <span className="border-t-1 border-zinc-500 p-1 flex items-center">
                {quoteData?.l}
            </span>
            <span className="border-t-1 border-zinc-500 text-zinc-500 p-1 flex items-center">
                Prev. Close
            </span>

            <span className="border-t-1 border-zinc-500 p-1 items-center">
                {quoteData?.pc}
            </span>

            <span className="border-t-1 border-zinc-500 p-1 text-zinc-500 flex items-center">
                Market Cap
            </span>

            <span className="border-t-1 border-zinc-500 p-1 flex items-center">
                {companyProfile && formatMarketCap(companyProfile?.marketCapitalization)}
            </span>
            <span className="border-t-1 border-zinc-500 text-zinc-500 p-1 flex items-center">
                52W High
            </span>

            <span className="border-t-1 border-zinc-500 p-1 items-center">
                {stockMetric?.metric?.["52WeekHigh"]}
            </span>
            <span className="border-t-1 border-zinc-500 text-zinc-500 p-1 flex items-center">
                52W Low
            </span>

            <span className="border-t-1 border-zinc-500 p-1 flex items-center">
                {stockMetric?.metric?.["52WeekLow"]}
            </span>

            <span className="border-t-1 border-zinc-500 text-zinc-500 p-1 flex items-center">
                P/E Ratio
            </span>

            <span className="border-t-1 border-zinc-500 p-1 flex items-center">
                {stockMetric?.metric?.peTTM?.toFixed(2) || "-"}
            </span>




        </div>
    </>






}