// import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
// import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
// import { useRouter } from "next/navigation";
// import { Avatar, AvatarImage } from "./ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useState } from "react";
import { User } from "@prisma/client";
import { auth } from "@/lib/auth";
// import { cn } from "@/lib/utils";
import AuthButtonMenu from "./AuthButtonMenu";

const AuthButton = async () => {
  const session = await auth();
  const user = session?.user as User;

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <AuthButtonMenu user={user} />
        </>
      ) : (
        <div className="flex items-center gap-1">
          <Button asChild variant="outline">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
