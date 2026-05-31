
import { useNewsSentiments } from "@/hooks/useNewsSentiments";
import { SENTIMENTS_BADGE_CONFIG } from "@/lib/constants";
import { normalizeText } from "@/lib/utils";



export const NewsList = ({ symbol }: { symbol: string }) => {

    const { data, isLoading } = useNewsSentiments(symbol);

    let news = data?.feed;


    // useEffect(() => {
    //     news = parseData();
    //     console.log("news=", news)
    // }, [news])
    // const parseData = () => {

    //     if (!news || news.length == 0) {
    //         return;
    //     }

    //     const updatedStories = news.map((story: NewsSentiment) => {
    //         let currTime = Date.now();
    //         //'20260530T102905'
    //         const timePublished = story.time_published;
    //         const year = Number(timePublished.slice(0, 4));
    //         const month = Number(timePublished.slice(4, 6)) - 1;
    //         const date = Number(timePublished.slice(6, 8));
    //         const hr = Number(timePublished.slice(9, 11));
    //         const min = Number(timePublished.slice(11, 13));
    //         const sec = Number(timePublished.slice(13, 15));

    //         const datetime = new Date(
    //             year,
    //             month,
    //             date,
    //             hr,
    //             min,
    //             sec
    //         ).getTime()

    //         let diff = currTime - (datetime);
    //         let seconds = Math.ceil(diff / 1000);
    //         let mins = Math.ceil(seconds / 60);
    //         let hrs = Math.ceil(mins / 60);
    //         let days = Math.ceil(hrs / 24);
    //         let timeAgo = ""
    //         if (seconds < 60) {
    //             timeAgo = `${seconds} sec ago`
    //         }
    //         else if (mins < 60) {
    //             timeAgo = `${mins} min ago`
    //         }
    //         else if (hrs < 24) {
    //             timeAgo = `${hrs} hr ago`
    //         }
    //         else {
    //             timeAgo = `${days} day ago`
    //         }

    //         return {
    //             ...story,
    //             timeAgo

    //         }

    //     })

    //     return updatedStories;

    // }

    if (isLoading) {
        return <>News is loading</>
    }

    return <>
        <h1 className="font-bold text-xl mt-4 ">Latest Headlines</h1>


        {news && news.map((story: NewsSentiment, index: number) => {

            return <div className="border border-zinc-800/80 rounded-xl bg-zinc-900/60 p-2 my-3" key={index}>
                <div className="flex flex-row gap-3 items-center my-1">
                    <span className={`border py-0.5 px-1 rounded-lg text-[12px] font-medium  ${SENTIMENTS_BADGE_CONFIG[normalizeText(story.overall_sentiment_label)].classes}`}>{SENTIMENTS_BADGE_CONFIG[normalizeText(story.overall_sentiment_label)].label}</span>
                    {/* */}
                </div>
                <div className="content flex flex-row my-1">
                    <div className="left flex-1 p-0.5">
                        <strong className="text-sm font-medium">{story.title}</strong>
                        <div className="hidden md:block">
                            <p className="line-clamp-2 leading-relaxed text-gray-500 mt-2">{story.summary}</p>
                        </div>
                    </div>
                    <div className="right rounded flex items-center justify-center">
                        <img src={story.banner_image} loading="lazy" alt={`image-${index}`} className="w-15 h-15 block object-cover max-w-[120px] rounded"
                        // onError={(e) => {
                        //     console.log("e=", e);
                        //     const target = e.target as HTMLElement
                        //     if (target.parentElement) {

                        //     }
                        // }}

                        />
                    </div>
                </div>

                <div className="meta-data flex flex-row gap-2">
                    <span className="text-zinc-500 text-xs">{story.source.toUpperCase()}</span>
                    <span className="text-zinc-500 text-xs">&bull; {story.timeAgo}</span>
                </div>


            </div>

        })}

    </>



}