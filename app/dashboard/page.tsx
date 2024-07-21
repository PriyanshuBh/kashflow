import { auth } from "@/lib/auth";
import { UserExt } from "@/types";
import { redirect } from "next/navigation";
import _ from "lodash";
import TransactionButtons from "@/components/TransactionButtons";
import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import Overview from "@/components/Overview";

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user as UserExt;
  const categories = (await prisma.category.findMany()) as Category[];

  if (!user) redirect("/auth/login");
  if (!user.settings && _.isEmpty(user.budgets)) redirect("/wizard");

  const budgets = await prisma.budget.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <main className="bg-background w-full">
      <div className="bg-card border-b container">
        <div className="container flex flex-wrap items-center justify-between gap-2 py-8">
          <p className="text-3xl font-bold">Hello, {user.name}</p>

          <TransactionButtons
            user={user}
            categories={categories}
            budgets={budgets}
          />
        </div>
      </div>

      <Overview />
    </main>
  );
}
