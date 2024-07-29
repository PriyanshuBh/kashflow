"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage } from "./ui/avatar";
import { User } from "@prisma/client";
// import Link from "next/link";
import { logout } from "@/actions/authActions";
import { useRouter } from "next/navigation";
// import { Button } from "./ui/button";

interface Props {
  user: User;
}

const AuthButtonMenu = ({ user }: Props) => {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <DropdownMenu open={openMenu} onOpenChange={() => setOpenMenu(false)}>
      <DropdownMenuTrigger
        className="focus:outline-none"
        onMouseEnter={() => setOpenMenu(true)}
        // onMouseLeave={() => setOpenMenu(false)}
      >
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.image ? user.image : "/images/no-image.svg"} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 dark:bg-slate-700">
        <DropdownMenuItem asChild>
          <span className="line-clamp-1 w-full text-center font-semibold">
            Welcome, {user.name}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* profile */}
        <DropdownMenuItem asChild>
          <span className="w-full cursor-pointer">Profile</span>
        </DropdownMenuItem>

        {/* logout */}
        <DropdownMenuItem asChild>
          <span
            className="w-full cursor-pointer"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Logout
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButtonMenu;
