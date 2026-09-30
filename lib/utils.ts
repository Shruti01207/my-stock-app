import { clsx, type ClassValue } from "clsx"
import { DateTime } from "luxon"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getUSStockTime = (date: Date = new Date()) => {

  return date.toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

}

export const getUSMarketTime = () => {
  const now = new Date();
  // Convert current time to a string in New York time, then back to a Date object
  const etString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
  return new Date(etString).getTime();
};

export const getFormatedDate = (date: Date) => {
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
  return formattedDate
}



//  Return date in format YYYY-MM-DD
export const getISOFormattedDate = (d: Date) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(d);

}


export const formatMarketCap = (numInMillions: number) => {
  const value = numInMillions * 1000000;
  if (!value)
    return "$0";

  // 10 kharab
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`
  }
  else if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}T`
  }

  return `$${value.toLocaleString()}`

}





export const isMarketOpen = () => {
  const now = DateTime.now().setZone("America/New_York");
  const dayOfWeek = now.weekday;

  if (dayOfWeek > 5) {
    return false
  }

  const marketOpen = now.set({
    hour: 9,
    minute: 30,
    second: 0
  }).toMillis();

  const marketClose = now.set({
    hour: 16,
    minute: 0,
    second: 0
  }).toMillis();

  if (now.toMillis() >= marketOpen && now.toMillis() <= marketClose) {
    return true;
  }
  else {
    return false;
  }



}

export const normalizeText = (text: string) => {
  // Converts "Somewhat-Bullish" or "Somewhat_Bullish" to "somewhatbullish"
  return text.toLowerCase().replace(/[-_\s]/g, '');
};

export const firstCharToUpperCase = (str: string) => {
  if (str.length == 0)
    return "";

  return str?.[0]?.toUpperCase() + str.slice(1);
}

export const getDateToLocaleString = (date: string) => {
  return new Date(date).toLocaleString()
}
