"use server"

import { connectToDatabase } from "@/database/mongoose"
import { auth } from "../better-auth/auth";
import { headers } from "next/headers";
import Watchlist from "@/database/models/watchlist.model";
import { revalidatePath } from "next/cache";
import { serializeWatchlist } from "../serializer/watchlist.serializer";


export const addSymbolToWatchlist = async (symbol: string) => {
    try {
        await connectToDatabase();
        // const session= await auth();// get current user session
        const authInstance = await auth();
        const session = await authInstance.api.getSession({
            headers: await headers()
        });
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
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
        return { success: false, error: "Database operation failed" };
    }

}

export const removeSymbolFromWatchlist = async (symbol: string) => {

    try {
        await connectToDatabase();
        const authInstance = await auth();

        const session = await authInstance.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            throw new Error("Unauthorised")
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
        return serializeWatchlist(updatedList);
    }
    catch (error) {
        console.error("Error removing symbol:", error);
        throw error;
    }

}

export const getWatchlist = async () => {
    try {
        await connectToDatabase();
        const authInstance = await auth();

        const session = await authInstance.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            throw new Error("Unauthorised")
        }

        const userId = session.user.id;
        const list = await Watchlist.findOne({ userId }).lean()
        //lean tells don't give me moongoose doc, instead give me plain javascript object
        return serializeWatchlist(list);
    }
    catch (error) {
        console.error("Error removing symbol:", error);
        throw error;
    }
}