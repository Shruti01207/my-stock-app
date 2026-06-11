"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAlertStore } from "@/stores/useAlertStore"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup } from "radix-ui"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { MiniTrendLineChart } from "../dashboard/mini-trendline"
import { useMarketQuote } from "@/hooks/useMarketQuote"
import { useSymbolInfo } from "@/hooks/useSymbolInfo"
import { useStockSearch } from "@/hooks/useStockSearch"
import { useCompanyProfile } from "@/hooks/useCompanyProfile"
import { useMarketData } from "@/hooks/useMarketData"
import { useState } from "react"
import { createAlert } from "@/lib/api/stocks-server"
import { toast } from "sonner"

// interface StockData {
//     symbol: string;
//     prevClose: number;
//     chartColor: string;
// }


interface Alert {
    targetPrice?: number;
    condition?: "above" | "below";
}

export function AlertModal() {

    const open = useAlertStore((state) => state.open);
    const setOpen = useAlertStore((state) => state.setOpen);
    const symbolDetails = useAlertStore((state) => state.symbolDetails);
    const companyProfileQuery = useCompanyProfile(symbolDetails.symbol);
    const symbolsData = useSymbolInfo(symbolDetails.symbol);
    const marketData = useMarketData(symbolDetails.symbol)
    const profile = (symbolDetails.type == 'Common Stock') ? companyProfileQuery.data : symbolsData.data
    const [alert, setAlert] = useState<Alert>()

    const onChange = (event: any) => {

        console.log("on change called")
        const targetPrice = (event.target.value != "") ? Number(event.target.value) : undefined;
        if (targetPrice) {
            setAlert({ targetPrice, condition: (marketData.displayPrice <= targetPrice) ? 'above' : 'below' })
        }

        // setTargetPrice(targetPrice);
    }

    const currentPrice = marketData.displayPrice;
    // const condition = "above"


    const addAlert = async () => {

        if (!alert || (alert.targetPrice == undefined || alert.condition == undefined)) {
            return;
        }

        let req: AlertRequest = {
            symbol: symbolDetails.symbol,
            targetPrice: alert.targetPrice,
            condition: alert.condition
        }

        const res = await createAlert(req);
        console.log("res", res);
        if (res.success) {
            setOpen(false, symbolDetails);
            toast.success("Alert created successfully");

        }


    }




    return (
        <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen, symbolDetails)} >
            <form>
                <DialogContent className="sm:max-w-sm md:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex flex-row items-center gap-2">
                                {profile && <img className="w-10 h-10 rounded-full" src={profile?.logo} alt={profile?.name} />}
                                <span>Create Price Alert</span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="w-[160px]">
                                    <h2 className="text-2xl font-bold">{symbolDetails.symbol}</h2>
                                    <p className="text-muted-foreground">{profile?.name}</p>
                                </div>

                                <div className="w-[50px] h-[50px] flex-1">
                                    <MiniTrendLineChart symbol={symbolDetails.symbol}></MiniTrendLineChart>
                                </div>

                                <div className="text-right w-[120px]">
                                    <p className="text-3xl font-bold text-green-500">
                                        {marketData.displayPrice}
                                    </p>
                                    <p className="text-green-500"> <span>{marketData.sign}</span>
                                        <span>{Math.abs(marketData.absoluteChange).toFixed(2)}</span>
                                        <span className="ml-1">({marketData.percentageChange.toFixed(2)}%)</span></p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="target-price">Target Price </Label>
                                    <Input id="target-price" name="target-price" type="number" value={alert?.targetPrice ?? ""} onChange={onChange} />
                                </Field>
                                <Field>
                                    <Label htmlFor="alert-condition">Alert Condition</Label>
                                    <Select value={alert?.condition ?? ""} onValueChange={(value) => { setAlert({ condition: value as Condition, targetPrice: alert?.targetPrice }) }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Alert Condition" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="above">Above</SelectItem>
                                            <SelectItem value="below">Below</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </FieldGroup>
                        </CardContent>

                        <CardFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button className="flex-1" onClick={addAlert}>
                                Create Alert
                            </Button>
                        </CardFooter>
                    </Card>

                </DialogContent>
            </form>
        </Dialog>
    )
}
