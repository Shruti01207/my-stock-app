
'use client'

import { useSymbolInfo } from "@/hooks/useSymbolInfo"
import { useSupportedSymbols } from "@/stores/useSupportedSymbolStore"
import { useEffect } from "react"


const AppIntializer = () => {

    const { data: symbolData } = useSymbolInfo()
    const setSupportedSymbols = useSupportedSymbols((state) => state.setSupportedSymbols)




    useEffect(() => {
        if (symbolData) {
            setSupportedSymbols(symbolData as SymbolInfo[])
        }

    }, [symbolData])








    return null




}


export default AppIntializer