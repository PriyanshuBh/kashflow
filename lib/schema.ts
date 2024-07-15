import { z } from "zod";
import { currencies } from "./currencies";
import { differenceInDays } from "date-fns";
import { MAX_DATE_RANGE_DAYS } from "./constants";

export const HistoryDataSchema = z.object({
  timeFrame: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number(),
});

export const OverviewSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(from, to);
    const isValidRange = days >= 0 || days <= MAX_DATE_RANGE_DAYS;
    return isValidRange;
  });

export const NewBudgetSchema = z.object({
  name: z.string().min(1, "budget name is required"),
  currency: z.string().min(1, "currency is required"),
  // currency: z.custom(
  //   (value) => currencies.find((currency) => currency.value === value),
  //   { message: "Invalid Currency" }
  // ),
});

export const NewCategorySchema = z.object({
  name: z.string().min(1, "name is required"),
  icon: z.string().min(1, "icon is required"),
  type: z.enum(["income", "expense"]),
});

export const NewTransactionSchema = z.object({
  amount: z.coerce
    .number({ message: "please enter a number" })
    .positive({ message: "please enter a positive number" })
    .multipleOf(1.0),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string().min(1, "category is required"),
  budget: z.string().min(1, "budget is required"),
  type: z.union([z.literal("income"), z.literal("expense")]),
});

export const CurrencySchema = z.object({
  currency: z.custom(
    (value) => currencies.find((currency) => currency.value === value),
    { message: "Invalid Currency" }
  ),
});

export const BudgetSchema = z.object({
  name: z.string().min(1, "budget name is required"),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "email address is required")
    .email("please provide valid e-mail address"),
  password: z
    .string()
    .min(1, "password is required")
    .refine((pw) => pw.length > 6, {
      message: "at least 6 characters required",
    }),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, "name is required"),
    email: z
      .string()
      .min(1, "email address is required")
      .email("please provide valid e-mail address"),
    password: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });
