import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton"

const MyAvatar = ({ isLoading, name, logo, avatarSize, fontSize }: { isLoading: boolean, name?: string, logo?: string, avatarSize: string, fontSize: string }) => {

    const [logoError, setLogoError] = useState(false);
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])


    if (!isMounted) {
        return null
    }

    return <>
        <div className="company-name flex flex-row gap-3 items-center">
            {isLoading ?
                <Skeleton className={`w-${avatarSize} h-${avatarSize} rounded-full`}></Skeleton> :
                logo && !logoError ? <img className={`w-${avatarSize} h-${avatarSize} rounded-full`} src={logo} alt={name} onError={() => setLogoError(true)} /> :
                    <div className={`w-${avatarSize} h-${avatarSize} rounded-full bg-[#1d1e26] flex items-center justify-center text-[#ffff] text-${fontSize}`}>{name?.[0] ?? 'U'}</div>
            }



        </div>

    </>


}

export default MyAvatar