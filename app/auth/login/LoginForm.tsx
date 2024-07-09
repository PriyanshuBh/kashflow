"use client";
import { LoginSchema } from "@/lib/schema";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginCredentials } from "@/actions/authActions";

interface Props {
  callbackUrl?: string;
}

const LoginForm = ({ callbackUrl }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });
console.log(isPending)
  const onSubmit = (formData: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      loginCredentials(formData)
        .then((res) => {
          if (res.success) {
            router.push(callbackUrl ? callbackUrl : "/");
            router.refresh();
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch((err) => {
          console.log("LoginForm", err);
          return toast.error("Invalid Credentials");
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        noValidate
      >
        {/* email */}
        <FormField
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

        {/* submit button */}
        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          Log In
        </Button>
      </form>

      <div className="flex flex-col items-center pb-5">
        <Link
          href="/auth/register"
          className="text-xs self-end cursor-pointer hover:text-primary mt-4"
        >
          forgot password?
        </Link>

        {/* <div className="flex items-center gap-x-5 my-3">
          <div className="flex bg-slate-200 w-20 h-[0.5px]" />
          or
          <div className="flex bg-slate-200 w-20 h-[0.5px]" />
        </div> */}

        {/* google login */}
        {/* <Button
          type="button"
          className="w-full mb-3"
          variant="secondary"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <div className="relative mr-2">
            <Image
              alt="logo"
              src="/images/google-icon.svg"
              className="top-0 left-0 relative"
              width={20}
              height={20}
            />
          </div>
          Google
        </Button> */}

        <Link href="/auth/register" className="text-sm hover:text-primary mt-5">
          {"Don't have an Account? Create New"}
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
