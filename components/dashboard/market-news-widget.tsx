'use client'

import { getLatestNew } from "@/lib/api/stocks";
import { useEffect, useState } from "react";

export const MarketNewsWidget = () => {

    const [latestNews, setLatestNews] = useState<any[]>([]);

    useEffect(() => {
        const getLatestNews = async () => {
            const res = await getLatestNew();
            setLatestNews(res);
            console.log("res=", res);
        }
        getLatestNews();
    }, [])

    return <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            {latestNews.map((news) => (

                <div key={news.id} className="">{news.headline}</div>

            ))}
        </div>
    </>
}