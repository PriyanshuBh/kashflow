"use client";
import { UserExt } from "@/types";
import { cn } from "@/lib/utils";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { NewBudgetSchema } from "@/lib/schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
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
// import { useBudgetStore } from "@/stores/budgetStore";

interface Props {
  budget: Budget;
  budgets: Budget[];
  user: UserExt;
  onBudgetChange: (budget: Budget) => void;
  showNew?: boolean;
}

const BudgetPickerNew = ({
  user,
  budget,
  budgets,
  onBudgetChange,
  showNew = true,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Budget>(budget);

  useEffect(() => {
    if (budget) {
      setValue(budget);
    }
  }, [budget]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value && value.id
            ? budgets.find((item) => item.id === value.id)?.name
            : "Select budget..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Command>
          <CommandInput placeholder="Search budgets..." />
          {/***************** * NEW BUDGET DIALOG************* */}
          {showNew && <NewBudgetDialog user={user} />}
          <CommandList>
            <CommandEmpty>No budgets found.</CommandEmpty>
            <CommandGroup>
              {budgets.map((budget) => {
                return (
                  <CommandItem
                    value={budget.name}
                    key={budget.name}
                    onSelect={(value) => {
                      const selectedBudget = budgets.find(
                        (budget) => budget.name === value
                      );
                      setValue(selectedBudget ?? ({} as Budget));
                      onBudgetChange(selectedBudget ?? ({} as Budget));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value && value.name === budget.name
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
  );
};

export default BudgetPickerNew;
