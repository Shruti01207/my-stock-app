
'use client'

import { useSymbolInfo } from "@/hooks/useSymbolInfo"
import { LocalStorageKeys } from "@/lib/enums"
import { useEffect } from "react"


const AppIntializer = () => {

    const { data: symbolData } = useSymbolInfo()




    useEffect(() => {
        if (symbolData) {
            localStorage.setItem(LocalStorageKeys.signalistSymbols, JSON.stringify(symbolData))
            localStorage.setItem(LocalStorageKeys.signalistSymbolslastUpdated, JSON.stringify(Date.now()))
        }

    }, [symbolData])








    return null




}


export default AppIntializer