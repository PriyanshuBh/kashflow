"use client";
import { TransactionType, UserExt } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NewTransactionSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {  useState, useTransition } from "react";
import {  Category } from "@prisma/client";
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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import NewCategoryDialog from "./NewCategoryDialog";
import _ from "lodash";
import NewBudgetDialog from "./NewBudgetDialog";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { createTransaction } from "@/actions/transactionActions";
import { toast } from "sonner";
import { useBudgetStore } from "@/stores/budgetStore";
// import { useRouter } from "next/navigation";

interface Props {
  trigger: React.ReactNode;
  type: TransactionType;
  categories: Category[];
  user: UserExt;
}

const NewTransactionDialog = ({ trigger, type, categories, user }: Props) => {
  // const router = useRouter();
  const {
    budget,
    setBudget,
    setBudgetSummary,
    setCategorySummary,
    setHistoryYears,
    period,
    timeFrame,
    userBudgets,
    setYearHistoryData,
    setMonthHistoryData,
  } = useBudgetStore((store) => store);
  const budgets = userBudgets;
  const [openTransaction, setOpenTransaction] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openBudget, setOpenBudget] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewTransactionSchema>>({
    resolver: zodResolver(NewTransactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
      date: new Date(),
      category: "",
      budget: budget.name ? budget.name : "",
      type,
    },
  });

  form.setValue("budget", budget.name);

  const CategoryRow = ({ category }: { category: Category }) => {
    return (
      <div className="flex items-center gap-2">
        <span>{category.icon}</span>
        <span>{category.name}</span>
      </div>
    );
  };

  const onSubmit = (formData: z.infer<typeof NewTransactionSchema>) => {
    toast.loading("Creating Transaction...", { id: "create-transaction" });
    setOpenTransaction(false);
    startTransition(() => {
      createTransaction({
        formData,
        budgetId: budgets.find((budget) => budget.name === formData.budget)?.id,
        categoryId: categories.find(
          (category) => category.name === formData.category
        )?.id,
      })
        .then((res) => {
          if (res.success) {
            console.log("transaction crated successfully");
            setBudgetSummary({ budgetId: budget.id });
            setCategorySummary({ budgetId: budget.id });
            setHistoryYears({ budgetId: budget.id });
            if (timeFrame === "month")
              setMonthHistoryData({
                budgetId: budget.id,
                year: period.year,
                month: period.month,
              });
            if (timeFrame === "year")
              setYearHistoryData({
                budgetId: budget.id,
                year: period.year,
              });
            return toast.success(res.message, { id: "create-transaction" });
          } else {
            return toast.error(res.error, { id: "create-transaction" });
          }
        })
        .catch((err) => {
          console.log("create transaction error :", err);
          return toast.error("Internal Server Error, creating Transaction", {
            id: "create-transaction",
          });
        });
    });
  };

  return (
    <Dialog open={openTransaction} onOpenChange={setOpenTransaction}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent aria-describedby="new transaction dialog">
        <DialogHeader className="my-5">
          <DialogTitle>
            Create a New{" "}
            <span
              className={cn(
                "m-1 capitalize",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>
            Transaction
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full flex justify-between items-center gap-x-4">
              {/* budget */}
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => {
                  const selectedBudget =
                    !_.isEmpty(budgets) &&
                    budgets.find((budget) => budget.name === field.value);

                  return (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Budget</FormLabel>
                      <Popover open={openBudget} onOpenChange={setOpenBudget}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.name && "text-muted-foreground"
                              )}
                            >
                              {budget ? (
                                budget.name
                              ) : selectedBudget ? (
                                <span>{selectedBudget.name}</span>
                              ) : (
                                "Select Budget"
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
                                        setOpenBudget(false);
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

              {/* category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => {
                  const selectedCategory = categories.find(
                    (category) => category.name === field.value
                  );
                  return (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>
                        <span
                          className={cn("capitalize mr-1", {
                            "text-emerald-500": type === "income",
                            "text-red-500": type === "expense",
                          })}
                        >
                          {type}
                        </span>
                        Category
                      </FormLabel>
                      <Popover
                        open={openCategory}
                        onOpenChange={setOpenCategory}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between w-full",
                                !field.name && "text-muted-foreground"
                              )}
                            >
                              {selectedCategory ? (
                                <CategoryRow category={selectedCategory} />
                              ) : (
                                "Select Category"
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full">
                          <Command>
                            <CommandInput placeholder="Search categories..." />
                            {/***************** * NEW CATEGORY DIALOG************* */}
                            <NewCategoryDialog type={type} />
                            <CommandList>
                              <CommandEmpty>No categories found.</CommandEmpty>
                              <CommandGroup>
                                {categories.map((category) => {
                                  return (
                                    <CommandItem
                                      value={category.name}
                                      key={category.name}
                                      onSelect={(value) => {
                                        field.onChange(value);
                                        setOpenCategory(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          category.name === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <CategoryRow category={category} />
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
            </div>

            {/* date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Date</FormLabel>
                      <Popover open={openDate} onOpenChange={setOpenDate}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(value) => {
                              field.onChange(value);
                              setOpenDate(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            />

            {/* amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="flex gap-2 items-center">
              <Button
                type="button"
                variant="outline"
                // disabled={!form.formState.isValid}
                onClick={() => {
                  setOpenTransaction(false);
                  // form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? (
                  <div className="flex gap-1">
                    <Loader2 className="animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  <span>Create</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTransactionDialog;
