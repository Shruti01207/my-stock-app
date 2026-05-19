import { getLatestNew } from "@/lib/api/stocks-server";
import { getCached, setCached } from "@/lib/server-cache";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {


    const category = request.nextUrl.searchParams.get('category');

    if (!category) {
        return NextResponse.json({
            error: 'Category is required'
        }, { status: 400 })
    }


    let cachedNews;

    cachedNews = getCached(`news-${category}`);


    if (cachedNews == null) {
        cachedNews = await getLatestNew(category);
        setCached(`news-${category}`, cachedNews, 120000);
    }

    return NextResponse.json(cachedNews, { status: 200 });


}
