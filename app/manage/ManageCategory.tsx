"use client";
import React from "react";
import CategoryList from "./CategoryList";
import { useBudgetStore } from "@/stores/budgetStore";

const ManageCategory = () => {
  const { categories } = useBudgetStore((state) => state);

  return (
    <div className="container flex flex-col gap-4 p-4">
      <CategoryList
        type="income"
        categories={categories.filter((category) => category.type === "income")}
      />
      <CategoryList
        type="expense"
        categories={categories.filter(
          (category) => category.type === "expense"
        )}
      />
    </div>
  );
};

export default ManageCategory;
