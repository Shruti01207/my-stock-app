import { MarketNewsWidget } from "@/components/dashboard/market-news-widget";
import { MarketOverviewWidget } from "@/components/dashboard/market-overview-widget";
import { PriceCharts } from "@/components/shared/price-charts";
import { WatchList } from "@/components/watchlist/Watchlist";




export default function Home() {






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

    <div className="max-w-6xl mx-auto mx-3 flex">
      <div className="left w-full md:w-[70%]">
        <section className="widget-section ">
          <div className="widget-container overflow-x-scroll md:overflow-x-hidden flex gap-5">
            <MarketOverviewWidget symbol='SPY' finHubSymbol="SPY" />
            <MarketOverviewWidget symbol='QQQ' finHubSymbol="QQQ" />
            <MarketOverviewWidget symbol='DIA' finHubSymbol="DIA" />
            <MarketOverviewWidget symbol="IWM" finHubSymbol="IWM" />
          </div>
        </section>
        <section className="main-chart">
          <PriceCharts symbol="QQQ" finHubSymbol="QQQ"></PriceCharts>
        </section>
        <section>
          <MarketNewsWidget></MarketNewsWidget>
        </section>
      </div>
      <div className="right w-full md:w-[30%]">
        <WatchList />
      </div>


    </div>


  );
}
