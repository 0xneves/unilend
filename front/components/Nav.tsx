import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";

const Nav = () => {
  return (
    <div className="h-[10vh] flex justify-between items-center px-2 max-w-[1400px] mx-auto">
      <div className="w-[300px]"></div>
      <NavigationMenu className="w-[300px]">
        <NavigationMenuList>
          <NavigationMenuItem className="pr-8">
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className="text-lg font-semibold">
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="pr-8">
            <Link href="/my-lends" legacyBehavior passHref>
              <NavigationMenuLink className="text-lg font-semibold">
                My Lends
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/my-borrows" legacyBehavior passHref>
              <NavigationMenuLink className="text-lg font-semibold">
                My Borrows
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="w-[300px] flex justify-end">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Nav;
