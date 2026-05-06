import { clsx, type ClassValue } from "clsx"
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


export const getLastDateExcludingWeekends = () => {
  const date = new Date();
  console.log("date", date)
  const today = date.getDay();

  console.log("today=", today)
  if (today == 6) {
    const lastFriday = date.getDate() - 1;
    console.log("lastFriday=", lastFriday)
  }
  else if (today == 0) {
    const lastFriday = date.getDate() - 2;
    let end = new Date();
    end.setDate(lastFriday);
    end.setHours(16, 0, 0);
    let closeTime = new Date(getUSStockTime(end)).getTime();
    let start = new Date();
    start.setDate(lastFriday - 4);
    start.setHours(9, 30, 0);
    console.log("start", start)
    let openTime = new Date(getUSStockTime(start)).getTime();
    return [openTime, closeTime]

  }
}