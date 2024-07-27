"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateCurrency = async ({
  userId,
  budgetId,
  currency,
}: {
  userId: string;
  currency: string;
  budgetId: string;
}) => {
  try {
    const updatedBudget = await prisma.budget.update({
      where: {
        id: budgetId,
        userId,
      },
      data: {
        currency,
      },
    });

    if (updatedBudget) {
      revalidatePath("/");
      return {
        success: true,
        message: "Currency updated successfully",
        data: updatedBudget,
      };
    }

    return {
      success: false,
      error: "Unable to update currency, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, updating currency",
    };
  }
};
