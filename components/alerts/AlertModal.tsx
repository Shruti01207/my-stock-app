"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAlertStore } from "@/stores/useAlertStore"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useSymbolInfo } from "@/hooks/useSymbolInfo"
import { useCompanyProfile } from "@/hooks/useCompanyProfile"
import { useMarketData } from "@/hooks/useMarketData"
import { useState } from "react"
import { createAlert } from "@/lib/api/stocks-server"
import { toast } from "sonner"
import { SymbolTypes } from "@/lib/enums"
import { Loader2, Mountain } from "lucide-react"

interface Alert {
    targetPrice?: number;
    condition: "above" | "below" | "none";
    isConditionManual: boolean;
}

export function AlertModal() {

    const open = useAlertStore((state) => state.open);
    const setOpen = useAlertStore((state) => state.setOpen);
    const symbolDetails = useAlertStore((state) => state.symbolDetails);
    const companyProfileQuery = useCompanyProfile(symbolDetails.symbol);
    const symbolsData = useSymbolInfo(symbolDetails.symbol);
    const marketData = useMarketData(symbolDetails.symbol)

    const profile = (symbolDetails.type == SymbolTypes.CommonStock) ? companyProfileQuery.data : symbolsData.data
    const defaultAlertState: Alert = {
        targetPrice: undefined,
        condition: "none",
        isConditionManual: false
    }
    const [alertForm, setAlertForm] = useState<Alert>(defaultAlertState);
    const [isLoading, setIsLoading] = useState(false);



    function computeAutoCondition(
        isManualCondition: boolean,
        currentCondition: "above" | "below" | "none",
        targetPrice: number | undefined,
        marketDataLoading: boolean,
        marketPrice: number | undefined
    ): "above" | "below" | "none" {

        if (isManualCondition) {
            return currentCondition
        }

        if (targetPrice === undefined || marketDataLoading || marketPrice === undefined) {
            return "none"
        }

        return (marketPrice <= targetPrice) ? 'above' : 'below'

    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetPrice = (event.target.value != "") ? Number(event.target.value) : undefined;
        setAlertForm((prev) => {
            return { ...prev, targetPrice, condition: computeAutoCondition(prev?.isConditionManual, prev.condition, targetPrice, marketData.isLoading, marketData?.displayPrice) }
        })
    }



    const currentPrice = marketData?.displayPrice ?? 0;
    // const condition = "above"


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!alertForm || (alertForm.targetPrice == undefined || alertForm.condition == "none")) {
            toast.error("Form is invalid")
            return;
        }

        let req: AlertRequest = {
            symbol: symbolDetails.symbol,
            targetPrice: alertForm.targetPrice,
            condition: alertForm.condition
        }
        try {
            setIsLoading(true)
            const res = await createAlert(req);

            if (res.success) {
                setOpen(false, symbolDetails);
                toast.success("Alert created successfully");
                setAlertForm(defaultAlertState);
                setIsLoading(false)
            }
            else {
                toast.error("Failed to create alert");
            }
        }
        catch (error) {
            console.error("Error creating alert", error);
            toast.error("An unexpected error occurred");
        }
        finally {
            setIsLoading(false)
        }

    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen, symbolDetails)
        if (!isOpen) {
            setAlertForm(defaultAlertState)
        }
    }





    return (
        <Dialog open={open} onOpenChange={(isOpen) => handleOpenChange(isOpen)} >

            <DialogContent className="max-w-lg sm:max-h-[90dvh] overflow-y">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex flex-row items-center gap-2 mb-3">

                                {symbolDetails.type == SymbolTypes.CommonStock && <img className="w-10 h-10 rounded-full" src={profile?.logo} alt={profile?.name} />}
                                {symbolDetails.type == SymbolTypes.ETP ? <Mountain size={25} /> : ''}

                                <span>Create Price Alert</span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="w-[30%]">
                                    <h2 className="text-2xl font-bold">{symbolDetails.symbol}</h2>
                                    <p className="text-sm text-muted-foreground">{symbolDetails.type == SymbolTypes.CommonStock ? profile?.name : profile?.description}</p>
                                </div>

                                <div className="w-[100%] h-[50px] flex-1">
                                    <MiniTrendLineChart symbol={symbolDetails.symbol}></MiniTrendLineChart>
                                </div>
                                {!marketData.isLoading ?
                                    <>
                                        <div className="text-right w-[120px]">
                                            <p className="text-3xl font-bold">
                                                {marketData.displayPrice}
                                            </p>
                                            <p><span>{marketData.sign}</span>
                                                {(marketData.absoluteChange != undefined) &&
                                                    <span>{Math.abs(marketData.absoluteChange).toFixed(2)}</span>
                                                }

                                                {(marketData.percentageChange != undefined) &&
                                                    <span className={marketData.color}>  ({marketData.percentageChange.toFixed(2)}%)</span>
                                                }

                                            </p>
                                        </div>
                                    </> : <></>
                                }

                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="target-price">Target Price </Label>
                                    <Input id="target-price" name="target-price" type="number" value={alertForm?.targetPrice ?? ""} onChange={onChange} />
                                </Field>
                                <Field>
                                    <Label htmlFor="alertForm-condition">Alert Condition</Label>
                                    <Select value={alertForm?.condition ?? ""} onValueChange={(value) => { setAlertForm((prev) => { return { ...prev, condition: value as Condition, isConditionManual: true } }) }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Alert Condition" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="above">Above</SelectItem>
                                            <SelectItem value="below">Below</SelectItem>
                                            <SelectItem value="none">Select Condition</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </FieldGroup>
                        </CardContent>

                        <CardFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button className="flex-1" type="submit">
                                {isLoading ?
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Creating..</span>
                                    </>
                                    :
                                    <span>Create Alert</span>
                                }

                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </DialogContent>

        </Dialog>
    )
}
