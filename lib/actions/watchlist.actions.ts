"use server"

import { connectToDatabase } from "@/database/mongoose"
import { auth } from "../better-auth/auth";
import { headers } from "next/headers";
import Watchlist from "@/database/models/watchlist.model";
import { revalidatePath } from "next/cache";
import { serializeWatchlist } from "../serializer/watchlist.serializer";



export const addSymbolToWatchlist = async (symbol: string): Promise<ApiResponse<any>> => {
    try {
        await connectToDatabase();
        // const session= await auth();// get current user session
        const authInstance = await auth();
        const session = await authInstance.api.getSession({
            headers: await headers()
        });
        if (!session?.user?.id) {
            throw new Error("UNAUTHORIZED");
        }
        const userId = session.user.id;
        const updatedList = await Watchlist.findOneAndUpdate(
            { userId: userId, title: "Default" },
            { $addToSet: { symbols: symbol } },
            { upsert: true, new: true }
        );
        revalidatePath("/watchlist");
        return { success: true, data: JSON.parse(JSON.stringify(updatedList)) };
    }
    catch (error: any) {
        console.error("WATCHLIST_ERROR:", error.message || error);
        return { success: false, error: error.message || "DB_ERROR" };
    }

}

export const removeSymbolFromWatchlist = async (symbol: string): Promise<ApiResponse<any>> => {

    try {
        await connectToDatabase();
        const authInstance = await auth();

        const session = await authInstance.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            throw new Error("UNAUTHORIZED")
        }

        const userId = session.user.id;
        const updatedList = await Watchlist.findOneAndUpdate(
            {
                userId: userId, title: "Default"
            },
            {
                $pull: { symbols: symbol }
            },
            { new: true }
        ).lean()
        //lean tells don't give me moongoose doc, instead give me plain javascript object
        return { success: true, data: serializeWatchlist(updatedList) }
    }
    catch (error: any) {
        console.error("Error removing symbol:", error);
        return { success: false, error: error.message || "DB_ERROR" };
    }

}

export const getWatchlist = async (): Promise<ApiResponse<any>> => {
    try {
        await connectToDatabase();
        const authInstance = await auth();

        const session = await authInstance.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            throw new Error("UNAUTHORIZED")
        }

        const userId = session.user.id;
        const list = await Watchlist.findOne({ userId }).lean()
        //lean tells don't give me moongoose doc, instead give me plain javascript object
        return { success: true, data: serializeWatchlist(list) };
    }
    catch (error: any) {
        console.error("Error removing symbol:", error);
        return { success: false, error: error.message || "DB_ERROR" };
    }
}


export const syncWatchlist = async (localSymbols: string[]): Promise<ApiResponse<any>> => {

    try {
        await connectToDatabase();
        const authInstance = await auth();

        const session = await authInstance.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            throw new Error("UNAUTHORIZED")
        }

        const userId = session.user.id;
        const updatedWatchlist = await Watchlist.findOneAndUpdate(
            { userId: userId, title: "Default" },
            { $addToSet: { symbols: { $each: localSymbols } } },
            { upsert: true, new: true }
        ).lean();

        return { success: true, data: serializeWatchlist(updatedWatchlist) }

    }
    catch (error: any) {
        console.error("Error syncing watchlist:", error);
        return { success: false, error: error.message || "DB_ERROR" };
    }

}