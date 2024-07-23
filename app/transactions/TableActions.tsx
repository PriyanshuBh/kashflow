"use client";
import { TransactionColumnsType } from "@/types";
import React, { useTransition } from "react";
import { LuFileText } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import AppDialog from "@/components/AppDialog";
import { toast } from "sonner";
import { deleteTransaction } from "@/actions/transactionActions";
import { useBudgetStore } from "@/stores/budgetStore";

interface Props {
  data: TransactionColumnsType;
}

const TableActions = ({ data }: Props) => {
  const { budget, setUserTransactions } = useBudgetStore((state) => state);
  const [isPending, startTransition] = useTransition();
console.log(isPending)
  const handleDeleteTransaction = () => {
    toast.loading("Deleting Transaction...", { id: "delete-transaction" });
    startTransition(() => {
      deleteTransaction(data.id)
        .then((res) => {
          if (res.success) {
            setUserTransactions({ budgetId: budget.id });
            return toast.success(res.message, { id: "delete-transaction" });
          } else {
            return toast.error(res.error, { id: "delete-transaction" });
          }
        })
        .catch((err) => {
          return toast.error(err.error, { id: "delete-transaction" });
        });
    });
  };

  return (
    <div className="flex gap-4 w-full items-center">
      <AppDialog
        message="Are you sure to delete this Transaction"
        title="Delete Transaction"
        trigger={
          <FaRegTrashAlt className="w-5 h-5 text-red-500 cursor-pointer hover:bg-red-800/30 rounded" />
        }
        onConfirm={handleDeleteTransaction}
      />

      <LuFileText className="w-5 h-5 cursor-pointer hover:bg-slate-500/20 rounded" />
    </div>
  );
};

export default TableActions;
