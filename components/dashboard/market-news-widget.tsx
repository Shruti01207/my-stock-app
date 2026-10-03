'use client';

import { NewsCard, NewsCardSkeleton } from "@/components/shared/news-card";
import { getLatestNew } from "@/lib/api/stocks";
import { useEffect, useState } from "react";

export const MarketNewsWidget = () => {
    const [latestNews, setLatestNews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getLatestNews = async () => {
            try {
                setLoading(true);
                const res = await getLatestNew();
                setLoading(false);
                let topStories = res.filter((res: any) => res.category == 'top news');
                topStories.sort((a: any, b: any) => (b.datetime - a.datetime));
                topStories = topStories.splice(0, 10);
                const updatedStories = parseData(topStories);
                setLatestNews(updatedStories);
            }
            catch {

            }
        };
        getLatestNews();
    }, []);

    const parseData = (stories: any) => {
        const updatedStories = stories.map((story: any) => {
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

        return updatedStories;
    };

    return (
        <>
            <div className="my-4">
                <h1 className="text-2xl font-semibold">Top News Stories</h1>
                <span className="font-thin text-gray-500">From sources across the web</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!loading && latestNews.map((news) => (
                    <NewsCard
                        key={news.id}
                        title={news.headline}
                        url={news.url}
                        source={news.source}
                        timeAgo={news.timeAgo}
                    />
                ))}
                {loading && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((SkeletonNum) => (
                    <NewsCardSkeleton key={SkeletonNum} />
                ))}
            </div>
        </>
    );
};