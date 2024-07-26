"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NewCategorySchema } from "@/lib/schema";
// import { TransactionType } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DateRange } from "react-day-picker";
import { z } from "zod";

/******************GET CATEGORY SUMMARY******************************* */
export const getCategorySummary = async ({
  budgetId,
  date,
}: {
  budgetId: string;
  date: DateRange;
}) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) redirect("/auth/login");

    const summary = await prisma.transaction.groupBy({
      by: ["type", "categoryId"],
      where: {
        budgetId,
        date: {
          gte: date.from,
          lte: date.to,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    });

    if (summary) {
      revalidatePath("/");
      // console.log("summary", summary);
      return {
        success: true,
        data: summary,
      };
    }

    return {
      success: false,
      error: "Unable to get Category summary, please try again later",
    };
  } catch (error) {
    return {
      success: error,
      error: "Internal Server Error, getting category summary",
    };
  }
};

/******************DELETE CATEGORY*************************************/
export const deleteCategory = async (categoryId: string) => {
  const deletedCategory = await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  if (deletedCategory) {
    return {
      success: true,
      message: "Category Successfully deleted",
    };
  }

  try {
    return {
      success: false,
      error: "Unable to delete category, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error,deleting category",
    };
  }
};

/******************CREATE CATEGORIES********************************** */
export const createCategory = async (
  data: z.infer<typeof NewCategorySchema>
) => {
  const valid = NewCategorySchema.safeParse(data);
  if (!valid)
    return {
      success: false,
      error: "Invalid data create new category",
    };

  console.log("createCategory", data);

  try {
    const newCategory = await prisma.category.create({
      data,
    });

    if (newCategory) {
      revalidatePath("/");
      revalidatePath("/manage");
      return {
        success: true,
        message: `Category ${newCategory.name} created successfully`,
      };
    }

    return {
      success: false,
      error: "Unable to crete new Category, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, creating category",
    };
  }
};

/******************GET CATEGORIES********************************** */
export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany();

    if (categories) {
      return {
        success: true,
        data: categories,
      };
    }

    return {
      success: false,
      error: "Could not get categories, please try again later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error, getting categories",
    };
  }
};
