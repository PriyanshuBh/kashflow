"use client";
import LoginForm from "./LoginForm";

import { useSearchParams } from "next/navigation";
// interface Props {
//   searchParams: {
//     callbackUrl?: string;
//   };
// }

export default  function LoginPage() {

   const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col p-5 shadow-lg w-full md:w-[30%] border rounded-md">
        <h1 className="mb-10 text-center bg-gradient-to-r from-sky-400 to-sky-800 bg-clip-text text-3xl font-bold text-transparent">
          Log In
        </h1>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
};


