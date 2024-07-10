"use client";
import { RegisterSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useState, useTransition } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/actions/authActions";

const RegisterForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      registerUser(values)
        .then((res) => {
          if (res.success) {
            router.push("/auth/login");
            router.refresh();
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch((err) => {
          return toast.error(err.message);
        })
        .finally(() => {
          form.reset();
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        {/* name */}
        <FormField
          disabled={isPending}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} className="dark:bg-slate-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* email */}
        <FormField
          disabled={isPending}
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="your.email@example.com"
                  type="email"
                  className="dark:bg-slate-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* password */}
        <FormField
          disabled={isPending}
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="flex relative">
                  <Input
                    {...field}
                    type={showPass ? "text" : "password"}
                    className="dark:bg-slate-600"
                  />
                  <span
                    className="absolute top-3 right-2 cursor-pointer"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <FaEye className="h-5 w-5" />
                    ) : (
                      <FaEyeSlash className="h-5 w-5" />
                    )}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*confirm password */}
        <FormField
          disabled={isPending}
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="flex relative">
                  <Input
                    {...field}
                    type={showPass ? "text" : "password"}
                    className="dark:bg-slate-600"
                  />
                  <span
                    className="absolute top-3 right-2 cursor-pointer"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <FaEye className="h-5 w-5" />
                    ) : (
                      <FaEyeSlash className="h-5 w-5" />
                    )}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 items-center py-5">
          <Button
            type="submit"
            disabled={isPending || !form.formState.isValid}
            className="w-full"
          >
            Register
          </Button>

          <Link href="/auth/login" className="text-xs hover:text-primary">
            {"Already have an Account? Log In"}
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
