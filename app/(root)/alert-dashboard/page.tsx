"use client"

import { Button } from "@/components/ui/button";
import { useAlerts } from "@/hooks/useAlerts"
import { useMarketData } from "@/hooks/useMarketData";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";




export default function AlertDashboard() {

    const { data, isLoading } = useAlerts()
    const marketData = useMarketData('QQQ');

    console.log("data", data);




    return <>
        <header>
            <h1 className="text-2xl font-bold">
                Stock Alerts
            </h1>
            <span className="text-md text-gray-500">
                Manage your active and triggered price notifications</span>
        </header>

        <div className="alert-container mt-5 ">
            <div className="alert-card border border-blue-500 w-[100%] rounded-lg p-2 px-4">
                <div className="symbol-details flex border border-red items-center justify-between">
                    {/* <span><img className="w-10 h-10 rounded-full" /></span> */}
                    <div className="flex gap-3">
                        <span className="font-bold text-md">QQQ </span>
                        <span className="text-md font-light">Invesco QQQ Trust, Series 1</span>
                    </div>

                    <span className="badge border-2 rounded-full px-2.5 py-0.5 text-sm border-green-700 text-green-700 font-medium">Active</span>


                </div>
                <div className="current price">
                    <div className="flex gap-2 items-center">
                        <div className="sm:text-xl md:text-2xl  font-semibold text-white/80">
                            {" "}
                            ${marketData.displayPrice}
                        </div>
                        <div
                            className={`sm:text-lg md:text-lg mt-1 flex items-center text-md font-semibold ${marketData.color}`}
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
                            className={`sm:text-lg md:text-lg mt-1 flex items-center text-md font-semibold ${marketData.color}`}
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
                <div className="target price">
                    <span className="mr-2 text-md font-medium">Target</span>
                    <span className="condition font-bold mr-2 text-md">Below</span>
                    <span className="price font-bold text-md">234.6</span>
                </div>

                <div className="actions mt-4">
                    <span className="mr-2 text-sm text-gray-500"> <i>Created 12 August 2023</i> </span>
                    <span className="condition font-bold mr-2 text-md">
                        <Button variant='ghost'>
                            <Pencil size={18} />
                        </Button>
                    </span>
                    <span className="price font-bold text-md">
                        <Button variant='ghost'><Trash2 size={18} /></Button>
                    </span>
                </div>



            </div>
        </div>

    </>



}
