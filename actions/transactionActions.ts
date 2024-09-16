"use server";
import prisma from "@/lib/prisma";
import { NewTransactionSchema, OverviewSchema } from "@/lib/schema";
import { HistoryData } from "@/types";
import { getDaysInMonth } from "date-fns";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
import { DateRange } from "react-day-picker";
import { z } from "zod";

/******************GET HISTORY YEARS**************************** */
export const getHistoryYears = async (budgetId: string) => {
  try {
    const result = await prisma.monthHistory.findMany({
      where: {
        budgetId,
      },
      select: {
        year: true,
      },
      distinct: ["year"],
      orderBy: {
        year: "asc",
      },
    });

    if (result) {
      let years = result.map((item) => item.year);
      if (years.length === 0) {
        years = [new Date().getFullYear()];
      }
      return {
        success: true,
        data: years,
      };
    }

    return {
      success: false,
      error: "Could not get history data, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, getting history data",
    };
  }
};

/******************GET MONTH HISTORY DATA**************************** */
export const getMonthHistoryData = async ({
  budgetId,
  year,
  month,
}: {
  budgetId: string;
  year: number;
  month: number;
}) => {
  try {
    const result = await prisma.monthHistory.groupBy({
      by: ["day"],
      where: {
        budgetId,
        year,
        month,
      },
      _sum: {
        expense: true,
        income: true,
      },
      orderBy: {
        day: "asc",
      },
    });

    if (result) {
      revalidatePath("/");
      const history: HistoryData[] = [];
      const daysInMonth = getDaysInMonth(new Date(year, month));

      for (let i = 1; i <= daysInMonth; i++) {
        let expense = 0;
        let income = 0;
        const day = result.find((item) => item.day === i);
        if (day) {
          expense = day._sum.expense || 0;
          income = day._sum.income || 0;
        }

        history.push({
          expense,
          income,
          year,
          month,
          day: i,
        });
      }

      return {
        success: true,
        data: history,
      };
    }

    return {
      success: false,
      error: "Could not get month history data, please try again later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error, getting month history data",
    };
  }
};

/******************GET YEAR HISTORY DATA**************************** */
export const getYearHistoryData = async ({
  budgetId,
  year,
}: {
  budgetId: string;
  year: number;
}) => {
  try {
    const result = await prisma.yearHistory.groupBy({
      by: ["month"],
      where: {
        budgetId,
        year,
      },
      _sum: {
        expense: true,
        income: true,
      },
      orderBy: [
        {
          month: "asc",
        },
      ],
    });

    if (result) {
      revalidatePath("/");
      const historyData: HistoryData[] = [];

      for (let i = 0; i < 12; i++) {
        let expense = 0;
        let income = 0;

        const month = result.find((item) => item.month === i);
        if (month) {
          expense = month._sum.expense || 0;
          income = month._sum.income || 0;
        }

        historyData.push({
          year,
          month: 1,
          expense,
          income,
        });
      }
      return {
        success: true,
        data: historyData,
      };
    }

    return {
      success: false,
      error: "Could not get history years, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, getting history years",
    };
  }
};

/******************GET TRANSACTION SUMMARY********************************** */
export const getSummary = async ({
  budgetId,
  date,
}: {
  budgetId: string;
  date: DateRange;
}) => {
  try {
    const valid = OverviewSchema.safeParse(date);
    if (!valid || !budgetId)
      return {
        success: false,
        error: "Invalid Data",
      };

    const summary = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        budgetId: budgetId,
        date: {
          gte: date.from,
          lte: date.to,
        },
      },
      _sum: {
        amount: true,
      },
    });

    if (summary) {
      revalidatePath("/");
      return {
        success: true,
        data: summary,
      };
    }

    return {
      success: false,
      error: "Could not get summary, please try again later",
    };
  } catch (error) {
    console.log("getTotals", error);
    return {
      success: false,
      error: "Internal Server Error, getting summary",
    };
  }
};

/******************CREATE TRANSACTION********************************** */
export const createTransaction = async ({
  formData,
  budgetId,
  categoryId,
}: {
  formData: z.infer<typeof NewTransactionSchema>;
  budgetId: string | undefined;
  categoryId: string | undefined;
}) => {
  try {
    const valid = NewTransactionSchema.safeParse(formData);
    if (!valid.success || !budgetId || !categoryId) {
      return {
        success: false,
        error: "Invalid Data",
      };
    }

    // const transaction = await prisma.transaction.create({
    //   data: {
    //     amount: formData.amount,
    //     description: formData.description ?? "",
    //     type: formData.type,
    //     date: formData.date,
    //     budgetId,
    //     categoryId,
    //   },
    // });

    const [transaction, monthHistory, yearHistory] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          amount: formData.amount,
          description: formData.description ?? "",
          type: formData.type,
          date: formData.date,
          budgetId,
          categoryId,
        },
      }),

      // Update month history
      prisma.monthHistory.upsert({
        where: {
          day_month_year_budgetId:
            {
              budgetId,
              day: formData.date.getUTCDate(),
              month: formData.date.getUTCMonth(),
              year: formData.date.getUTCFullYear(),
            },
        },
        create: {
          budgetId,
          day: formData.date.getUTCDate(),
          month: formData.date.getUTCMonth(),
          year: formData.date.getUTCFullYear(),
          expense: formData.type === "expense" ? formData.amount : 0,
          income: formData.type === "income" ? formData.amount : 0,
        },
        update: {
          expense: {
            increment: formData.type === "expense" ? formData.amount : 0,
          },
          income: {
            increment: formData.type === "income" ? formData.amount : 0,
          },
        },
      }),

      

      // Update year history
      prisma.yearHistory.upsert({
        where: {
          month_year_budgetId:
            {
              budgetId,
              month: formData.date.getUTCMonth(),
              year: formData.date.getUTCFullYear(),
            } ,
        },
        create: {
          budgetId,
          month: formData.date.getUTCMonth(),
          year: formData.date.getUTCFullYear(),
          expense: formData.type === "expense" ? formData.amount : 0,
          income: formData.type === "income" ? formData.amount : 0,
        },
        update: {
          expense: {
            increment: formData.type === "expense" ? formData.amount : 0,
          },
          income: {
            increment: formData.type === "income" ? formData.amount : 0,
          },
        },
      }),
    ]);

    if (transaction && monthHistory && yearHistory) {
      console.log("Transaction created successfully");
      revalidatePath("/");
      return {
        success: true,
        message: "Transaction created successfully",
      };
    }

    return {
      success: false,
      error: "Unable to create Transaction, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, creating Transaction",
    };
  }
};

/******************GET USER TRANSACTION********************************** */
export const getUserTransactions = async ({
  budgetId,
  date,
}: {
  budgetId: string;
  date: DateRange;
}) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        budgetId,
        date: {
          gte: date.from,
          lte: date.to,
        },
      },
    });

    if (transactions) {
      return {
        success: true,
        data: transactions,
      };
    }

    return {
      success: false,
      error: "Could not get user transactions, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, getting user transactions",
    };
  }
};

/******************DELETE TRANSACTION********************************** */
export const deleteTransaction = async (id: string) => {
  try {
    const deletedTransaction = await prisma.transaction.delete({
      where: { id },
    });

    if (deletedTransaction) {
      revalidatePath("/transactions");
      return {
        success: true,
        message: "Transaction deleted successfully",
      };
    }

    return {
      success: false,
      error: "Unable to delete Transaction, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, deleting Transaction",
    };
  }
};
