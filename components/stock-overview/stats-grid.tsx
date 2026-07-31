import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useMarketQuote } from "@/hooks/useMarketQuote";
import { useStockMetric } from "@/hooks/useStockMetric";
import { formatMarketCap } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader } from "../ui/card";

export const StatsGrid = ({ finhubSymbol }: { finhubSymbol: string }) => {

    const { data: quoteData, isLoading, isLoadingError } = useMarketQuote(finhubSymbol)
    const { data: companyProfile, isLoading: companyDataLoading } = useCompanyProfile(finhubSymbol);
    const { data: stockMetric, isLoading: stockMetricLoading } = useStockMetric(finhubSymbol);





    return <>



        <Tabs defaultValue="overview">
            <TabsList variant="line" className="!bg-transparent px-0 pb-0 border-b border-zinc-700 rounded-none w-full !justify-start">
                <TabsTrigger
                    value="overview"
                    className="
        rounded-none
        bg-transparent
        border-0
        !flex-none
        data-[state=active]:bg-transparent
        px-0 pb-3 pt-1 
        text-lg font-semibold
        text-zinc-400
        shadow-none
        !h-[80%]
       
      "
                >
                    Overview
                </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-5">

                <div className="grid md:grid-cols-3 gap-8">

                    {/* Column 1 */}
                    <div className="space-y-0">

                        <div className="flex justify-between items-center py-3 border-t border-zinc-700">
                            <span className="text-zinc-500">Open</span>
                            <span className="font-semibold">${quoteData?.o}</span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-zinc-700">
                            <span className="text-zinc-500">High</span>
                            <span className="font-semibold">${quoteData?.h}</span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-zinc-700">
                            <span className="text-zinc-500">Low</span>
                            <span className="font-semibold">${quoteData?.l}</span>
                        </div>

                    </div>

                    {/* Column 2 */}

                    <div>

                        <div className="flex justify-between items-center py-3 border-t border-zinc-700">
                            <span className="text-zinc-500">Mkt. cap</span>
                            <span className="font-semibold">
                                {formatMarketCap(companyProfile?.marketCapitalization)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-zinc-700">
                            <span className="text-zinc-500">P/E Ratio</span>
                            <span className="font-semibold">
                                {stockMetric?.metric?.peTTM?.toFixed(2) || "-"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-zinc-700">
                            <span className="text-zinc-500">Prev. Close</span>
                            <span className="font-semibold">
                                ${quoteData?.pc}
                            </span>
                        </div>

                    </div>

                    {/* Column 3 */}

                    <div>

                        <div className="flex justify-between items-center py-3 border-t border-zinc-700">
                            <span className="text-zinc-500">52-wk high</span>
                            <span className="font-semibold">
                                ${stockMetric?.metric?.["52WeekHigh"]}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-zinc-700">
                            <span className="text-zinc-500">52-wk low</span>
                            <span className="font-semibold">
                                ${stockMetric?.metric?.["52WeekLow"]}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-zinc-700">
                            <span className="text-zinc-500">Volume</span>
                            <span className="font-semibold">
                                {quoteData?.v?.toLocaleString()}
                            </span>
                        </div>

                    </div>

                </div>

            </TabsContent>
        </Tabs>




    </>






}