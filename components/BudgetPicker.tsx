"use client";
import { UserExt } from "@/types";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NewBudgetSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useEffect, useState } from "react";
import { Budget } from "@prisma/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import _ from "lodash";
import NewBudgetDialog from "./NewBudgetDialog";
import { useBudgetStore } from "@/stores/budgetStore";

interface Props {
  budgets: Budget[];
  user: UserExt;
}

const BudgetPicker = ({ budgets, user }: Props) => {
  const { setBudget, budget } = useBudgetStore((state) => state);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof NewBudgetSchema>>({
    resolver: zodResolver(NewBudgetSchema),
    defaultValues: {
      name: budget ? budget.name : "",
    },
    mode: "all",
  });

  const onSubmit = (formData: z.infer<typeof NewBudgetSchema>) => {
    console.log("BudgetPicker", formData);
  };

  useEffect(() => {
    if (budget && budget.name) {
      form.setValue("name", budget.name);
    }
  }, [budget, form]);

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            const selectedBudget =
              !_.isEmpty(budgets) &&
              budgets.find((budget) => budget.name === field.value);

            return (
              <FormItem className="flex flex-col w-full">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between border-orange-500",
                          !field.name && "text-muted-foreground"
                        )}
                      >
                        {budget ? (
                          <span>{budget.name}</span>
                        ) : (
                          <span className="animate-fade animate-infinite">
                            Select Budget
                          </span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full">
                    <Command>
                      <CommandInput placeholder="Search budgets..." />
                      {/***************** * NEW BUDGET DIALOG************* */}
                      <NewBudgetDialog user={user} />
                      <CommandList>
                        <CommandEmpty>No budgets found.</CommandEmpty>
                        <CommandGroup>
                          {budgets.map((budget) => {
                            return (
                              <CommandItem
                                value={budget.name}
                                key={budget.name}
                                onSelect={(value) => {
                                  field.onChange(value);
                                  setBudget(
                                    budgets.find(
                                      (budget) => budget.name === value
                                    )!
                                  );
                                  form.handleSubmit(onSubmit);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    budget.name === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <span>{budget.name}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};

export default BudgetPicker;
