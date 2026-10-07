'use client'

import { authClient } from '@/lib/actions/auth-client'
import { useAuthStore } from '@/stores/useAuthStore'
import { useSearchStore } from '@/stores/useSearchStore'
import { AlarmClock, BellRing, Menu, Search, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import NavItems from '../ui/NavItems'
import UserDropdown from '../ui/UserDropdown'
import { Button } from '../ui/button'


const Header = ({ intialUser }: { intialUser: any }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const onOpen = useSearchStore((state) => state.onOpen)
    const [mounted, setMounted] = React.useState(false);

    const storedUser = useAuthStore((state) => state.user)
    const setUser = useAuthStore((state) => state.setUser)
    const clearUser = useAuthStore((state) => state.clearUser)
    const { data: session, isPending } = authClient.useSession()

    const displayUser = mounted ? storedUser || intialUser : intialUser;
    const router = useRouter();


    useEffect(() => {


        if (!isPending) {
            if (session?.user) {
                setUser(session.user)
            }
            else {
                clearUser()
            }
        }

    }, [isPending, session, setUser, clearUser])


    React.useEffect(() => {
        setMounted(true)
    }, [])


    return (
        <header className='sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/80 backdrop-blur-md'>
            <div className='container flex h-[64px] items-center justify-between px-4 sm:px-6'>
                {/* Left Section: Menu & Logo */}
                <div className='flex items-center sm:gap-0'>
                    {/* Mobile Menu Toggle */}
                    <div className='flex sm:hidden items-center'>
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            className="text-gray-400 hover:text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>

                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/assets/images/logo.svg"
                            alt="Logo"
                            width={60}
                            height={60}
                            className=' cursor-pointer brightness-110'
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    {/* <nav className='hidden sm:flex items-center ml-2'>
                        <NavItems />
                    </nav> */}
                </div>

                {/* Right Section: Search & User */}
                <div className='flex items-center gap-2 sm:gap-4'>
                    {/* Search Icon */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                        onClick={() => onOpen("navigate")}
                    >
                        <Search className='size-6
                        ' />
                    </Button>

                    <Button variant="ghost"
                        size="icon"
                        onClick={() => router.push('/alert-dashboard')}
                        className='hidden md:inline-block'
                    >
                        <BellRing className='size-6'></BellRing>
                    </Button>

                    {/* User Dropdown */}
                    {displayUser ? (
                        // React passes in the user dropdown like {user:{ }}, so we
                        // need to destructure this user object from react props object
                        <UserDropdown user={displayUser} />
                    ) : (
                        <Link href="/sign-in">Log In</Link>
                    )}

                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className='sm:hidden absolute top-[64px] left-0 w-full bg-gray-900 border-b border-gray-700 p-4 animate-in slide-in-from-top-2 duration-200'>
                    <nav onClick={() => setIsMenuOpen(false)}>
                        <NavItems />
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Header
