

import { getNewsSentiments } from "@/lib/api/stocks"
import { useQuery } from "@tanstack/react-query"


export const useNewsSentiments = (symbol: string) => {

    return useQuery<NewsSentimentApiResponse>({
        queryKey: ["news-sentiment", symbol],
        queryFn: () => getNewsSentiments(symbol),
        staleTime: (10 * 60 * 1000),
        select: (data) => {
            const updatedFeed = data.feed.map((story: NewsSentiment) => {
                let currTime = Date.now();
                //'20260530T102905'
                const timePublished = story.time_published;
                const year = Number(timePublished.slice(0, 4));
                const month = Number(timePublished.slice(4, 6)) - 1;
                const date = Number(timePublished.slice(6, 8));
                const hr = Number(timePublished.slice(9, 11));
                const min = Number(timePublished.slice(11, 13));
                const sec = Number(timePublished.slice(13, 15));

                const datetime = new Date(
                    year,
                    month,
                    date,
                    hr,
                    min,
                    sec
                ).getTime()

                let diff = currTime - (datetime);
                let seconds = Math.ceil(diff / 1000);
                let mins = Math.ceil(seconds / 60);
                let hrs = Math.ceil(mins / 60);
                let days = Math.ceil(hrs / 24);
                let timeAgo = ""
                if (seconds < 60) {
                    timeAgo = `${seconds} sec ago`
                }
                else if (mins < 60) {
                    timeAgo = `${mins} min ago`
                }
                else if (hrs < 24) {
                    timeAgo = `${hrs} hr ago`
                }
                else {
                    timeAgo = `${days} day ago`
                }

                return {
                    ...story,
                    timeAgo
                }



            })

            return {
                ...data,
                feed: updatedFeed
            }

        }
    })



}