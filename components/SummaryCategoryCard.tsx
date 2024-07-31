import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { formatPrice } from "@/lib/formatPrice";
import { useBudgetStore } from "@/stores/budgetStore";
import { Progress } from "./ui/progress";
import { CategorySummary } from "@/types";

interface Props {
  type: string;
  categorySummary: CategorySummary[];
}

const SummaryCategoryCard = ({ type, categorySummary }: Props) => {
  const { categories, budget } = useBudgetStore((store) => store);

  const filteredData = categorySummary.filter((item) => item.type === type);
  const total = filteredData.reduce((acc, el) => acc + (el.amount || 0), 0);

  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
          {type === "income" ? "Income" : "Expenses"} by Category
        </CardTitle>

        <div className="flex items-center justify-between gap-2">
          {filteredData.length === 0 && (
            <div className="flex h-60 w-full flex-col items-center justify-center">
              No data found for the selected period
              <p className="text-sm text-muted-foreground">
                Try selecting different period, or try adding new{" "}
                {type === "income" ? "income" : "expense"}
              </p>
            </div>
          )}

          {filteredData.length > 0 && (
            <ScrollArea className="h-60 w-full px-4">
              <div className="flex w-full flex-col gap-4 p-4">
                {filteredData.map((item) => {
                  const amount = item.amount || 0;
                  const percentage = (amount * 100) / (total || amount);
                  const category = categories.find(
                    (category) => category.id === item.categoryId
                  );

                  return (
                    <div className="flex flex-col gap-2" key={category?.id}>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-gray-400">
                          {category?.icon} {category?.name}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {percentage.toFixed(0)}%
                          </span>
                        </span>

                        <span>{formatPrice(amount, budget.currency)}</span>
                      </div>

                      <Progress
                        value={percentage}
                        indicator={
                          type === "income" ? "bg-emerald-500" : "bg-red-500"
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default SummaryCategoryCard;
