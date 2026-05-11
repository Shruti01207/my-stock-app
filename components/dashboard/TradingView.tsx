// TradingViewWidget.jsx
'use client'
import useTradingView from '@/hooks/useTradingView';
import React, { memo, RefObject } from 'react';

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

    </div>


  );
}

export default memo(TradingViewWidget);
