import { MarketNewsWidget } from "@/components/dashboard/market-news-widget";
import { MarketOverviewWidget } from "@/components/dashboard/market-overview-widget";
import { PriceCharts } from "@/components/shared/price-charts";
import { WatchList } from "@/components/watchlist/Watchlist";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { SymbolTypes } from "@/lib/enums";
import { symbol } from "better-auth";
import Link from "next/link";




export default function Home() {

  const symbolDetails: SymbolDetails = {
    symbol: 'QQQ',
    type: SymbolTypes.ETP
  }



  return (
    <div className="max-w-6xl mx-auto mx-3 flex flex-col md:flex-row">
      <div className="left md:w-[70%] flex flex-col gap-1">
        <div className="widget-section">
          <div className="widget-container overflow-x-scroll md:overflow-x-hidden flex gap-5">
            <MarketOverviewWidget symbol='SPY' finHubSymbol="SPY" />
            <MarketOverviewWidget symbol='QQQ' finHubSymbol="QQQ" />
            <MarketOverviewWidget symbol='DIA' finHubSymbol="DIA" />
            <MarketOverviewWidget symbol="IWM" finHubSymbol="IWM" />
          </div>
        </div>
        <div className="main-chart my-3">
          {<PriceCharts symbol="QQQ" symbolDetails={symbolDetails} ></PriceCharts>}
        </div>

        <div className="md:hidden list-buttons">
          <Link className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none" href="/watchlist">
            Watchlist
          </Link>
        </div>
        <div className="">
          <MarketNewsWidget></MarketNewsWidget>
        </div>
      </div>
      <div className="hidden md:block md:w-[30%] right border border-t-0 w-full">
        <WatchList />
      </div>


    </div>


  );
}
