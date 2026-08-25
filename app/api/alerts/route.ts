import Alert from "@/database/models/alert.model";
import { connectToDatabase } from "@/database/mongoose";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {
        await connectToDatabase();
        const authInstance = await auth();
        const session = await authInstance.api.getSession({
            headers: await headers()
        });
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const { symbol, targetPrice, condition } = body;

        if (!symbol || targetPrice === undefined || !condition) {
            return NextResponse.json({
                error: "Missing required fields "
            }, { status: 400 });
        }

        const newAlert = await Alert.create({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
            targetPrice: Number(targetPrice),
            condition,
            isActive: true
        });

        return NextResponse.json({ success: true, data: newAlert }, { status: 201 });

    }
    catch (error: any) {
        console.error("CREATE_ALERT_ERROR", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}


export async function GET(request: NextRequest) {

    try {
        await connectToDatabase();

        const authInstance = await auth();
        const session = await authInstance.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const alerts = await Alert.find({
            userId: session.user.id
        }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: alerts }, { status: 200 });

    }
    catch (error: any) {
        console.error("GET_ALERTS_ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}

export async function DELETE(request: NextRequest) {

    try {
        await connectToDatabase();
        const authInstance = await auth();
        const session = await authInstance.api.getSession({
            headers: await headers()
        });

        if (!session?.user.id) {
            return NextResponse.json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }

        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                error: "Alert Id is required"
            }, { status: 400 })
        }


        const deletedAlert = await Alert.findOneAndDelete({
            _id: id,
            userId: session?.user?.id
        })

        if (!deletedAlert) {
            return NextResponse.json({ error: "Alert not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: deletedAlert }, { status: 200 })

    }
    catch (error: any) {
        console.error("DELETE_ALERTS_ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }






}

export async function PATCH(request: NextRequest) {
    try {
        await connectToDatabase()
        const authInstance = await auth()
        const session = await authInstance.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return NextResponse.json({
                error: "UNAUTHORIZED"
            }, {
                status: 401
            });
        }

        const id = request.nextUrl.searchParams.get('id');
        const { targetPrice, condition } = await request.json()

        if (targetPrice === undefined || !condition) {
            return NextResponse.json({ success: false, error: "Missing required fields" })
        }
        const updatedAlert = await Alert.findOneAndUpdate({ _id: id, userId: session?.user?.id }, { $set: { targetPrice: Number(targetPrice), condition } }, { new: true })
        return NextResponse.json({
            success: true,
            data: updatedAlert
        });
    }
    catch (error: any) {

        console.error("PATCH_ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Internal Server Error"
            },
            { status: 500 }
        );

    }


}


