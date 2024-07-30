import { auth } from "@/lib/auth";
import DesktopNavbar from "./DesktopNavbar";

import MobileNavbar from "./MobileNavbar";

import { User } from "@prisma/client";

const Navbar = async () => {
  const session = await auth();
  const user = session?.user as User;

  return (
    <div className="w-full py-4 border-separate border-b">
      <DesktopNavbar />
      <MobileNavbar user={user} />
    </div>
  );
};

export default Navbar;
