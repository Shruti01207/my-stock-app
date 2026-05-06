'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import {
  Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar"

interface UserDropdownProps {
  user: User | null
}
const UserDropdown = ({ user }: UserDropdownProps) => {

  const router = useRouter();

  const handleLogout = () => {
    router.push("/sign-in");
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
        <div className="relative">
          <Avatar className="h-8 w-8 border border-gray-700">
            <AvatarImage src="/assets/images/user-avatar.png" alt="User" />
            <AvatarFallback className="bg-teal-400 text-gray-950 font-bold">{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          {/* Notification Dot */}
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 border-2 border-gray-800 rounded-full"></span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-100" align="end">

        <DropdownMenuLabel className="text-gray-400">
          <div className="flex gap-2 items-center">
            <div className="avatar">
              <Avatar className="h-7 w-7 border border-gray-700">
                <AvatarImage src="/assets/images/user-avatar.png" alt="User" />
                <AvatarFallback className="bg-teal-400 text-gray-950 font-bold">{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
            <div className="name">
              {user?.name}
            </div>
          </div>



        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuLabel className="text-gray-400">My Account</DropdownMenuLabel>


        {/* <DropdownMenuGroup>
          <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-gray-700 hover:text-red-400 cursor-pointer">
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
