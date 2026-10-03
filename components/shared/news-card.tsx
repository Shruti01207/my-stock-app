import React from "react";
import { SENTIMENTS_BADGE_CONFIG } from "@/lib/constants";
import { normalizeText } from "@/lib/utils";

export interface NewsCardProps {
  title: string;
  url: string;
  source: string;
  timeAgo: string;
  sentimentLabel?: string;
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  url,
  source,
  timeAgo,
  sentimentLabel,
  className = "",
}) => {
  const normalizedSentiment = sentimentLabel
    ? normalizeText(sentimentLabel)
    : null;

  const sentimentConfig = normalizedSentiment
    ? SENTIMENTS_BADGE_CONFIG[normalizedSentiment]
    : null;

  return (
    <article
      className={`
    group relative
    flex h-[120px] flex-col
    overflow-hidden
    rounded-md
    border border-gray-700/50
    bg-gray-800/40
    p-4
    shadow-sm
    transition-all duration-200 ease-in-out
    hover:border-gray-600
    hover:bg-gray-800/80
    ${className}
  `}
    >
      {/* Metadata Row - Fixed Height */}
      <div className="flex h-5 shrink-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="truncate font-semibold text-gray-500">
            {source}
          </span>

          <span className="flex shrink-0 items-center gap-2 font-normal text-gray-400">
            <span className="text-gray-500">&bull;</span>
            {timeAgo}
          </span>
        </div>

        {sentimentConfig && (
          <span
            className={`
          inline-flex shrink-0 items-center
          rounded-full border
          px-2.5 py-1
          text-[11px] font-medium
          leading-none tracking-wide
          ${sentimentConfig.classes}
        `}
          >
            {sentimentConfig.label}
          </span>
        )}
      </div>

      {/* News Title - Consistent Starting Position */}
      <div className="mt-3 min-w-0">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="
        block line-clamp-3
        text-sm font-semibold
        leading-[1.5]
        text-gray-100
        transition-colors duration-200
        hover:text-yellow-400
        md:text-base
      "
        >
          {title}
        </a>
      </div>
    </article>
  );
};

export const NewsCardSkeleton: React.FC = () => {
  return (
    <div
      className="
        flex h-[120px] flex-col
        justify-between
        rounded-xl
        border border-gray-700/30
        bg-gray-800/40
        p-4
        animate-pulse
      "
    >
      <div className="flex items-center gap-2">
        <div className="h-3.5 w-20 rounded bg-gray-700/60" />
        <div className="h-3.5 w-14 rounded bg-gray-700/40" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-5/6 rounded bg-gray-700/60" />
        <div className="h-4 w-2/3 rounded bg-gray-700/40" />
      </div>
    </div>
  );
};