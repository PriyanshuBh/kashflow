"use server";
import { LoginSchema, RegisterSchema } from "@/lib/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { signIn, signOut } from "@/lib/auth";

export const logout = async () => {
  await signOut();
};

export const loginCredentials = async (data: z.infer<typeof LoginSchema>) => {
  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    console.log("loginUser - credentials", result);
    revalidatePath("/");
    return {
      success: true,
      message: "Successfully Logged In",
    };
  } catch (error) {
    console.log("loginCredentials Error -server", error);
    return {
      success: false,
      error: "Invalid Credentials",
    };
  }
};

export const registerUser = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedData = RegisterSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        error: "Invalid data",
      };
    }

    const { name, email, password } = validatedData.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userExist) {
      return {
        success: false,
        error: "User already exist!",
      };
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    const { passwordHash, ...userNoPassword } = newUser;
    if (newUser) {
      return {
        success: true,
        data: userNoPassword,
        message: "User registered successfully, please Login",
      };
    }

    return {
      success: false,
      error: "Unable to register user, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, registering user",
    };
  }
};
