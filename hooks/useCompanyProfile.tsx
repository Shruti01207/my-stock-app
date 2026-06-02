import { getCompanyProfile } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"


export const useCompanyProfile = (finhubSymbol: string) => {


    return useQuery({
        queryKey: ["company-profile", finhubSymbol],
        queryFn: () => getCompanyProfile(finhubSymbol),
        staleTime: (24 * 60 * 60 * 1000)
    })


}