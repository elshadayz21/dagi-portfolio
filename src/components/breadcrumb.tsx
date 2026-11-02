import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
      <Link
        href={items[0]?.href || "/"}
        className="hover:text-tekhaf-700 transition-colors flex items-center gap-1 font-medium"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-tekhaf-700 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-800 line-clamp-1">{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
