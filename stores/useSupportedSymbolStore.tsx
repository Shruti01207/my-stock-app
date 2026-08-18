import { LocalStorageKeys } from "@/lib/enums";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SupportedSymbolsStore {
    supportedSymbols: SymbolInfo[],
    lastUpdated: number | null,
    setSupportedSymbols: (supportedSymbols: SymbolInfo[]) => void
}


export const useSupportedSymbols = create<SupportedSymbolsStore>()(persist(
    (set) => ({
        supportedSymbols: [],
        lastUpdated: null,
        setSupportedSymbols: (supportedSymbols: SymbolInfo[]) => { set({ supportedSymbols, lastUpdated: Date.now() }) }
    }),
    { name: LocalStorageKeys.signalistSymbols }
))


