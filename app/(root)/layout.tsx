import Providers from "@/components/providers/providers"
import Header from "@/components/shared/Header"
import { WatchList } from "@/components/watchlist/Watchlist";
import { auth } from "@/lib/better-auth/auth";

import { headers } from "next/headers"

const Layout = async ({ children }: { children: React.ReactNode }) => {

    const authInstance = await auth();// getting

    // getting the session info on the server side
    const session = await authInstance.api.getSession({
        headers: await headers()
    });

    return (
        <main >
            <div className="text-gray-400">

                <Header intialUser={session?.user} />
                <div className="max-w-6xl mx-auto mx-3 flex flex-col md:flex-row">
                    <div className="container h-[100vh] pt-4 overflow-y-scroll scrollbar-hide">
                        {/* <Providers>{children}</Providers> */}
                        {children}
                    </div>
                    <div className="hidden md:block md:w-[30%] right border border-t-0 w-full">
                        <WatchList />
                    </div>
                </div>

            </div>


        </main>
    )
}

export default Layout
