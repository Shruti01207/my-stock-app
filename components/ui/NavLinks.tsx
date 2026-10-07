
"use client"

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinksProps {
    href: string;
    title: string;
    icon: LucideIcon;
}

const NavLinks = ({ href, title, icon }: NavLinksProps) => {
    const currPath = usePathname();
    const isActive = currPath === href;
    const Icon = icon

    return (
        <Link href={href} key={title} className={`text-white hover:text-yellow-500 transition-colors flex flex-row gap-2
            ${isActive ? 'font-bold text-white' : 'font-normal'} `}>
            <div className="icon">
                <Icon size={20} />
            </div>
            <div className="menu-title">
                {title}
            </div>
        </Link>
    )
}

export default NavLinks