'use client'

import { NewsList } from "@/components/shared/news-list";
import { PriceCharts } from "@/components/shared/price-charts";
import { StatsGrid } from "@/components/stock-overview/stats-grid";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useStockSearch } from "@/hooks/useStockSearch";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { use } from "react";

interface PageProps {
    params: Promise<{ symbol: string }>
}

export default function StockSymbolOverview({ params }: PageProps) {


    console.log("params=", params);
    const unwrappedParams = use(params);
    const finhubSymbol = unwrappedParams.symbol;
    // const [data, setData] = useState<any>({});
    const { data: symbolDetails } = useStockSearch(finhubSymbol);
    const symbolData: SymbolDetails = {
        symbol: symbolDetails?.[0]?.symbol,
        type: symbolDetails?.[0]?.type
    }

    const { data, isLoading, isLoadingError } = useCompanyProfile(finhubSymbol)

    console.log("data", data)

    // useEffect(() => {

    //     const getCompanyData = async () => {
    //         const res = await getCompanyProfile(finhubSymbol);
    //         setData(res);
    //         console.log("res", res)
    //     }

    //     getCompanyData();

    // }, [])


    console.log("data", data)

    if (isLoading) {
        return (
            <div className="flex h-[100vh] w-full items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                <p className="text-sm text-zinc-500">Loading stock profile...</p>
            </div>
        );
    }


    return <>
        {
            data &&
            <div className="max-w-6xl mx-auto mx-3 flex flex-col">
                <div className="flex items-center gap-2 py-1.5">
                    <div className="flex items-center gap-2">
                        <ArrowLeft size={15} strokeWidth={4} className="text-l leading-none relative -top-[1px]" />
                        <Link href="/" className="leading-none text-sm">Home</Link>
                    </div>
                    {/* <div className="mx-4 h-4 border-l-2 border-red-500" /> */}
                    <div className="leading-none text-sm text-gray-500 border-l-2 border-zinc-400 ps-2">
                        {data?.exchange}
                    </div>
                </div>

                <div className="company-name mt-3 flex flex-row gap-3 items-center">
                    <img className="w-10 h-10 rounded-full" src={data?.logo} alt={data.name} />
                    <span className="font-bold">{data?.name}</span>
                </div>

                <div className="main-center-chart">
                    {
                        <PriceCharts symbol={finhubSymbol} symbolDetails={symbolData} showSymbolInfo={false} ></PriceCharts>
                    }
                </div>

                <div className="stats-grid">
                    <StatsGrid finhubSymbol={finhubSymbol}></StatsGrid>
                </div>

                <div>
                    <NewsList symbol={finhubSymbol}></NewsList>
                </div>



            </div >
        }

    </>

}