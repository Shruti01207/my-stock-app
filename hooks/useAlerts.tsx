
import { getAlerts } from "@/lib/api/stocks";
import { useQuery } from "@tanstack/react-query"



export const useAlerts = () => {

    return useQuery({
        queryKey: ['alerts-list'],
        queryFn: () => getAlerts(),
        select: (res): Alert[] => {
            return res?.data;
        }
    })
}