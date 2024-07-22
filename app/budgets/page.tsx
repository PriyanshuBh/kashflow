import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const BudgetsPage = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) redirect("/auth/login");

  return (
    <div className="border-b bg-card">
      <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
        <p className="text-3xl font-bod">Hello, {user.name}</p>
      </div>
    </div>
  );
};

export default BudgetsPage;
