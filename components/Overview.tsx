"use client";
import React, { useEffect, useState, useTransition } from "react";
import { DateRangePicker } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { startOfMonth } from "date-fns";
import { useBudgetStore } from "@/stores/budgetStore";
// import { getSummary } from "@/actions/transactionActions";
import SummaryCards from "./SummaryCards";
import SummaryCategoryCards from "./SummaryCategoryCards";
import History from "./History";

export type BudgetSummary = {
  expense: number;
  income: number;
};

const Overview = () => {
  const [isPending, startTransition] = useTransition();
  const {
    budget,
    // setBudget,
    budgetSummary,
    categorySummary,
    setCategories,
    setHistoryYears,
    setBudgetSummary,
    setCategorySummary,
    setYearHistoryData,
    setMonthHistoryData,
  } = useBudgetStore((state) => state);
  const [date, setDate] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  useEffect(() => {
    startTransition(() => {
      // setBudget();
      setCategories();
      setBudgetSummary({ budgetId: budget.id, date });
      setCategorySummary({ budgetId: budget.id, date });
      setHistoryYears({ budgetId: budget.id });
      setYearHistoryData({ budgetId: budget.id });
      setMonthHistoryData({ budgetId: budget.id });
    });
  }, [
    budget.id,
    date,
    // setBudget,
    setBudgetSummary,
    setCategorySummary,
    setCategories,
    setHistoryYears,
    setYearHistoryData,
    setMonthHistoryData,
  ]);

  return (
    <div className="mt-5 flex flex-col gap-4">
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker date={date} setDate={setDate} />
        </div>
      </div>

      <div className="container flex w-full flex-col gap-2 pb-5">
        <SummaryCards isLoading={isPending} budgetSummary={budgetSummary} />
        <SummaryCategoryCards
          isLoading={isPending}
          categorySummary={categorySummary}
        />
        <History isLoading={isPending} budgetSummary={budgetSummary} />
      </div>
    </div>
  );
};

export default Overview;
