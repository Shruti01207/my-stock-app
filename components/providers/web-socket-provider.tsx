'use client'

import { useLiveStore } from "@/stores/useLiveStore";
import React, { useEffect } from "react";


export function WebSocketProvider({ children }: { children: React.ReactNode }) {


    const connect = useLiveStore((state) => state.connect);
    const disconnect = useLiveStore((state) => state.disconnect);


    useEffect(() => {

        // start the connection when the app loads/mounts first time
        connect();

        // When the user closes/leaves the app, shutdown the connection
        return () => {
            disconnect()
        }

    }, [])

    return <>{children}</>

}