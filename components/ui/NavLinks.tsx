
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

interface NavLinksProps {
    href: string;
    title: string;
}

const NavLinks = ({ href, title }: NavLinksProps) => {
    const currPath = usePathname();
    const isActive = currPath === href;

    return (
        <Link href={href} key={title} className={`text-white hover:text-yellow-500 transition-colors
            ${isActive ? 'font-bold text-white' : 'font-normal'} `}>{title}</Link>
    )
}

export default NavLinks