"use client";
import React, { useEffect, useState } from "react";
import { format, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/DateRangePicker";
import BudgetPickerNew from "@/components/BudgetPickerNew";
import { TransactionColumnsType, UserExt } from "@/types";
import { useBudgetStore } from "@/stores/budgetStore";
import { formatPrice } from "@/lib/formatPrice";
import { DataTable } from "@/components/DataTable";
import { TransactionColumns } from "./TransactionColumns";

interface Props {
  user: UserExt;
}

const TransactionsHistory = ({ user }: Props) => {
  const {
    budget,
    userBudgets,
    userTransactions,
    categories,
    setBudget,
    setUserBudgets,
    setUserTransactions,
  } = useBudgetStore((state) => state);
  const [date, setDate] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  useEffect(() => {
    setUserBudgets({ userId: user.id });
    setUserTransactions({ budgetId: budget.id, date });
  }, [setUserBudgets, user.id, budget.id, setUserTransactions, date]);

  const TransactionColumnsData: TransactionColumnsType[] = [];
  userTransactions.map((item) => {
    const category = categories.find(
      (category) => category.id === item.categoryId
    );
    const data = {
      id: item.id,
      categoryName: category?.name ?? "",
      description: item.description,
      date: format(item.date, "yyyy-MM-dd"),
      type: item.type,
      amount: formatPrice(item.amount, budget.currency),
    };
    TransactionColumnsData.push(data);
  });

  return (
    <div className="border-b bg-card">
      <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
        <h3 className="text-3xl font-bold">Transactions</h3>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex gap-2 items-center">
            <span>Budget :</span>
            <BudgetPickerNew
              user={user}
              budget={budget}
              budgets={userBudgets}
              onBudgetChange={setBudget}
              showNew={false}
            />
          </div>
          <DateRangePicker date={date} setDate={setDate} />
        </div>
      </div>

      <DataTable columns={TransactionColumns} data={TransactionColumnsData} />
    </div>
  );
};

export default TransactionsHistory;
