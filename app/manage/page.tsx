import { auth } from "@/lib/auth";
import ManageCurrency from "./ManageCurrency";
import { redirect } from "next/navigation";
import { getUserBudgets } from "@/actions/budgetActions";
import { Budget } from "@prisma/client";
import { UserExt } from "@/types";
import ManageCategory from "./ManageCategory";

const ManagePage = async () => {
  const session = await auth();
  const user = session?.user as UserExt;
  if (!user) redirect("/auth/login");

  const response = await getUserBudgets({ userId: user.id });
  const budgets = response.data as Budget[];

  return (
    <div className="flex flex-col w-full">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>

      {/* manage */}
      <ManageCurrency user={user} budgets={budgets} />
      <ManageCategory />
    </div>
  );
};

export default ManagePage;
