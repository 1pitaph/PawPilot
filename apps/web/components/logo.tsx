import Link from "next/link";
import { PawPrint } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <span className="inline-flex size-9 items-center justify-center rounded-[8px] bg-primary text-natural-black">
        <PawPrint className="size-5" aria-hidden />
      </span>
      <span className="text-lg font-semibold">爪边</span>
    </Link>
  );
}
