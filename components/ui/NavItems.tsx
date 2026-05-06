import Link from 'next/link'
import React from 'react'
import { NAV_ITEMS } from '@/lib/constants'
import NavLinks from './NavLinks'



const NavItems = () => {
    return (
        <ul className='flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium' >
            {
                NAV_ITEMS.map((item: any) => {
                    return (
                        <NavLinks key={item.title} href={item.href} title={item.title} />
                    )
                })
            }
        </ul>
    )
}

export default NavItems