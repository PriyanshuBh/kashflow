import { PiggyBank } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <PiggyBank className="stroke h-11 w-11 stroke-sky-600 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-3xl font-bold text-transparent">
        KashFlow
      </p>
    </Link>
  );
};

export default Logo;
