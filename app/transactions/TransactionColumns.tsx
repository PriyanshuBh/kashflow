"use client";
import { cn } from "@/lib/utils";
import { TransactionColumnsType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import TableActions from "./TableActions";

export const TransactionColumns: ColumnDef<TransactionColumnsType>[] = [
  {
    accessorKey: "categoryName",
    header: "Category",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <span
          className={cn(
            "p-1 rounded",
            data.type === "income"
              ? "text-emerald-600 bg-emerald-600/20"
              : "text-red-600 bg-red-600/20"
          )}
        >
          {data.type.toUpperCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const data = row.original;
      return <TableActions data={data} />;
    },
  },
];
