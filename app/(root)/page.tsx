import { MarketNewsWidget } from "@/components/dashboard/market-news-widget";
import { MarketOverviewWidget } from "@/components/dashboard/market-overview-widget";
import { PriceCharts } from "@/components/shared/price-charts";
import { WatchList } from "@/components/watchlist/Watchlist";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { symbol } from "better-auth";
import Link from "next/link";




export default function Home() {

  const symbolDetails: SymbolDetails = {
    symbol: 'QQQ',
    type: "ETP"
  }



  return (
    // <div >
    //   <section className="grid w-full gap-8 home-section">
    //     <div className="md:col-span-1 xl:col-span-1">
    //       <TradingView title="Market Overview"
    //         scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js"
    //         config={MARKET_DATA_WIDGET_CONFIG}
    //         className="custom-chart"
    //         height={600} />
    //     </div>
    //     <div className="md:col-span-1 xl:col-span-1">
    //       <TradingView title="Stock HeatMap"
    //         scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
    //         config={MARKET_DATA_WIDGET_CONFIG}
    //         className="custom-chart"
    //         height={600} />
    //     </div>
    //     <div className="md:col-span-1 xl:col-span-1">
    //       <TradingView title="Top Stories"
    //         scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
    //         config={TOP_STORIES_WIDGET_CONFIG}
    //         className="custom-chart"
    //         height={600} />
    //     </div>
    //     <div className="md:col-span-1 xl:col-span-1">
    //       <TradingView title="Market Data"
    //         scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
    //         config={MARKET_DATA_WIDGET_CONFIG}
    //         className="custom-chart"
    //         height={600} />
    //     </div>
    //   </section>
    // </div>

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
      <div className="hidden md:block md:w-[30%] right w-full">
        <WatchList />
      </div>


    </div>


  );
}
