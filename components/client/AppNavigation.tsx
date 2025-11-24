"use client";

import { SetStateAction, useState, Dispatch } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const components = [
  { title: "Dashboard", url: "/dashboard" },
  { title: "Files", url: "/files" },
  { title: "Upload", url: "/upload" },
];

function LogoutSection({ username }: { username: string }) {
  const router = useRouter();

  const handleClick = async () => {
    await fetch("http://localhost:8000/auth/logout", {
      credentials: "include",
    });
    router.refresh();
  };

  return (
    <div className="md:absolute md:top-4 md:right-4 flex items-center gap-2 md:gap-3 rounded-full border bg-card/70 px-3 py-1.5 shadow-sm backdrop-blur-sm">
      <span className="max-w-[120px] md:max-w-40 truncate text-xs md:text-sm text-muted-foreground">
        {username}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-3 text-xs md:text-sm md:cursor-pointer"
        onClick={handleClick}
      >
        Logout
      </Button>
    </div>
  );
}

function useActiveLinkStyle() {
  const currPath = usePathname();

  const getLinkStyle = (href: string): string => {
    if (href == "/") {
      return currPath == "/" ? "text-primary" : "";
    }

    const isActive = currPath == href || currPath.startsWith(href + "/");

    return isActive ? "text-primary" : "";
  };

  return { getLinkStyle };
}

function AppNavigationMenuPc() {
  const { getLinkStyle } = useActiveLinkStyle();

  return (
    <NavigationMenu className="mx-auto">
      <NavigationMenuList className="flex-wrap">
        {components.map((comp) => (
          <NavigationMenuItem key={comp.title}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href={comp.url} className={getLinkStyle(comp.url)}>
                {comp.title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function AppNavigationMenuMobile({
  setShowNaviMenu,
  username,
}: {
  setShowNaviMenu: Dispatch<SetStateAction<boolean>>;
  username: string;
}) {
  const { getLinkStyle } = useActiveLinkStyle();

  return (
    <div className="fixed inset-0 z-10 bg-card">
      <X
        className="absolute right-4 top-4 text-muted-50"
        onClick={() => setShowNaviMenu(false)}
      />

      <div className="flex h-full flex-col items-center justify-center gap-10">
        {components.map((cmp) => (
          <Link
            key={cmp.title}
            href={cmp.url}
            className={getLinkStyle(cmp.url)}
            onClick={() => setShowNaviMenu(false)}
          >
            {cmp.title}
          </Link>
        ))}
        {username && <LogoutSection username={username} />}
      </div>
    </div>
  );
}

export function AppNavigation({ username }: { username: string }) {
  const [showNaviMenu, setShowNaviMenu] = useState(false);

  return (
    <>
      {/* mobile */}
      <header className="flex flex-col md:hidden w-full items-center justify-between text-muted-foreground">
        <div className="flex w-full justify-between px-5 pt-5">
          <Menu onClick={() => setShowNaviMenu(!showNaviMenu)} />
          {username && <LogoutSection username={username} />}
        </div>

        {showNaviMenu && (
          <AppNavigationMenuMobile
            setShowNaviMenu={setShowNaviMenu}
            username={username}
          />
        )}
      </header>

      {/* desktop */}
      <header className="hidden md:flex w-full md:max-w-7xl mx-auto px-6 pt-5 items-center justify-between text-muted-foreground">
        <AppNavigationMenuPc />
        {username && <LogoutSection username={username} />}
      </header>
    </>
  );
}
