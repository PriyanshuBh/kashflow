"use client";
import { NewCategorySchema } from "@/lib/schema";
import { TransactionType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { CircleOff, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverTrigger } from "./ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { createCategory } from "@/actions/categoryActions";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useBudgetStore } from "@/stores/budgetStore";

interface Props {
  type: TransactionType;
  trigger?: React.ReactNode;
}

const NewCategoryDialog = ({ type, trigger }: Props) => {
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const [emojiOpen, emojiSetOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { setCategories } = useBudgetStore((state) => state);
  const form = useForm<z.infer<typeof NewCategorySchema>>({
    resolver: zodResolver(NewCategorySchema),
    defaultValues: {
      name: "",
      icon: "",
      type,
    },
  });
console.log("isPending", isPending);
  const onSubmit = (formData: z.infer<typeof NewCategorySchema>) => {
    console.log("NewCategoryDialog", formData);
    startTransition(() => {
      createCategory(formData)
        .then((res) => {
          if (res.success) {
            setOpen(false);
            setCategories();
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch(() => {
          return toast.error("Internal server error, creating Category");
        });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="ghost"
            className="flex border-separate items-center justify-started rounded-none border-b px-3 py-3 text-muted-foreground"
          >
            <PlusSquare className="mr-2 h-4 w-4" />
            Create New
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create{" "}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>
            Category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your Transactions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4 flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* category name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* category icon */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover open={emojiOpen} onOpenChange={emojiSetOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-[100px] w-full">
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl text-muted-foreground">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-[48px] w-[48px]" />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          theme={theme.resolvedTheme}
                          onEmojiSelect={(emoji: any) => {
                            field.onChange(emoji.native);
                            emojiSetOpen(!emojiOpen);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
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
                  console.log("handle submit button");
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

export default NewCategoryDialog;
