import { useWatchlistStore } from "@/stores/useWatchlistStore"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUpDown, ArrowUpRight } from "lucide-react"
import React from "react"
import { useMemo } from "react"
import { Button } from "../ui/button"

export const useWatchlistColumns = () => {
    const removeStock = useWatchlistStore((state) => state.removeStock)


    return useMemo<ColumnDef<StockData>[]>(() =>
        [
            {
                accessorKey: "symbol",
                header: ({ column }) => {
                    return (<Button
                        variant="ghost"
                        className="p-0"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Symbol
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>)
                },
                cell: ({ row }) => {

                    return <div className="font-bold px-2">{row.getValue("symbol")}</div>
                }
            },
            {
                accessorKey: "price",
                header: ({ column }) => {
                    return (<Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>)
                },
                cell: ({ row }) => {
                    const price = parseFloat(row.getValue("price"))
                    return <div className="font-bold">${price.toFixed(2)}</div>
                }
            },
            {
                accessorKey: "change",
                header: "Change",
                cell: ({ row }) => {
                    const change = parseFloat(row.getValue("change"));
                    const isPositive = change > 0;

                    return (
                        <div className={`font-bold flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDown size={16} />}
                            <span className="ml-1">{Math.abs(change).toFixed(2)}%</span>
                        </div>
                    )
                }
            },
            // {
            //     accessorKey: "actions",
            //     header: "Actions",
            //     cell: ({ row }) => {

            //         return (
            //             <button onClick={() => { removeStock(row.original.symbol) }}>
            //                 <Trash2 className="h-5 w-5" />
            //             </button>
            //         )
            //     }

            // }

        ]
        , [removeStock])
}

