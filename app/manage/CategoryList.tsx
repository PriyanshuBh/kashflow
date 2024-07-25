"use client";
import NewCategoryDialog from "@/components/NewCategoryDialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { useBudgetStore } from "@/stores/budgetStore";
import { TransactionType } from "@/types";
import { PlusSquare, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import _ from "lodash";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import CategoryCard from "./CategoryCard";

interface Props {
  type: TransactionType;
  categories: Category[];
}

const CategoryList = ({ type, categories }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {type === "expense" ? (
              <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
            ) : (
              <TrendingUp className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-emerald-500" />
            )}

            <div className="flex flex-col">
              {type === "income" ? "Incomes" : "Expenses"} Categories
              <span className="text-sm text-muted-foreground">
                Sorted by Name
              </span>
            </div>
          </div>
          <NewCategoryDialog
            type={type}
            trigger={
              <Button className="gap-2 text-sm bg-gradient-to-r from-sky-500 to-sky-700  text-white">
                <PlusSquare className="h-4 w-4" />
                Create Category
              </Button>
            }
          />
        </CardTitle>
      </CardHeader>
      <Separator />
      {_.isEmpty(categories) && (
        <div className="flex h-40 w-full flex-col items-center justify-center">
          <p>
            No{" "}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>{" "}
            Categories Found!
          </p>

          <p className="text-sm text-muted-foreground">
            Create one to get started.
          </p>
        </div>
      )}
      {!_.isEmpty(categories) && (
        <div className="gap-2 flex flex-wrap">
          {categories.map((category: Category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CategoryList;
