'use client'

import { firstCharToUpperCase } from "@/lib/utils";
import { useSupportedSymbols } from "@/stores/useSupportedSymbolStore";
import { ArrowDown, ArrowUp } from "lucide-react";



const Widget = ({ title, data }: { title: string, data: AlphaVantageTickData[] }) => {

    const supportedSymbols = useSupportedSymbols((state) => state.supportedSymbols);







    return <>


        <span className="text-lg font-bold">{title}</span>
        {data &&
            data.map((tick) => {

                const textColor = Number(tick.change_amount) > 0 ? `text-green-500` : `text-red-500`;
                const description = supportedSymbols.find((sym) => sym.symbol == tick.ticker || sym.symbol2 == tick.ticker)?.description ?? ""


                return (
                    <div className="card border-b border-zinc-800 my-3 pb-1" key={tick.ticker}>
                        <div className="flex justify-between align-center">
                            <span className="font-bold">{tick?.ticker}</span>
                            <span >{tick?.price}</span>
                        </div>
                        <div className="flex justify-between align-center text-sm truncate">
                            <span className="text-gray-500">{(description.length > 20) ? firstCharToUpperCase(description.toLocaleLowerCase().slice(0, 20)).concat('...') : firstCharToUpperCase(description.toLocaleLowerCase())}</span>
                            <div
                                className={`mt-1 flex items-center text-md font-semibold text-green-500`}
                            >
                                <span className={textColor}>{tick?.change_percentage}</span>
                                <span>

                                    {Number(tick.change_amount) > 0 ?
                                        <ArrowUp size={20} className={textColor} /> :
                                        <ArrowDown size={20} className={textColor} />
                                    }

                                </span>
                            </div>
                        </div>
                    </div>)
            })
        }



    </>
}


export default Widget;
