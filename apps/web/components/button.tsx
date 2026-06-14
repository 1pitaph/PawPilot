import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "dark" | "light" | "ghost";

const variantClass: Record<ButtonVariant, string> = {
  primary: "border-primary bg-primary text-natural-black hover:bg-[#ffd866]",
  dark: "border-natural-black bg-natural-black text-natural-white hover:bg-[#2a291f]",
  light: "border-natural-white/30 bg-natural-white text-natural-black hover:bg-natural-white/90",
  ghost: "border-natural-black/15 bg-transparent text-natural-black hover:bg-natural-black/5"
};

export function Button({
  text = "加入内测",
  href = "#waitlist",
  variant = "primary",
  showArrow = true,
  className
}: {
  text?: string;
  href?: string;
  variant?: ButtonVariant;
  showAvatar?: boolean;
  showArrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-[8px] border px-4 py-2 text-sm font-semibold transition-colors",
        variantClass[variant],
        className
      )}
    >
      <span>{text}</span>
      {showArrow ? (
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      ) : null}
    </Link>
  );
}
