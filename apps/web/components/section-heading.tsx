import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  description,
  className,
  align = "left"
}: {
  kicker?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className
      )}
    >
      {kicker ? (
        <span className="font-mono text-xs font-semibold uppercase text-dusty-green">
          {kicker}
        </span>
      ) : null}
      <h2 className="text-3xl font-semibold leading-tight text-heading md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-7 text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
