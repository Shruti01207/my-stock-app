import { create } from "zustand";


interface SearchStore {
    isOpen: boolean;
    mode: StockSearchMode;
    onOpen: (mode?: StockSearchMode) => void
    onClose: () => void
}


export const useSearchStore = create<SearchStore>((set) => ({
    isOpen: false,
    mode: "navigate",
    onOpen: (modalMode) => {
        set({ isOpen: true })
        set({ mode: modalMode })
    },

    onClose: () => { set({ isOpen: false }) }
}))