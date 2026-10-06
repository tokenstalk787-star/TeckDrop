import Link from "next/link";
import { CalendarDays, Gauge, LayoutDashboard, ListChecks, Zap } from "lucide-react";

const links = [
  { href: "/airdrops", label: "Airdrops", icon: ListChecks },
  { href: "/daily", label: "Daily", icon: Zap },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },\n  { href: "/intelligence", label: "Intelligence", icon: Gauge },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07090d]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500 text-white">
            <Zap className="h-4 w-4" />
          </span>
          TeckDrop
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
        </nav>
        <Link href="/airdrops" className="rounded-lg bg-violet-500 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-violet-400">
          Explore
        </Link>
      </div>
    </header>
  );
}