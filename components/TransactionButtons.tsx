"use client";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { UserExt } from "@/types";
import _ from "lodash";
import NewTransactionDialog from "./NewTransactionDialog";
import { Budget, Category } from "@prisma/client";
// import BudgetPicker from "./BudgetPicker";
import { useBudgetStore } from "@/stores/budgetStore";
import BudgetPickerNew from "./BudgetPickerNew";

interface Props {
  user: UserExt;
  categories: Category[];
  budgets: Budget[];
}

const TransactionButtons = ({ user, categories }: Props) => {
  const { userBudgets, setUserBudgets, budget, setBudget } = useBudgetStore(
    (state) => state
  );
  // const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState("");

  useEffect(() => {
    setUserBudgets({ userId: user.id });
  }, [setUserBudgets, user.id]);

  if (_.isEmpty(userBudgets)) return null;

  // console.log("TransactionButtons -selectedBudget", userBudgets);

  return (
    <div className="flex items-center gap-3 flex-col md:flex-row">
      <div className="flex items-center gap-2 ">
        <span className="font-semibold text-xl">Budget : </span>
        {/* <BudgetPicker budgets={userBudgets} user={user} /> */}
        <BudgetPickerNew
          user={user}
          budget={budget}
          budgets={userBudgets}
          onBudgetChange={setBudget}
        />
      </div>
      <div className="gap-2 flex justify-between">
        <NewTransactionDialog
          trigger={
            <Button
              variant="outline"
              className="border-emerald-500 dark:bg-emerald-950 dark:text-white hover:dark:bg-emerald-700 hover:dark:text-white"
            >
              New Income
            </Button>
          }
          type="income"
          categories={categories.filter(
            (category) => category.type === "income"
          )}
          user={user}
        />

        <NewTransactionDialog
          trigger={
            <Button
              variant="outline"
              className="border-rose-500 dark:bg-rose-950 dark:text-white hover:dark:bg-rose-700 hover:dark:text-white"
            >
              New Expense
            </Button>
          }
          type="expense"
          categories={categories.filter(
            (category) => category.type === "expense"
          )}
          user={user}
        />
      </div>
    </div>
  );
};

export default TransactionButtons;
