"use client";
import { deleteCategory } from "@/actions/categoryActions";
import AppDialog from "@/components/AppDialog";
// import { Button } from "@/components/ui/button";
import { useBudgetStore } from "@/stores/budgetStore";
import { Category } from "@prisma/client";
import { Trash2 } from "lucide-react";
import React, { useTransition } from "react";
import { toast } from "sonner";

interface Props {
  category: Category;
}

const CategoryCard = ({ category }: Props) => {
  const { setCategories } = useBudgetStore((state) => state);
  const [isPending, startTransition] = useTransition();
console.log("isPending", isPending);
  const onDelete = () => {
    startTransition(() => {
      deleteCategory(category.id)
        .then((res) => {
          if (res.success) {
            setCategories();
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch((err) => {
          return toast.error(err.error);
        });
    });
  };

  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] m-2 w-24">
      <div className="flex flex-col items-center gap-2 p-2 relative">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>

        <AppDialog
          title="Deleting Category"
          message={`Are you sure you want to delete "${category.name}"
            category`}
          trigger=<Trash2 className="absolute top-1 right-1 size-4 cursor-pointer text-red-500 hover:shadow-xl hover:shadow-red-600" />
          onConfirm={onDelete}
        />
      </div>
    </div>
  );
};

export default CategoryCard;
