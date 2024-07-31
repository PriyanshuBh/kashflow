"use client";
import React from "react";
// import { BudgetSummary } from "./Overview";
import SkeletonWrapper from "./SkeletonWrapper";
import SummaryCategoryCard from "./SummaryCategoryCard";
import { CategorySummary } from "@/types";

interface Props {
  isLoading: boolean;
  categorySummary: CategorySummary[];
}

const SummaryCategoryCards = ({ isLoading, categorySummary }: Props) => {
  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={isLoading} fullWidth>
        <SummaryCategoryCard type="income" categorySummary={categorySummary} />
        <SummaryCategoryCard type="expense" categorySummary={categorySummary} />
      </SkeletonWrapper>
    </div>
  );
};

export default SummaryCategoryCards;
