import { useState } from "react";
import { Skeleton } from "../ui/skeleton"

const MyAvatar = ({ isLoading, name, logo, avatarSize, fontSize }: { isLoading: boolean, name?: string, logo?: string, avatarSize: string, fontSize: string }) => {

    const [logoError, setLogoError] = useState(false);



    return <>
        <div className="company-name flex flex-row gap-3 items-center">
            {isLoading ?
                <Skeleton className={`w-${avatarSize} h-${avatarSize} rounded-full`}></Skeleton> :
                logo && !logoError ? <img className="w-10 h-10 rounded-full" src={logo} alt={name} onError={() => setLogoError(true)} /> :
                    <div className={`w-${avatarSize} h-${avatarSize} rounded-full bg-zinc-400 flex items-center justify-center text-[#17181f] text-${fontSize}`}>{name?.[0] ?? 'U'}</div>
            }



        </div>

    </>


}

export default MyAvatar