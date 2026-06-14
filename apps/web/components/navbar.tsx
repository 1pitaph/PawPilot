"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "首页", href: "/" },
  { label: "功能", href: "/features" },
  { label: "场景", href: "/scenarios" },
  { label: "隐私", href: "/privacy" },
  { label: "FAQ", href: "/faq" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const home = pathname === "/";

  return (
    <header
      className={cn(
        "z-50 w-full",
        home ? "absolute inset-x-0 top-4" : "sticky top-0 border-b border-natural-black/10 bg-background/85 backdrop-blur"
      )}
    >
      <nav className="mx-auto max-w-container px-4 sm:px-6 lg:px-8" aria-label="主导航">
        <div className="flex min-h-16 items-center justify-between">
          <Logo className={home ? "text-natural-white" : "text-natural-black"} />
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-[8px] px-3 py-2 text-sm font-medium transition-colors",
                    home
                      ? "text-natural-white/76 hover:text-natural-white"
                      : "text-natural-black/70 hover:text-natural-black",
                    active && (home ? "bg-natural-white/10 text-natural-white" : "bg-natural-black/6 text-natural-black")
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="hidden md:block">
            <Button text="加入内测" href="#waitlist" variant={home ? "light" : "dark"} />
          </div>
          <button
            type="button"
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-[8px] border md:hidden",
              home ? "border-white/20 text-white" : "border-natural-black/15 text-natural-black"
            )}
            aria-label={open ? "关闭菜单" : "打开菜单"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 md:hidden",
            open ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="rounded-[8px] border border-natural-black/10 bg-natural-white p-2 shadow-card-lg">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-[8px] px-3 py-3 text-sm font-semibold text-natural-black hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Button className="mt-2 w-full" text="加入内测" href="#waitlist" variant="dark" />
          </div>
        </div>
      </nav>
    </header>
  );
}
