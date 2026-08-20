"use client"

import { Button } from "@/components/ui/button";
import { useAlerts } from "@/hooks/useAlerts"
import { useMarketData } from "@/hooks/useMarketData";
import { firstCharToUpperCase } from "@/lib/utils";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";




export default function AlertDashboard() {

    const { data: alertLists, isLoading } = useAlerts()
    const marketData = useMarketData('QQQ');

    console.log("data", alertLists);
    const getFormattedDate = (date: string) => {
        return new Date(date).toLocaleString()
    }



    return <>
        <header>
            <h1 className="text-2xl font-bold">
                Stock Alerts
            </h1>
            <span className="text-md text-gray-500">
                Manage your active and triggered price notifications</span>
        </header>

        <div className="alert-container mt-7">
            {alertLists && alertLists.map((a: Alert) => {
                return (
                    <div key={a.createdAt} className="alert-card shadow w-[100%] md:w-[45%] bg-[#17181f] hover:bg-[#22232b] rounded-lg p-2 px-4">
                        <div className="symbol-details flex items-center justify-between">
                            {/* <span><img className="w-10 h-10 rounded-full" /></span> */}
                            <div className="flex gap-2">
                                <span className="font-bold text-md">{a.symbol.toUpperCase()} </span>
                                <span className="condition font-bold text-md">{firstCharToUpperCase(a.condition)}</span>
                                <span className="price font-bold text-md">{a.targetPrice}</span>
                            </div>

                            <span className="badge border-2 rounded-full px-1.5 py-0.5 sm:text-sm md:text-xs border-green-700 text-green-700 font-medium">Active</span>


                        </div>
                        <div className="current price">
                            <div className="flex gap-2 items-center">
                                <div className="sm:text-xl md:text-lg  font-semibold text-white/80">
                                    ${marketData.displayPrice}
                                </div>
                                <div
                                    className={`sm:text-lg md:text-lg  flex items-center text-md font-semibold ${marketData.color}`}
                                >
                                    <span>
                                        {(marketData.absoluteChange != undefined) && (marketData.absoluteChange > 0) && (
                                            <ArrowUp size={20} className={`${marketData.color}`} />
                                        )}
                                        {(marketData.absoluteChange != undefined) && (marketData.absoluteChange < 0) && (
                                            <ArrowDown
                                                size={20}
                                                className={`${marketData.color}`}
                                            ></ArrowDown>
                                        )}
                                    </span>

                                    {(marketData.percentageChange != undefined) &&
                                        <span>{Math.abs(marketData.percentageChange).toFixed(2)} %</span>
                                    }


                                </div>

                                <div
                                    className={`sm:text-lg md:text-lg  flex items-center text-md font-semibold ${marketData.color}`}
                                >
                                    <span>
                                        <span>(</span>
                                        <span>{marketData.sign}</span>
                                        {(marketData.absoluteChange != undefined) &&
                                            <span>
                                                {Math.abs(marketData.absoluteChange).toFixed(2)}
                                            </span>
                                        }
                                        <span>)</span>
                                    </span>
                                </div>
                            </div>
                        </div>


                        <div className="footer mt-2 flex items-center justify-between">
                            <span className="mr-2 text-sm text-gray-500"> <i>Created {getFormattedDate(a.createdAt)}</i> </span>
                            <div className="action-buttons">
                                <span className="condition font-bold mr-2 text-md">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-green-400 "
                                    >
                                        <Pencil size={16} />
                                    </Button>
                                </span>
                                <span className="price font-bold text-md">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </span>
                            </div>

                        </div>



                    </div>)
            })}

        </div>

    </>



}
