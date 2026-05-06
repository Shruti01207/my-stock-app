// TradingViewWidget.jsx
'use client'
import useTradingView from '@/hooks/useTradingView';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, memo, RefObject } from 'react';

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string
}



const TradingViewWidget = ({ title, scriptUrl, config, height, className }: TradingViewWidgetProps) => {
  const container: RefObject<HTMLDivElement | null> = useTradingView(scriptUrl, config, height)

  return (
    <div className="w-full">




      {/* {title && <h3 className='font-semibold text-2xl text-gray-100 mb-5'>{title}</h3>}
     <div className={cn("tradingview-widget-container", className)} ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener nofollow" target="_blank"><span className="blue-text">AAPL stock chart</span></a><span className="trademark"> by TradingView</span></div>
    </div> */}
    </div>


  );
}

export default memo(TradingViewWidget);
