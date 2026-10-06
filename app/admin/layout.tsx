import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { logoutAdmin } from "./actions";
export default async function AdminLayout({children}:{children:React.ReactNode}){
  const authenticated=await isAdminAuthenticated();
  if(!authenticated) return <>{children}</>;
  return <div className="min-h-screen bg-[#070a0f]"><header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><Link href="/admin" className="text-lg font-black">TeckDrop Admin</Link><nav className="flex items-center gap-4 text-sm text-slate-400"><Link href="/admin/airdrops">Airdrops</Link><Link href="/admin/categories">Categories</Link><Link href="/airdrops">Public site</Link><form action={logoutAdmin}><button className="text-rose-300">Logout</button></form></nav></div></header>{children}</div>;
}