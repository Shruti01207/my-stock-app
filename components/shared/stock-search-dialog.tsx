"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useSearchStore } from "@/stores/useSearchStore";
import { StockRow } from "./stock-row";
import { POPULAR_STOCKS } from "@/lib/mockdata";
import { useStockSearch } from "@/hooks/useStockSearch";

export function StockSearchModal() {
  const { isOpen, onClose, onOpen, mode } = useSearchStore();
  const [inputValue, setInputValue] = React.useState<string>("");
  const { data: searchData } = useStockSearch(inputValue);

  // Standard shortcut to open search (Cmd+K or Ctrl+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpen();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  let searchResults =
    inputValue.trim().length < 2 ? POPULAR_STOCKS : searchData;

  return (
    <>
      <CommandDialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            onClose();
          } else {
            onOpen();
          }
        }}
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Type a ticker (AAPL, TSLA...)"
          onValueChange={setInputValue}
        />
        <CommandList className="max-h-[80vh] md:max-h-[450px] ">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {searchResults &&
              searchResults.length > 0 &&
              searchResults?.map((result: Stock) => (
                <StockRow result={result} key={result.description}></StockRow>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
