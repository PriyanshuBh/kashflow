"use client";
import React, { ReactNode, useCallback } from "react";
import { Card } from "./ui/card";
import CountUp from "react-countup";
import { Budget } from "@prisma/client";
import { useBudgetStore } from "@/stores/budgetStore";
import { formatPrice } from "@/lib/formatPrice";

interface Props {
  amount: number;
  title: string;
  icon: ReactNode;
}

const SummaryCard = ({ amount, title, icon }: Props) => {
  const budget = useBudgetStore((store) => store.budget) as Budget;

  const formatPriceFn = useCallback(
    (value: number) => {
      return formatPrice(value, budget.currency);
    },
    [budget.currency]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          decimals={2}
          className="text-2xl w-fit"
          end={amount}
          formattingFn={(value: number) => {
            return formatPriceFn(value);
          }}
        />
      </div>
    </Card>
  );
};

export default SummaryCard;
