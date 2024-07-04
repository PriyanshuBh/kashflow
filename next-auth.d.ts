import { UserExt } from "./types";
import { type DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & UserExt;
  }
}
