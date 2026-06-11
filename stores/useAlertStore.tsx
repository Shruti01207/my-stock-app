import { create } from "zustand";

interface AlertStore {
    open: boolean;
    symbolDetails: SymbolDetails;
    setOpen: (open: boolean, symbolDetails: SymbolDetails) => void
}

export const useAlertStore = create<AlertStore>((set) => ({
    open: false,
    symbolDetails: { symbol: '', type: 'Common Stock' },
    setOpen: (open: boolean, symbolDetails: SymbolDetails) => {
        console.log("open=", open);
        set({ open, symbolDetails })
    }

}))