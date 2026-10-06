import Link from "next/link";
import { createAirdrop } from "../../actions";
import { AdminAirdropForm } from "@/components/admin-airdrop-form";
export default function NewAirdropPage(){return <main className="mx-auto max-w-5xl px-6 py-10"><Link href="/admin/airdrops" className="text-sm text-slate-500">← Back to airdrops</Link><h1 className="mt-4 text-4xl font-black">Create airdrop</h1><p className="mt-2 text-slate-500">Add evidence-backed opportunity data to the database.</p><div className="mt-8"><AdminAirdropForm action={createAirdrop} submitLabel="Create airdrop"/></div></main>}