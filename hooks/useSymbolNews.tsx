
import { getSymbolNews } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"


export const useSymbolNews = (symbol: string) => {


    return useQuery({
        queryKey: [`news-${symbol}`],
        queryFn: () => getSymbolNews(symbol),
        select: (res) => {
            const list = res.map((story: MarketNewsArticle) => {
                let currTime = Date.now();
                let diff = currTime - (story.datetime * 1000);
                let seconds = Math.ceil(diff / 1000);
                let mins = Math.ceil(seconds / 60);
                let hrs = Math.ceil(mins / 60);
                let days = Math.ceil(hrs / 24);
                let timeAgo = "";
                if (seconds < 60) {
                    timeAgo = `${seconds} sec ago`;
                }
                else if (mins < 60) {
                    timeAgo = `${mins} min ago`;
                }
                else if (hrs < 24) {
                    timeAgo = `${hrs} hr ago`;
                }
                else {
                    timeAgo = `${days} day ago`;
                }

                return {
                    ...story,
                    timeAgo
                };
            });

            return list;

        }

    })



}