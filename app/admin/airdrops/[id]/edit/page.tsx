import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateAirdrop } from "../../../actions";
import { AdminAirdropForm } from "@/components/admin-airdrop-form";
export default async function EditAirdropPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const item=await prisma.airdrop.findUnique({where:{id},include:{tasks:{orderBy:{order:"asc"}},categories:{include:{category:true}}}});if(!item)notFound();return <main className="mx-auto max-w-5xl px-6 py-10"><Link href="/admin/airdrops" className="text-sm text-slate-500">← Back to airdrops</Link><h1 className="mt-4 text-4xl font-black">Edit airdrop</h1><p className="mt-2 text-slate-500">{item.name}</p><div className="mt-8"><AdminAirdropForm action={updateAirdrop} submitLabel="Save changes" item={item}/></div></main>}