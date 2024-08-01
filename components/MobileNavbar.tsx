"use client";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import { navLinks } from "@/lib/navLinks";
import NavbarItem from "./NavbarItem";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { User } from "@prisma/client";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/authActions";
import { useRouter } from "next/navigation";

interface Props {
  user: User;
}

const MobileNavbar = ({ user }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
              {/* <PiggyBank className="stroke h-11 w-11 stroke-amber-500 stroke-[1.5]" /> */}
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-full sm:w-[540px]"
            side="left"
            aria-describedby="mobile menu"
          >
            <Logo />
            <SheetTitle className="hidden">Mobile Menu</SheetTitle>
            <div className="flex flex-col gap-1 pt-4">
              {user && (
                <span className="font-semibold">Welcome, {user.name}</span>
              )}
              <Separator />
              {navLinks.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  setOpen={setOpen}
                />
              ))}
              {user && (
                <span
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start text-lg text-muted-foreground hover:text-foreground cursor-pointer"
                  )}
                >
                  Logout
                </span>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <p className="bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-3xl font-bold text-transparent">
          KashFlow
        </p>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      </nav>
    </div>
  );
};

export default MobileNavbar;
