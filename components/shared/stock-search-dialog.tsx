"use client"

import * as React from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useSearchStore } from "@/stores/useSearchStore"

import { Plus, Trash } from "lucide-react"
import { useWatchlistStore } from "@/stores/useWatchlistStore"
import { StockRow } from "./stock-row"
import { searchStock } from "@/lib/api/stocks"
import { useDebounce } from "@/hooks/useDebounce"
import { POPULAR_STOCKS } from "@/lib/mockdata"

export function StockSearchModal() {
    const { isOpen, onClose, onOpen, mode } = useSearchStore()

    const [searchResults, setsearchResults] = React.useState<Stock[]>(POPULAR_STOCKS);
    const [inputValue, setInputValue] = React.useState<string>();
    const debouncedQuery = useDebounce(inputValue, 400);
    const [isSearching, setIsSearching] = React.useState(false);


    // Standard shortcut to open search (Cmd+K or Ctrl+K)
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                // setOpen((open) => !open)
                onOpen();
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])


    React.useEffect(() => {
        const fetchStock = async () => {
            if (!debouncedQuery) {
                setsearchResults(POPULAR_STOCKS);
                return;
            }
            try {
                setIsSearching(true);
                const data = await searchStock(debouncedQuery);
                console.log("data", data);
                setsearchResults(data.result);
            }
            catch (error) {
                console.log("error", error)
            }
            finally {
                setIsSearching(false)
            }
        }
        fetchStock();
    }, [debouncedQuery])

    // const handleSearch = async (value: string) => {
    //     const query = value.trim().toLowerCase();
    //     // const results = mockStocks.filter((stock) => stock.symbol.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query))
    //     // console.log(`query=${query}`, results)
    //     const data = await searchStock(value);
    //     console.log("data", data);
    //     setsearchResults(data.result);
    // }


    return (
        <>

            <CommandDialog open={isOpen} onOpenChange={(open) => {
                if (!open) {
                    onClose()
                }
                else {
                    onOpen()
                }

            }} shouldFilter={false}>
                <CommandInput placeholder="Type a ticker (AAPL, TSLA...)" onValueChange={setInputValue} />
                <CommandList className="max-h-[80vh] md:max-h-[450px]">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        {
                            searchResults.length > 0 && searchResults.map((result) =>
                                <StockRow result={result} mode={mode} key={result.symbol}></StockRow>
                            )
                        }
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}