"use client";
import React, { useEffect  } from "react";
import { BudgetSummary } from "./Overview";
// import { Period, TimeFrame } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { useBudgetStore } from "@/stores/budgetStore";
import SkeletonWrapper from "./SkeletonWrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface Props {
  isLoading: boolean;
  budgetSummary: BudgetSummary | undefined;
}

const History = ({ isLoading, budgetSummary }: Props) => {
  const { timeFrame, period } = useBudgetStore((store) => store);
  // const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");
  // const [period, setPeriod] = useState<Period>({
  //   month: new Date().getMonth(),
  //   year: new Date().getFullYear(),
  // });
  const {
    yearHistoryData,
    monthHistoryData,
    setYearHistoryData,
    setMonthHistoryData,
    budget,
  } = useBudgetStore((state) => state);

  // console.log("Hisotry", period, timeFrame);

  useEffect(() => {
    if (timeFrame === "month") {
      setMonthHistoryData({
        budgetId: budget.id,
        month: period.month,
        year: period.year,
      });
    } else {
      setYearHistoryData({ budgetId: budget.id, year: period.year });
    }
  }, [
    timeFrame,
    budget.id,
    period.month,
    period.year,
    setMonthHistoryData,
    setYearHistoryData,
  ]);

  return (
    <div>
      <h2 className="mt-12 font-bold text-3xl">History</h2>

      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector isLoading={isLoading} />
            <div className="flex h-10 gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                Income
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={isLoading}>
            {yearHistoryData || monthHistoryData ? (
              <ResponsiveContainer width={"100%"} height={300}>
                <BarChart
                  height={300}
                  data={
                    timeFrame === "month" ? monthHistoryData : yearHistoryData
                  }
                  barCategoryGap={5}
                >
                  <defs>
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#10b981" stopOpacity="1" />
                      <stop offset="1" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ef4444" stopOpacity="1" />
                      <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" strokeOpacity="0.2" />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeFrame === "year") {
                        return date.toLocaleDateString("default", {
                          month: "long",
                        });
                      }
                      return date.toLocaleDateString("default", {
                        day: "2-digit",
                      });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey="income"
                    label="Income"
                    fill="url(#incomeBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Bar
                    dataKey="expense"
                    label="Expense"
                    fill="url(#expenseBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => <CustomTooltip {...props} />}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                No Data for the selected period!
                <p className="text-sm text-muted-foreground">
                  Try selecting different period or adding new Transactions
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
