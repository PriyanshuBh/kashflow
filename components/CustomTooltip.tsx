"use client";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import { useBudgetStore } from "@/stores/budgetStore";
import React, { useCallback } from "react";
import CountUp from "react-countup";

const CustomTooltip = ({ active, payload }: any) => {
  const { budget } = useBudgetStore((store) => store);

  const formattingFun = useCallback(
    (value: number) => {
      return formatPrice(value, budget.currency);
    },
    [budget.currency]
  );

  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  const { expense, income } = data;

  const TooltipRow = ({
    label,
    value,
    bgColor,
    textColor,
  }: {
    label: string;
    bgColor: string;
    textColor: string;
    value: number;
  }) => (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("font-bold text-sm", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            className="text-sm"
            formattingFn={formattingFun}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      {income !== 0 && (
        <TooltipRow
          label="Income"
          value={income}
          bgColor="bg-emerald-500"
          textColor="text-emerald-500"
        />
      )}
      <TooltipRow
        label="Expense"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />

      {income > 0 && (
        <TooltipRow
          label="Balance"
          value={income - expense}
          bgColor="bg-gray-100"
          textColor="text-text-foreground"
        />
      )}
    </div>
  );
};

export default CustomTooltip;
