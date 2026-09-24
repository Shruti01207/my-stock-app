'use client'

import AlertCard from "@/components/alerts/AlertCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/hooks/useAlerts";
import { useQueryClient } from "@tanstack/react-query";



export default function AlertDashboard() {

    const { data: alertLists, isFetching } = useAlerts()
    const queryClient = useQueryClient();



    return <>
        <header>
            <h1 className="text-2xl font-bold">
                Stock Alerts
            </h1>
            <span className="text-md text-gray-500">
                Manage your active and triggered price notifications</span>
        </header>

        {isFetching &&
            <div className="alert-container  mt-7 grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5].map((num: number) => {
                    return (
                        <Skeleton className="shadow w-[100%] rounded-lg p-2 px-4 h-[100px]" key={num} ></Skeleton>
                    )
                })}

            </div>}
        {
            !(isFetching) &&

            <div className="alert-container mt-7 grid grid-cols-1 md:grid-cols-2 gap-3">
                {alertLists?.map((a: Alert) => {
                    return (
                        <AlertCard alert={a} key={a.createdAt} ></AlertCard>
                    )
                })}

            </div>

        }



    </>



}
