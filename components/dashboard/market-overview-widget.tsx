"use client";

import { useMarketData } from "@/hooks/useMarketData";
import { ArrowDown, ArrowUp } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
import { Skeleton } from "../ui/skeleton";

const MiniTrendLineChart = dynamic(
  () => import("./mini-trendline").then((mod) => mod.MiniTrendLineChart),
  {
    ssr: false,
    loading: () => <div className="h-[60px] animate-pulse rounded bg-muted" />,
  },
);

export const MarketOverviewWidget = React.memo(({ symbol, finHubSymbol }: MarketOverviewWidgetProps) => {

  const marketData = useMarketData(finHubSymbol);


  if (marketData.isLoading)
    return (
      <Skeleton className="h-[150px] w-[40%] sm:w-[40%] shrink-0  md:w-[24%] opacity-30 rounded-xl" />
    );

  if (marketData.isError || marketData.timestamp === 0) return <div className="h-[150px] w-[40%] sm:w-[40%] shrink-0 bg-[#17181f] md:w-[24%] rounded-xl flex justify-center items-center">Error loading</div>;

  return (
    <>
      <div className="m-0 bg-[#17181f] hover:bg-[#4f515e66] w-[40%] sm:w-[40%] shrink-0  md:w-[24%] rounded-md">
        <div className="card-content w-full p-3 pb-1">
          <h1 className="font-semibold">{symbol.toUpperCase()}</h1>
          <div className="text-sm text-white/80 font-semibold">
            {marketData.displayPrice}
          </div>
          {(marketData?.absoluteChange != undefined) &&
            <div className="leading-none text-sm text-white/80 font-semibold">
              <span>(</span>
              <span>{marketData.sign}</span>
              <span> {Math.abs(marketData?.absoluteChange).toFixed(2)}</span>
              <span>)</span>
            </div>}

          {(marketData?.percentageChange != undefined) &&
            <div
              className={`mt-1 flex items-center text-md font-semibold ${marketData.color}`}
            >
              <span>{marketData.sign}</span>
              <span>{Math.abs(marketData.percentageChange).toFixed(2)}%</span>
              <span>
                {marketData.trend === "up" && (
                  <ArrowUp size={20} className={`${marketData.color}`} />
                )}
                {marketData.trend === "down" && (
                  <ArrowDown size={20} className={`${marketData.color}`} />
                )}
              </span>
            </div>}

        </div>

        <div className="line-chart">
          <MiniTrendLineChart symbol={symbol}></MiniTrendLineChart>
        </div>
      </div>
    </>
  );
});

MarketOverviewWidget.displayName = "MarketOverviewWidget"


