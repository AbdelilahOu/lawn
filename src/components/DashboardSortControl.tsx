import { useRef } from "react";
import { ArrowDownAZ, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardSort } from "@/lib/dashboardSort";

const options: { value: DashboardSort; label: string; Icon: typeof Clock3 }[] = [
  { value: "last-uploaded", label: "Last uploaded", Icon: Clock3 },
  { value: "alphabetical", label: "Alphabetical", Icon: ArrowDownAZ },
];

/** Binary toggle pill for the two dashboard sort orders. Only two options
 * exist, so this avoids opening a popup just to pick the other one. */
export function DashboardSortControl({
  value,
  onChange,
}: {
  value: DashboardSort;
  onChange: (value: DashboardSort) => void;
}) {
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (next: DashboardSort, focus = false) => {
    onChange(next);
    if (focus) {
      const index = options.findIndex((option) => option.value === next);
      optionRefs.current[index]?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const currentIndex = options.findIndex((option) => option.value === value);
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % options.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = options.length - 1;
    }
    if (nextIndex === undefined) return;
    event.preventDefault();
    select(options[nextIndex].value, true);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Sort projects and videos"
      onKeyDown={handleKeyDown}
      className="flex flex-shrink-0 items-center border-2 border-[#1a1a1a] bg-[#f0f0e8] p-0.5 shadow-[4px_4px_0px_0px_var(--shadow-color)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--accent)]"
    >
      {options.map((option, index) => {
        const selected = value === option.value;
        const { Icon } = option;
        return (
          <button
            key={option.value}
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`Sort by ${option.label}`}
            title={`Sort by ${option.label}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => select(option.value)}
            className={cn(
              "flex h-8 items-center gap-1.5 px-2.5 text-xs font-bold tracking-wider uppercase transition-colors focus-visible:outline-none sm:px-3",
              selected
                ? "bg-[#1a1a1a] text-[#f0f0e8]"
                : "text-[#888] hover:bg-[#e8e8e0] hover:text-[#1a1a1a]",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
