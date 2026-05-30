'use client'

import { useNewsSentiments } from "@/hooks/useNewsSentiments";
import { getLatestNew } from "@/lib/api/stocks";
import { useEffect, useState } from "react";

export const MarketNewsWidget = () => {

    const [latestNews, setLatestNews] = useState<any[]>([]);


    useEffect(() => {
        const getLatestNews = async () => {
            const res = await getLatestNew();
            let topStories = res.filter((res: any) => res.category == 'top news')
            topStories.sort((a: any, b: any) => (b.datetime - a.datetime));
            topStories = topStories.splice(0, 10);
            const updatedStories = parseData(topStories)
            setLatestNews(updatedStories);
            console.log("res=", updatedStories);
        }
        getLatestNews();
    }, [])

    const parseData = (stories: any) => {

        const updatedStories = stories.map((story: any) => {
            let currTime = Date.now();
            let diff = currTime - (story.datetime * 1000);
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

        return updatedStories;

    }




    return <>
        <div className="my-3">
            <h1 className="text-2xl font-semibold">Top News Stories</h1>
            <span className="font-thin text-gray-500">From sources across the web</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestNews.map((news) => (
                <div className="news-card" key={news.id}>

                    <div className="flex items-center gap-3">
                        {/* <div className="w-6 h-6 rounded-full bg-blue-500">
                            <img className="w-full h-full" src={news.image} alt={news.id} />
                        </div> */}
                        <span className="font-semibold">{news.source}</span>
                        <span className="font-extralight text-gray-500"><span className="me-1 font-extralight text-gray-500">&bull;</span>{news.timeAgo} </span>
                    </div>
                    <div className="font-semibold">
                        <a href={news.url}>{news.headline}</a>
                    </div>
                </div>
            ))}


        </div>
    </>
}