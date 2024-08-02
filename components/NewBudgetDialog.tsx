"use client";
import { UserExt } from "@/types";
import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,

  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NewBudgetSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { createBudget } from "@/actions/budgetActions";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { currencies, Currency } from "@/lib/currencies";
import { useBudgetStore } from "@/stores/budgetStore";

interface Props {
  user: UserExt;
}

const NewBudgetDialog = ({ user }: Props) => {
  const { setUserBudgets } = useBudgetStore((state) => state);
  const [openCurrency, setOpenCurrency] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof NewBudgetSchema>>({
    resolver: zodResolver(NewBudgetSchema),
    defaultValues: {
      name: "",
      currency: "",
    },
    mode: "all",
  });
  console.log("isPending", isPending);
  const onSubmit = (formData: z.infer<typeof NewBudgetSchema>) => {
    console.log("NewBudgetDialog", formData);
    startTransition(() => {
      createBudget({
        budgetName: formData.name,
        userId: user.id,
        currency: formData.currency,
      })
        .then((res) => {
          if (res.success) {
            setOpen(false);
            setUserBudgets({ userId: user.id });
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch(() => {
          return toast.error("Internal Server error,creating budget");
        });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex border-separate items-center justify-started rounded-none border-b px-3 py-3 text-muted-foreground"
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Budget</DialogTitle>
          <DialogDescription>
            Budgets are used to group your Transactions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4 flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* budget name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* currency picker */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="justify-start w-full"
                        >
                          {field.value
                            ? currencies.find(
                                (currency) => currency.value === field.value
                              )?.label
                            : "Select currency"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Filter currencies..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup>
                            {currencies.map((currency: Currency) => (
                              <CommandItem
                                key={currency.value}
                                value={currency.label}
                                onSelect={(value) => {
                                  // console.log("New budget dialog", value);
                                  form.setValue("currency", currency.value);
                                  field.onChange(currency.value);
                                  setOpenCurrency(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    currency.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {currency.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2 self-end pt-6">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                onClick={() => {
                  form.handleSubmit(onSubmit);
                }}
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewBudgetDialog;
