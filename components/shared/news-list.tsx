import { useNewsSentiments } from "@/hooks/useNewsSentiments";
import { NewsCard, NewsCardSkeleton } from "./news-card";

export const NewsList = ({ symbol }: { symbol: string }) => {
  const { data, isLoading } = useNewsSentiments(symbol);

  const news = data?.feed;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news && news.length > 0 ? (
          news.map((story: NewsSentiment, index: number) => (
            <NewsCard
              key={index}
              title={story.title}
              url={story.url}
              source={story.source}
              timeAgo={story.timeAgo}
              sentimentLabel={story.overall_sentiment_label}
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
