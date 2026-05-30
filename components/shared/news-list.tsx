
import { useNewsSentiments } from "@/hooks/useNewsSentiments";
import { SENTIMENTS_BADGE_CONFIG } from "@/lib/constants";
import { normalizeText } from "@/lib/utils";
import Link from "next/link";


export const NewsList = ({ symbol }: { symbol: string }) => {

    const { data, isLoading } = useNewsSentiments(symbol);

    const news = data?.feed;


    if (isLoading) {
        return <>News is loading</>
    }
    console.log("news", news)
    return <>
        <h1 className="font-bold text-xl mt-4 ">Latest Headlines</h1>


        {news && news.map((story: NewsSentiment, index: number) => {

            return <div className="border border-zinc-800/80 rounded-xl bg-zinc-900/60 p-2 my-3" key={index}>
                <div className="flex flex-row gap-3 items-center my-1">
                    <span className={`border py-1 px-1.5 rounded text-xs font-medium  ${SENTIMENTS_BADGE_CONFIG[normalizeText(story.overall_sentiment_label)].classes}`}>{SENTIMENTS_BADGE_CONFIG[normalizeText(story.overall_sentiment_label)].label}</span>
                    <span className="text-gray-500 text-xs">{story.source.toUpperCase()}</span>
                </div>
                <div className="content flex flex-row my-1">
                    <div className="left flex-1 p-0.5">
                        <strong className="text-sm">{story.title}</strong>
                        <p className="line-clamp-2 leading-relaxed text-gray-500 mt-2">{story.summary}</p>
                    </div>
                    <div className="right rounded flex items-center justify-center">
                        <img src={story.banner_image} loading="lazy" alt={`image-${index}`} className="w-20 h-20 block object-cover max-w-[120px] rounded" />
                    </div>

                </div>


            </div>

        })}

    </>



}