'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Search, X } from 'lucide-react'
import NavItems from '../ui/NavItems'
import UserDropdown from '../ui/UserDropdown'
import { Button } from '../ui/button'
import { useSearchStore } from '@/stores/useSearchStore'
import { auth } from '@/lib/better-auth/auth'
import { authClient } from '@/lib/actions/auth-client'
import { useAuthStore } from '@/stores/useAuthStore'

const Header = ({ intialUser }: { intialUser: any }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const onOpen = useSearchStore((state) => state.onOpen)
    const [mounted, setMounted] = React.useState(false);

    const storedUser = useAuthStore((state) => state.user)
    const setUser = useAuthStore((state) => state.setUser)// it means it will return set user
    const clearUser = useAuthStore((state) => state.clearUser)
    const { data: session, isPending } = authClient.useSession()

    const displayUser = mounted ? storedUser || intialUser : intialUser;


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

    // user-changed->set user->user changed->changed user->infinite loop

    // why this work?
    React.useEffect(() => {
        setMounted(true)
    }, [])


    return (
        <header className='sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/80 backdrop-blur-md'>
            <div className='container flex h-[64px] items-center justify-between px-4 sm:px-6'>
                {/* Left Section: Menu & Logo */}
                <div className='flex items-center gap-2 sm:gap-6'>
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
                            src="/assets/images/logo.png"
                            alt="Logo"
                            width={110}
                            height={44}
                            className='h-9 w-auto cursor-pointer brightness-110'
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
