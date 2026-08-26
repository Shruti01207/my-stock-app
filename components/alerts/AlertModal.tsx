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
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { SymbolTypes } from "@/lib/enums"
import { Loader2, Mountain } from "lucide-react"
import { createAlert, editAlert } from "@/lib/api/stocks"



export function AlertModal() {

    const open = useAlertStore((state) => state.open);
    const setOpen = useAlertStore((state) => state.setOpen);
    const symbolDetails = useAlertStore((state) => state.symbolDetails);
    const companyProfileQuery = useCompanyProfile(symbolDetails?.symbol);
    const symbolsData = useSymbolInfo(symbolDetails?.symbol);
    const marketData = useMarketData(symbolDetails?.symbol);
    const defaultAlertState = useAlertStore(state => state.alertForm);
    const mode = useAlertStore((state) => state.mode)
    const profile = (symbolDetails?.type == SymbolTypes.CommonStock) ? companyProfileQuery.data : symbolsData.data
    const [alertForm, setAlertForm] = useState<AlertForm | EditAlertForm>(defaultAlertState);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setAlertForm(defaultAlertState)
    }, [defaultAlertState])



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
            return { ...prev, targetPrice, condition: computeAutoCondition(prev?.isConditionManual, prev?.condition, targetPrice, marketData.isLoading, marketData?.displayPrice) }
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
            symbol: symbolDetails?.symbol,
            targetPrice: alertForm.targetPrice,
            condition: alertForm.condition
        }

        if (mode == 'add') {
            await createNewAlert(req)
        }
        else {

            req = {
                ...req,
                alertId: (alertForm as EditAlertForm)?.alertId
            }
            await updateAlert(req)
        }



    }


    const createNewAlert = async (req: AlertRequest) => {
        setIsLoading(true)
        const res = await createAlert(req);
        setIsLoading(false)

        if (res.success) {
            setOpen(false, mode, symbolDetails);
            toast.success("Alert created successfully");
            setAlertForm(defaultAlertState);
        }
        else {
            toast.error(res.error || "Failed to update alert");
        }

    }


    const updateAlert = async (req: AlertRequest) => {

        setIsLoading(true)
        const res = await editAlert(req);
        setIsLoading(false)
        if (res.success) {
            setOpen(false, mode, symbolDetails);
            toast.success("Alert updated successfully");
            setAlertForm(defaultAlertState);
        }
        else {
            toast.error(res.error || "Failed to update alert");
        }

    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen, mode, symbolDetails)
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

                                {symbolDetails?.type == SymbolTypes.CommonStock && <img className="w-10 h-10 rounded-full" src={(profile as any)?.logo} alt={(profile as any)?.name} />}
                                {symbolDetails?.type == SymbolTypes.ETP ? <Mountain size={25} /> : ''}

                                <span>{mode == 'add' ? 'Create' : 'Edit'}  Price Alert</span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="w-[30%]">
                                    <h2 className="text-2xl font-bold">{symbolDetails?.symbol}</h2>
                                    <p className="text-sm text-muted-foreground">{symbolDetails?.type == SymbolTypes.CommonStock ? (profile as any)?.name : (profile as any)?.description}</p>
                                </div>

                                <div className="w-[100%] h-[50px] flex-1">
                                    <MiniTrendLineChart symbol={symbolDetails?.symbol}></MiniTrendLineChart>
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
                                        <span>{mode == 'add' ? 'Creating...' : 'Updating'}</span>
                                    </>
                                    :
                                    <span>{mode == 'add' ? 'Create Alert' : 'Update Alert'} </span>
                                }

                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </DialogContent>

        </Dialog>
    )
}
