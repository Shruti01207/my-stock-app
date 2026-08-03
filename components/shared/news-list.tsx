import { useNewsSentiments } from "@/hooks/useNewsSentiments";
import { SENTIMENTS_BADGE_CONFIG } from "@/lib/constants";
import { normalizeText } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export const NewsList = ({ symbol }: { symbol: string }) => {
  const { data, isLoading } = useNewsSentiments(symbol);

  let news = data?.feed;

  if (isLoading) {
    return (
      <>
        <h1 className="font-bold text-lg my-4">Latest Headlines</h1>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-y-3 md:gap-y-3 lg:gap-3">
          {[1, 2, 3, 4, 5, 6].map((num) => {
            return <Skeleton key={num} className="h-[150px] w-full" />;
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="font-bold text-lg my-4">Latest Headlines</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-y-3 md:gap-y-3 lg:gap-3">
        {news &&
          news.map((story: NewsSentiment, index: number) => {
            return (
              <div
                className="border border-zinc-800/80 rounded-xl bg-zinc-900/60 p-2"
                key={index}
              >
                <div className="flex flex-row gap-3 items-center my-1">
                  <span
                    className={`border py-0.5 px-1 rounded-lg text-[12px] font-medium  ${SENTIMENTS_BADGE_CONFIG[normalizeText(story.overall_sentiment_label)].classes}`}
                  >
                    {
                      SENTIMENTS_BADGE_CONFIG[
                        normalizeText(story.overall_sentiment_label)
                      ].label
                    }
                  </span>
                  {/* */}
                </div>
                <div className="content flex flex-row my-1">
                  <div className="left flex-1 p-0.5">
                    <strong className="text-sm font-medium">
                      {story.title}
                    </strong>
                    <div className="hidden md:block">
                      <p className="line-clamp-2 leading-relaxed text-gray-500 mt-2">
                        {story.summary}
                      </p>
                    </div>
                  </div>
                  <div className="right rounded flex items-center justify-center">
                    <img
                      src={
                        story.banner_image
                          ? story.banner_image
                          : "https://placehold.co/400x400/1a1a1a/666666?text=No+Image"
                      }
                      loading="lazy"
                      alt={`image-${index}`}
                      className="w-15 h-15 block object-cover max-w-[120px] rounded"
                      onError={(e) => {
                        console.log("e=", e);
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src =
                          "https://placehold.co/400x400/1a1a1a/666666?text=No+Image";
                      }}
                    />
                  </div>
                </div>

                <div className="meta-data flex flex-row gap-2">
                  <span className="text-zinc-500 text-xs">
                    {story.source.toUpperCase()}
                  </span>
                  <span className="text-zinc-500 text-xs">
                    &bull; {story.timeAgo}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};
