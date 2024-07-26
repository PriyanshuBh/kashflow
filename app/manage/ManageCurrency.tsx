"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Budget } from "@prisma/client";
import React, { useState, useTransition } from "react";
import CurrencyPicker from "@/components/CurrencyPicker";
import { Currency, UserExt } from "@/types";
import BudgetPickerNew from "@/components/BudgetPickerNew";
import { useBudgetStore } from "@/stores/budgetStore";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { updateCurrency } from "@/actions/currencyActions";
import { toast } from "sonner";

interface Props {
  user: UserExt;
  budgets: Budget[];
}

const ManageCurrency = ({ user, budgets }: Props) => {
  const [isPending, startTransaction] = useTransition();
  const { budget, setBudget } = useBudgetStore((state) => state);
  const [currency, setCurrency] = useState<Currency | undefined>();

  // console.log("ManageCurrency", currency);

  return (
    <div className="container flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Update Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-5 flex-wrap">
            <BudgetPickerNew
              user={user}
              budget={budget}
              budgets={budgets}
              onBudgetChange={setBudget}
            />
            <CurrencyPicker
              onCurrencyChange={setCurrency}
              currencyCode={budget.currency}
            />
            <Button
              disabled={!currency || currency.code === budget.currency}
              onClick={() => {
                if (!currency) return toast.error("Please select currency");
                startTransaction(() => {
                  updateCurrency({
                    userId: user.id,
                    budgetId: budget.id,
                    currency: currency.code,
                  })
                    .then((res) => {
                      if (res.success) {
                        setBudget(res.data!);
                        return toast.success(res.message);
                      } else {
                        return toast.error(res.error);
                      }
                    })
                    .catch(() => {
                      return toast.error("Unable to change currency!");
                    });
                });
              }}
              className="bg-sky-600 hover:bg-sky-700  text-white"
            >
              {isPending ? (
                <div className="flex gap-2">
                  <Loader2 />
                  <span>Updating...</span>
                </div>
              ) : (
                <span>Update</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageCurrency;
