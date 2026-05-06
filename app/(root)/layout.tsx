import Providers from "@/components/providers/providers"
import Header from "@/components/shared/Header"
import { auth } from "@/lib/better-auth/auth";

import { headers } from "next/headers"

const Layout = async ({ children }: { children: React.ReactNode }) => {

    const authInstance = await auth();// getting

    // getting the session info on the server side
    const session = await authInstance.api.getSession({
        headers: await headers()
    });

    return (
        <main>
            <div className="text-gray-400">

                <Header intialUser={session?.user} />
                <div className="container pt-4">
                    <Providers>{children}</Providers>
                </div>
            </div>
        </main>
    )
}

export default Layout
