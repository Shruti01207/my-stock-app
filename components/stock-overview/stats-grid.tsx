import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useMarketQuote } from "@/hooks/useMarketQuote";
import { useStockMetric } from "@/hooks/useStockMetric";
import { formatMarketCap } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const StatsGrid = ({ finhubSymbol }: { finhubSymbol: string }) => {

    const { data: quoteData, isLoading: quoteDataLoading } = useMarketQuote(finhubSymbol)
    const { data: companyProfile, isLoading: companyDataLoading } = useCompanyProfile(finhubSymbol);
    const { data: stockMetric, isLoading: stockMetricLoading } = useStockMetric(finhubSymbol);





    return <>



        <Tabs defaultValue="overview">
            <TabsList variant="line" className="!bg-transparent border-b border-zinc-800/50 rounded-none w-full !justify-start !items-center !h-[50px]">
                <TabsTrigger
                    value="overview"
                    className="rounded-none bg-transparent border-0 !flex-none data-[state=active]:bg-transparent text-lg font-semibold text-zinc-400 shadow-none !h-[90%]
       
      "
                >
                    Overview
                </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 md:gap-x-6">

                    {/* Column 1 */}

                    <div className="flex justify-between items-center pb-0 md:py-1">
                        <span className="text-zinc-500 text-base">Open</span>
                        {quoteDataLoading ? <Skeleton className="h-[20px] w-[50px]" /> :
                            <span className="font-semibold text-base">${quoteData?.o?.toFixed(2) ?? "-"}</span>

                        }
                    </div>

                    <div className="flex justify-between items-center pt-1 md:py-1">
                        <span className="text-zinc-500 text-base">High</span>
                        {quoteDataLoading ? <Skeleton className="h-[20px] w-[50px]" /> :
                            <span className="font-semibold text-base">${quoteData?.h?.toFixed(2) ?? "-"}</span>

                        }

                    </div>
                    <div className="flex justify-between items-center pt-1 md:py-1">
                        <span className="text-zinc-500 text-base">Low</span>
                        {quoteDataLoading ? <Skeleton className="h-[20px] w-[50px]" /> :
                            <span className="font-semibold text-base">${quoteData?.l?.toFixed(2) ?? "-"}</span>}

                    </div>



                    {/* Column 2 */}



                    <div className="flex justify-between items-center pb-0 md:py-1 md:border-t md:border-zinc-800/50">
                        <span className="text-zinc-500 text-base">Mkt. cap</span>
                        {companyDataLoading ? <Skeleton className="h-[20px] w-[50px]" /> :
                            companyProfile ? <span className="font-semibold text-base">
                                {formatMarketCap(companyProfile.marketCapitalization)}
                            </span> : <span>-</span>
                        }

                    </div>

                    <div className="flex justify-between items-center pt-1 md:py-1 border-0 md:border-t md:border-zinc-800/50">
                        <span className="text-zinc-500 text-base">P/E Ratio</span>
                        {stockMetricLoading ? <Skeleton className="h-[20px] w-[50px]" /> : <span className="font-semibold text-base">
                            {stockMetric?.metric?.peTTM?.toFixed(2) ?? "-"}
                        </span>}

                    </div>

                    <div className="flex justify-between items-center pt-1 md:py-1 border-0 md:border-t md:border-zinc-800/50">
                        <span className="text-zinc-500 text-base">Prev. Close</span>
                        {quoteDataLoading ? <Skeleton className="h-[20px] w-[50px]" /> :
                            <span className="font-semibold text-base">
                                ${quoteData?.pc?.toFixed(2) ?? "-"}
                            </span>

                        }

                    </div>



                    {/* Column 3 */}



                    <div className="flex justify-between items-center pb-0 md:py-1 md:border-t md:border-zinc-800/50">
                        <span className="text-zinc-500 text-base">52-wk high</span>
                        {stockMetricLoading ? <Skeleton className="h-[20px] w-[50px]" /> : <span className="font-semibold">
                            ${stockMetric?.metric?.["52WeekHigh"]?.toFixed(2) ?? "-"}
                        </span>}
                    </div>

                    <div className="flex justify-between items-center pt-1 md:py-1 border-0 md:border-t md:border-zinc-800/50">
                        <span className="text-zinc-500 text-base">52-wk low</span>
                        {stockMetricLoading ? <Skeleton className="h-[20px] w-[50px]" /> :
                            <span className="font-semibold">
                                ${stockMetric?.metric?.["52WeekLow"]?.toFixed(2) ?? "-"}
                            </span>
                        }
                    </div>

                    <div className="flex justify-between items-center pt-1 md:py-1 border-0 md:border-t md:border-zinc-800/50">
                        <span className="text-zinc-500 text-base">Avg. Volume (10D)</span>
                        {stockMetricLoading ? <Skeleton className="h-[20px] w-[50px]" /> :
                            <span className="font-semibold">
                                {stockMetric?.metric?.["10DayAverageTradingVolume"]?.toFixed(2) ?? "-"}
                                {(stockMetric?.metric?.["10DayAverageTradingVolume"] != null) ? "M" : ""}
                            </span>
                        }

                    </div>



                </div>

            </TabsContent>
        </Tabs>




    </>






}