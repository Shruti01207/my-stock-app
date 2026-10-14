import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useWatchlistColumns } from "./useWatchlistColumns";
import React from "react";
import { Delete, Trash, Trash2 } from "lucide-react";
import { useWatchlistStore } from "@/stores/useWatchlistStore";
import { useWatchlistData } from "./useWatchlistData";
import { Button } from "../ui/button";






export function WatchlistTable() {
    const columns = useWatchlistColumns();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const removeStock = useWatchlistStore((state) => state.removeStock);
    const watchlist = useWatchlistStore((state) => state.watchlist)// explicit return when without {}
    const { data, isLoading, isError } = useWatchlistData(watchlist)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })


    return (
        <div className="rounded-md">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className="group relative">
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}

                                    {cell.id === row.getVisibleCells()[0]?.id && (
                                        <button
                                            aria-label={`Remove ${row.original.symbol}`}
                                            className="absolute right-5 top-1 opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-md border border-red-500 bg- p-0.5"
                                            onClick={() => removeStock(row.original.symbol)}
                                        >
                                            <Trash2 color="red" size={20} fill="red" />
                                        </button>
                                    )}
                                </TableCell>
                            ))}


                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}





