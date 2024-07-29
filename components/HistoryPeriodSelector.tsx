import {  TimeFrame } from "@/types";
import React from "react";
import SkeletonWrapper from "./SkeletonWrapper";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import YearSelector from "./YearSelector";
import MonthSelector from "./MonthSelector";
import { useBudgetStore } from "@/stores/budgetStore";

interface Props {
  isLoading: boolean;
}

const HistoryPeriodSelector = ({ isLoading }: Props) => {
  const { timeFrame, setTimeFrame } = useBudgetStore((state) => state);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={isLoading} fullWidth={false}>
        <Tabs
          value={timeFrame}
          onValueChange={(value) => setTimeFrame(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>

      <div className="flex flex-wrap items=center gap-2">
        <SkeletonWrapper isLoading={isLoading} fullWidth={false}>
          <YearSelector />
        </SkeletonWrapper>

        {timeFrame === "month" && (
          <SkeletonWrapper isLoading={isLoading} fullWidth={false}>
            <MonthSelector />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
};

export default HistoryPeriodSelector;
