
import { useSymbolNews } from "@/hooks/useSymbolNews";
import { NewsCard, NewsCardSkeleton } from "./news-card";
import { useState } from "react";

export const NewsList = ({ symbol }: { symbol: string }) => {
  const { data, isLoading } = useSymbolNews(symbol);
  const [showAll, setShowAll] = useState<boolean>(false);

  const news = data

  //let visibleNews: MarketNewsArticle[] = []

  // if (data && showAll) {
  //   visibleNews = data.slice(0, Math.min(20, data.length));
  // }
  // else if (data) {
  //   visibleNews = data.slice(0, Math.min(8, data.length))
  // }


  if (isLoading) {
    return (
      <div className="space-y-4 my-4">
        <div>
          <h1 className="text-2xl font-semibold">Latest Headlines</h1>
          <span className="font-thin text-gray-500">
            From sources across the web for {symbol.toUpperCase()}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <NewsCardSkeleton key={num} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-4">
      <div>
        <h1 className="text-2xl font-semibold">Latest Headlines</h1>
        <span className="font-thin text-gray-500">
          From sources across the web for {symbol.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
        {news && news.length > 0 ? (
          news.map((story: MarketNewsArticle, index: number) => (
            <NewsCard
              key={index}
              title={story.headline}
              url={story.url}
              source={story.source}
              timeAgo={story.timeAgo}
            />
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-gray-500">
            No recent news headlines available for {symbol.toUpperCase()}
          </div>
        )}


      </div>

    </div>
  );
};
