import {
  getSummary,
  getYearHistoryData,
  getHistoryYears,
  getMonthHistoryData,
  getUserTransactions,
} from "@/actions/transactionActions";
import { BudgetSummary } from "@/components/Overview";
import { Budget, Category, Transaction } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { startOfMonth } from "date-fns";
import { getCategories, getCategorySummary } from "@/actions/categoryActions";

import { CategorySummary, HistoryData, Period } from "@/types";
import _ from "lodash";
import { getUserBudgets } from "@/actions/budgetActions";

export type BudgetState = {
  historyYears: number[];
  yearHistoryData: HistoryData[];
  monthHistoryData: HistoryData[];
  categories: Category[];
  budget: Budget;
  budgetSummary: BudgetSummary;
  categorySummary: CategorySummary[];
  timeFrame: "month" | "year";
  period: Period;
  userBudgets: Budget[];
  userTransactions: Transaction[];
};

export type BudgetActions = {
  setBudget: (budget: Budget) => void;
  setUserBudgets: ({ userId }: { userId: string }) => void;
  setCategories: () => void;
  setHistoryYears: ({ budgetId }: { budgetId: string }) => void;
  setBudgetSummary: ({
    budgetId,
    date,
  }: {
    budgetId: string;
    date?: DateRange;
  }) => void;
  setCategorySummary: ({
    budgetId,
    date,
  }: {
    budgetId: string;
    date?: DateRange;
  }) => void;
  setYearHistoryData: ({
    budgetId,
    year,
  }: {
    budgetId: string;
    year?: number;
  }) => void;
  setMonthHistoryData: ({
    budgetId,
    year,
    month,
  }: {
    budgetId: string;
    year?: number;
    month?: number;
  }) => void;
  setTimeFrame: (timeFrame: "month" | "year") => void;
  setPeriod: (period: Period) => void;
  setUserTransactions: ({
    budgetId,
    date,
  }: {
    budgetId: string;
    date?: DateRange;
  }) => void;
};

export type BudgetStore = BudgetState & BudgetActions;

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budget: {} as Budget,
      budgetSummary: {} as BudgetSummary,
      categorySummary: [] as CategorySummary[],
      categories: [] as Category[],
      historyYears: [],
      yearHistoryData: [] as HistoryData[],
      monthHistoryData: [] as HistoryData[],
      timeFrame: "month",
      period: {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
      userBudgets: [] as Budget[],
      userTransactions: [] as Transaction[],

      setBudget: (budget: Budget) => {
        set(() => ({
          budget,
        }));
      },

      setUserBudgets: async ({ userId }) => {
        const response = await getUserBudgets({
          userId,
        });
        if (response.success && response.data) {
          const userBudgets = response.data;

          set(() => ({
            userBudgets,
          }));
        }
      },

      /*****************SET USER TRANSACTIONS*************** */
      setUserTransactions: async ({
        budgetId,
        date = { from: startOfMonth(new Date()), to: new Date() },
      }) => {
        const response = await getUserTransactions({ budgetId, date });

        if (response && response.data) {
          const transactions = response.data;
          set(() => ({
            userTransactions: transactions,
          }));
        }
      },

      /*****************SET TIME FRAME******************** */
      setPeriod: (period) => {
        set(() => ({
          period,
        }));
      },

      /*****************SET TIME FRAME******************** */
      setTimeFrame: (timeFrame) => {
        set(() => ({
          timeFrame,
        }));
      },

      /*****************SET HISTORY YEARS***************** */
      setHistoryYears: async ({ budgetId }: { budgetId: string }) => {
        const response = await getHistoryYears(budgetId);
        if (response.success && response.data) {
          const historyYears = response.data;
          // console.log("History years", response.data, typeof historyYears);

          set(() => ({
            historyYears,
          }));
        }
      },

      /*****************SET YEAR HISTORY DATA***************** */
      setYearHistoryData: async ({
        budgetId,
        year = new Date().getFullYear(),
      }: {
        budgetId: string;
        year?: number;
      }) => {
        const response = await getYearHistoryData({ budgetId, year });
        if (response.success && response.data) {
          const yearHistoryData = response.data as HistoryData[];

          set(() => ({
            yearHistoryData,
          }));
        }
      },

      /*****************SET MONTH HISTORY DATA***************** */
      setMonthHistoryData: async ({
        budgetId,
        year = new Date().getFullYear(),
        month = new Date().getUTCMonth(),
      }: {
        budgetId: string;
        year?: number;
        month?: number;
      }) => {
        const response = await getMonthHistoryData({ budgetId, year, month });
        if (response.success && response.data) {
          const monthHistoryData = response.data as HistoryData[];
          // console.log("monthHistoryData", monthHistoryData);

          set(() => ({
            monthHistoryData,
          }));
        }
      },

      /*****************SET CATEGORIES******************************** */
      setCategories: async () => {
        const response = await getCategories();
        if (response.success && response.data) {
          const categories = response.data as Category[];
          set(() => ({
            categories,
          }));
        }
      },

      /*****************SET BUDGET SUMMARY******************************** */
      setBudgetSummary: async ({
        budgetId,
        date = { from: startOfMonth(new Date()), to: new Date() },
      }: {
        budgetId: string;
        date?: DateRange;
      }) => {
        const response = await getSummary({ budgetId, date });
        if (response.success && response.data) {
          const expense =
            response.data.find((item) => item.type === "expense")?._sum
              .amount ?? 0;
          const income =
            response.data.find((item) => item.type === "income")?._sum.amount ??
            0;
          set(() => ({
            budgetSummary: { expense, income },
          }));
        }
      },

      /*****************SET CATEGORY SUMMARY******************************** */
      setCategorySummary: async ({
        budgetId,
        date = { from: startOfMonth(new Date()), to: new Date() },
      }: {
        budgetId: string;
        date?: DateRange;
      }) => {
        const response = await getCategorySummary({ budgetId, date });
        if (response.success && response.data) {
          const summary = response.data.map((item) => {
            return {
              categoryId: item.categoryId,
              type: item.type,
              amount: item._sum.amount,
            };
          }) as CategorySummary[];

          set(() => ({
            categorySummary: summary,
          }));
        }
      },
    }),
    {
      name: "food-storage",
    }
  )
);
