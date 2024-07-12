import { getUserBudgets } from "@/actions/budgetActions";

import Logo from "@/components/Logo";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { UserExt } from "@/types";
import { Budget } from "@prisma/client";
// import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ManageCurrency from "../manage/ManageCurrency";

const WizardPage = async () => {
  const session = await auth();
  const user = session?.user as UserExt;

  if (!user) redirect("/auth/login");
  const response = await getUserBudgets({ userId: user.id });
  const budgets = response.data as Budget[];

  return (
    <div className="relative flex flex-col items-center justify-center mx-auto">
      <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
        <div>
          <h1 className="text-center text-3xl">
            Welcome, <span className="ml-2 font-bold">{user.name}!</span>👋
          </h1>
          <h2 className="mt-2 text-center text-base text-muted-foreground">
            Let &apos;s get started by setting up your currency.
          </h2>
          <h3 className="text-muted-foreground text-center text-sm">
            You can change these settings at any time.
          </h3>
        </div>
      </div>
      <Separator className="my-4" />

      <Card>
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <CurrencyBox user={user} /> */}
          <ManageCurrency user={user} budgets={budgets} />
        </CardContent>
      </Card>
      <Separator className="my-4" />
      {/* <Button className="w-full mt-5" asChild>
        <Link href="/">I&apos;m done! toke me to the dashboard</Link>
      </Button> */}
      <div className="mt-8">
        <Logo />
      </div>
    </div>
  );
};

export default WizardPage;
