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
import { Trash } from "lucide-react";
import { useWatchlistStore } from "@/stores/useWatchlistStore";
import { useWatchlistData } from "./useWatchlistData";






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
                        <TableRow key={row.id} className="group" >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>

                            ))}

                            <TableCell className="p-1">
                                <button
                                    aria-label={`Remove ${row.original.symbol}`}
                                    className="opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    onClick={() => { removeStock(row.original.symbol) }}

                                >
                                    <Trash color="red" size={20}></Trash>
                                </button>

                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}





