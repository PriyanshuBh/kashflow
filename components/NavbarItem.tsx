"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { buttonVariants } from "./ui/button";

interface Props {
  link: string;
  label: string;
  setOpen?: (open: boolean) => void;
}

const NavbarItem = ({ link, label, setOpen }: Props) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div
      className="relative flex items-center"
      onClick={() => {
        setOpen && setOpen(false);
      }}
    >
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[19px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block bg-gradient-to-r from-amber-400 to-orange-500" />
      )}
    </div>
  );
};

export default NavbarItem;
