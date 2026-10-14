'use client';

import { NewsCard, NewsCardSkeleton } from "@/components/shared/news-card";
import { getLatestNew } from "@/lib/api/stocks";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export const MarketNewsWidget = () => {
    const [latestNews, setLatestNews] = useState<MarketNewsArticle[]>([]);
    const [showAll, setShowAll] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getLatestNews = async () => {
            try {
                setLoading(true);
                const res = await getLatestNew();
                setLoading(false);
                let topStories = res.filter((res: MarketNewsArticle) => res.category == 'top news');
                topStories.sort((a: any, b: any) => (b.datetime - a.datetime));
                const updatedStories = parseData(topStories);
                setLatestNews([...updatedStories]);
            }
            catch {

            }
        };
        getLatestNews();
    }, []);


    let visibleNews: MarketNewsArticle[] = []
    if (showAll) {
        visibleNews = latestNews.slice(0, Math.min(20, latestNews.length));
    }
    else {
        visibleNews = latestNews.slice(0, Math.min(8, latestNews.length))
    }


    const parseData = (stories: MarketNewsArticle[]) => {
        const updatedStories = stories.map((story: MarketNewsArticle) => {
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
            <div className="news-header mb-2">
                <h1 className="text-2xl font-semibold">Top News Stories</h1>
                <span className="font-thin text-gray-500">From sources across the web</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                {!loading && visibleNews.map((news) => (
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

            <Button variant="outline" size="lg" className="w-full sm:w-full md:w-auto mt-3" onClick={() => setShowAll((prev) => !prev)}>
                {showAll ? 'View Less' : 'View More'}
            </Button>

        </>
    );
};