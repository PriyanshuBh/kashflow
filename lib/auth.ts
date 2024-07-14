import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        const userDB = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
          include: {
            budgets: {
              include: {
                transactions: true,
              },
            },
            settings: true,
          },
        });
        if (userDB) {
          session.user = userDB;
        }
      }
      // console.log("auth", session);
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
