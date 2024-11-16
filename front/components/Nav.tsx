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
      <div className="w-[250px]">
      </div>
      <NavigationMenu className="w-[250px]">
        <NavigationMenuList>
          <NavigationMenuItem className="pr-8">
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink>Home</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="pr-8">
            <Link href="/my-lends" legacyBehavior passHref>
              <NavigationMenuLink>My Lends</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/my-borrows" legacyBehavior passHref>
              <NavigationMenuLink>My Borrows</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="w-[250px] flex justify-end">
        <ConnectButton/>
      </div>
    </div>
  );
};

export default Nav;
