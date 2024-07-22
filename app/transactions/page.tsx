import React from "react";
import TransactionsHistory from "./TransactionsHistory";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserExt } from "@/types";


const TransactionsPage = async () => {
  const session = await auth();
  const user = session?.user as UserExt;
  if (!user) redirect("auth/login");

  return (
    <div className="flex flex-col w-full">
      <TransactionsHistory user={user} />
    </div>
  );
};

export default TransactionsPage;
