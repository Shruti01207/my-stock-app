'use client'

import { useMarketData } from "@/hooks/useMarketData";
import { firstCharToUpperCase, getDateToLocaleString } from "@/lib/utils";
import { ArrowDown, ArrowUp, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { memo, useState } from "react";
import { useAlertStore } from "@/stores/useAlertStore";
import { useSupportedSymbols } from "@/stores/useSupportedSymbolStore";

import { toast } from "sonner";
import { deleteAlert } from "@/lib/api/stocks";
import { useQueryClient } from "@tanstack/react-query";





export const AlertCard = memo(({ alert }: { alert: Alert }) => {

    const marketData = useMarketData(alert.symbol);
    const setOpen = useAlertStore((state) => state.setOpen)
    const supportedSymbols = useSupportedSymbols((state) => state.supportedSymbols)
    const [isDeleting, setIsDeleting] = useState(false)
    const queryClient = useQueryClient()


    const editAlert = () => {
        const symbol: SymbolInfo | undefined = (supportedSymbols.find((s: SymbolInfo) => s.symbol === alert.symbol || s.symbol2 === alert.symbol))
        let symbolType = null;
        if (symbol) {
            symbolType = symbol.type
        }
        const symDetails: SymbolDetails = {
            symbol: alert.symbol,
            type: symbolType
        }

        let alertForm: EditAlertForm = {
            targetPrice: alert?.targetPrice,
            condition: alert?.condition,
            isConditionManual: false,
            alertId: alert?._id
        }

        setOpen(true, 'edit', symDetails, alertForm)

    }

    const removeAlert = async (alertId: string) => {
        setIsDeleting(true)
        const res = await deleteAlert(alertId)
        setIsDeleting(false)
        if (res.success) {
            toast.success("Alert deleted successfully")
            queryClient.refetchQueries({ queryKey: ['alerts-list'] })
        }
        else {
            toast.error(res.error || "Failed to delete alert")
        }
    }



    return (
        <div className="alert-card shadow w-[100%]  bg-[#17181f] hover:bg-[#22232b] rounded-lg p-2 px-4">
            <div className="symbol-details flex items-center justify-between">
                {/* <span><img className="w-10 h-10 rounded-full" /></span> */}
                <div className="flex gap-2">
                    <span className="font-bold text-md">{alert.symbol.toUpperCase()} </span>
                    <span className="condition font-bold text-md">{firstCharToUpperCase(alert.condition)}</span>
                    <span className="price font-bold text-md">{alert.targetPrice}</span>
                </div>

                <span className="badge border-2 rounded-full px-1.5 py-0.5 sm:text-sm md:text-xs border-green-700 text-green-700 font-medium">Active</span>


            </div>
            {marketData?.isLoading && <Skeleton className="animate-pulse h-[30px] mt-1 w-[55%]" ></Skeleton>}
            {!(marketData?.isLoading) && <div className="current price">
                <div className="flex gap-2 items-center">
                    <div className="sm:text-xl md:text-lg  font-semibold text-white/80">
                        ${marketData?.displayPrice}
                    </div>
                    <div
                        className={`sm:text-lg md:text-lg  flex items-center text-md font-semibold ${marketData.color}`}
                    >
                        <span>
                            {(marketData.absoluteChange !== undefined) && (marketData.absoluteChange > 0) && (
                                <ArrowUp size={20} className={`${marketData.color}`} />
                            )}
                            {(marketData.absoluteChange !== undefined) && (marketData.absoluteChange < 0) && (
                                <ArrowDown
                                    size={20}
                                    className={`${marketData.color}`}
                                ></ArrowDown>
                            )}
                        </span>

                        {(marketData.percentageChange !== undefined) &&
                            <span>{Math.abs(marketData.percentageChange).toFixed(2)} %</span>
                        }


                    </div>

                    <div
                        className={`sm:text-lg md:text-lg  flex items-center text-md font-semibold ${marketData.color}`}
                    >
                        <span>
                            <span>(</span>
                            <span>{marketData.sign}</span>
                            {(marketData.absoluteChange !== undefined) &&
                                <span>
                                    {Math.abs(marketData.absoluteChange).toFixed(2)}
                                </span>
                            }
                            <span>)</span>
                        </span>
                    </div>
                </div>
            </div>}



            <div className="footer mt-2 flex items-center justify-between">
                <span className="mr-2 text-sm text-gray-500"> <i>Created {getDateToLocaleString(alert.createdAt)}</i> </span>
                <div className="action-buttons">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-green-400 "
                        onClick={editAlert}
                    >
                        <Pencil size={16} />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                        disabled={isDeleting}
                        onClick={() => { removeAlert(alert._id) }}
                    >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </Button>

                </div>

            </div>



        </div>)

})

export default AlertCard