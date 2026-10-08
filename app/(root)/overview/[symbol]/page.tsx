'use client'

import MyAvatar from "@/components/shared/my-avatar";
import { NewsList } from "@/components/shared/news-list";
import { PriceCharts } from "@/components/shared/price-charts";
import { StatsGrid } from "@/components/stock-overview/stats-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useStockSearch } from "@/hooks/useStockSearch";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

interface PageProps {
    params: Promise<{ symbol: string }>
}

export default function StockSymbolOverview({ params }: PageProps) {


    const unwrappedParams = use(params);
    const finhubSymbol = unwrappedParams.symbol;
    const { data: symbolDetails } = useStockSearch(finhubSymbol);
    const [logoError, setLogoError] = useState(false);
    let symbolData = {
        symbol: '',
        type: ''
    }

    if (symbolDetails) {
        symbolData = {
            symbol: symbolDetails?.[0]?.symbol,
            type: symbolDetails?.[0]?.type
        }
    }


    const { data, isLoading } = useCompanyProfile(finhubSymbol)




    return <>


        <div className="max-w-6xl mx-auto mx-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 py-1.5">
                <Link href="/" className="flex items-center gap-2" >
                    <ArrowLeft size={15} strokeWidth={2.5} className="leading-none relative -top-[1px] text-sm" />
                    <span className="leading-none font-medium text-sm">Home</span>
                </Link>

                {isLoading ?
                    <div className="leading-none  border-l-2 border-zinc-400 ps-2 h-4">
                        <Skeleton className="animate h-[18px] w-[150px] rounded-xl"></Skeleton>
                    </div> : data?.exchange ? <div className="leading-none  border-l-2 border-zinc-400 ps-2 h-4 flex items-center">
                        <span className="text-gray-500 text-sm">{data?.exchange}</span>
                    </div> : null
                }

            </div>

            <div className="company-name flex flex-row gap-3 items-center">
                {/* {isLoading ?
                    <Skeleton className="w-10 h-10 rounded-full"></Skeleton> :
                    data?.logo && !logoError ? <img className="w-10 h-10 rounded-full" src={data?.logo} alt={data?.name} onError={() => setLogoError(true)} /> :
                        <div className="w-10 h-10 rounded-full bg-zinc-400">{data?.name?.[0] ?? 'U'}</div>
                }

                {
                    isLoading ?
                        <Skeleton className="animate h-[25px] w-[150px] opacity-30 rounded-xl"></Skeleton> :
                        data?.name ? <span className="font-bold text-lg">{data?.name}</span> : <span>-</span>

                } */}
                <MyAvatar isLoading={isLoading} name={data?.name} logo={data?.logo} avatarSize="10" fontSize="lg"></MyAvatar>

                {
                    isLoading ?
                        <Skeleton className="animate h-[25px] w-[150px] opacity-30 rounded-xl"></Skeleton> :
                        data?.name ? <span className="font-bold text-lg">{data?.name}</span> : <span>-</span>

                }


            </div>


            <div className="main-center-chart">
                <PriceCharts symbol={finhubSymbol} symbolDetails={symbolData} showSymbolInfo={false} ></PriceCharts>
            </div>

            <div className="stats-grid">
                <StatsGrid finhubSymbol={finhubSymbol}></StatsGrid>
            </div>

            <div className="news-list">
                <NewsList symbol={finhubSymbol}></NewsList>
            </div>



        </div >


    </>

}