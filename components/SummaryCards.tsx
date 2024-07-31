import React from "react";
import SkeletonWrapper from "./SkeletonWrapper";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { BudgetSummary } from "./Overview";
import SummaryCard from "./SummaryCard";

interface Props {
  isLoading: boolean;
  budgetSummary: BudgetSummary | undefined;
}

const SummaryCards = ({ isLoading, budgetSummary }: Props) => {
  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={isLoading} fullWidth>
        <SummaryCard
          amount={budgetSummary ? budgetSummary.income : 0}
          title="Income"
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isLoading}>
        <SummaryCard
          amount={budgetSummary ? budgetSummary.expense : 0}
          title="Expense"
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isLoading}>
        <SummaryCard
          amount={
            budgetSummary ? budgetSummary.income - budgetSummary.expense : 0
          }
          title="Balance"
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-amber-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};

export default SummaryCards;
