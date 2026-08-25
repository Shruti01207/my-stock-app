import { create } from "zustand";

interface AlertStore {
    open: boolean;
    mode: 'add' | 'edit'
    symbolDetails: SymbolDetails;
    setOpen: (open: boolean, mode: 'add' | 'edit', symbolDetails: SymbolDetails, alertForm?: AlertForm) => void
    alertForm: AlertForm | EditAlertForm
}

export const useAlertStore = create<AlertStore>((set) => ({
    open: false,
    mode: 'add',
    alertForm: {
        targetPrice: undefined,
        condition: "none",
        isConditionManual: false
    },
    symbolDetails: { symbol: '', type: null },
    setOpen: (open: boolean, mode: 'add' | 'edit', symbolDetails: SymbolDetails, alertForm?: AlertForm | EditAlertForm) => {
        set({ open, mode, symbolDetails, alertForm })
    }

}))