import { getAlerts } from "@/lib/api/stocks-server"
import { useQuery } from "@tanstack/react-query"



export const useAlerts = () => {

    return useQuery({
        queryKey: ['alerts-list'],
        queryFn: () => getAlerts(),
    })
}