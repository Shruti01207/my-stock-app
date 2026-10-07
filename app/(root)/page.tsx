import MarketMovers from "@/components/dashboard/market-movers";
import { MarketNewsWidget } from "@/components/dashboard/market-news-widget";
import { MarketOverviewWidget } from "@/components/dashboard/market-overview-widget";
import { PriceCharts } from "@/components/shared/price-charts";
import { fetchStockPrice } from "@/lib/api/stocks-server";
import { SymbolTypes } from "@/lib/enums";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import Link from "next/link";


export default async function Home() {

  const symbolDetails: SymbolDetails = {
    symbol: "QQQ",
    type: SymbolTypes.ETP,
  };


  const queryClient = new QueryClient();



  // Prefetch data on the server for the widgets to eliminate loading skeletons
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['market-quote', 'SPY'],
      queryFn: () => fetchStockPrice('SPY'),
    }),
    queryClient.prefetchQuery({
      queryKey: ['market-quote', 'QQQ'],
      queryFn: () => fetchStockPrice('QQQ'),
    }),
    queryClient.prefetchQuery({
      queryKey: ['market-quote', 'DIA'],
      queryFn: () => fetchStockPrice('DIA'),
    }),
    queryClient.prefetchQuery({
      queryKey: ['market-quote', 'IWM'],
      queryFn: () => fetchStockPrice('IWM'),
    }),
  ]);



  return (
    <div className="left flex flex-col">
      <div className="widget-section">
        {/* Pass the dehydrated server state to the client */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <div className="widget-container main-padding overflow-x-scroll scrollbar-hide md:overflow-x-hidden flex justify-between gap-3">
            <MarketOverviewWidget symbol="SPY" finHubSymbol="SPY" />
            <MarketOverviewWidget symbol="QQQ" finHubSymbol="QQQ" />
            <MarketOverviewWidget symbol="DIA" finHubSymbol="DIA" />
            <MarketOverviewWidget symbol="IWM" finHubSymbol="IWM" />
          </div>
        </HydrationBoundary>
      </div>

      <div className="divider" />


      <div className="main-chart main-padding">
        <PriceCharts
          symbol="QQQ"
          symbolDetails={symbolDetails}
          showSymbolInfo={true}
        ></PriceCharts>

      </div>

      <div className="divider" />

      <div className="md:hidden list-buttons main-padding">
        <Link
          className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
          href="/watchlist"
        >
          Watchlist
        </Link>
      </div>
      <div className="divider" />
      <div className="main-padding">
        <MarketNewsWidget></MarketNewsWidget>
      </div>
      <div className="divider" />
      <div className="main-padding">
        <MarketMovers></MarketMovers>
      </div>


    </div>
  );
}
