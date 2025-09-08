"use client";

import { Activity, Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { SiteContainer } from "./site-container";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Activity,
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SiteContainer>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <Activity className="h-6 w-6" />
                <span className="text-xl font-bold">Log Watcher</span>
              </Link>

              {/*Desktop Navigation*/}
              <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={pathname === item.href ? "default" : "ghost"}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              {/*Mobile Navigation*/}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col gap-2 mt-6">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.name} href={item.href}>
                          <Button
                            variant={
                              pathname === item.href ? "default" : "ghost"
                            }
                            className="w-full justify-start gap-2"
                          >
                            <Icon className="h-4 w-4" />
                            {item.name}
                          </Button>
                        </Link>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </SiteContainer>
    </header>
  );
}
