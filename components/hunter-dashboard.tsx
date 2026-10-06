"use client";
import Link from "next/link";
import { useEffect,useMemo,useState } from "react";
import type { Airdrop } from "@/data/airdrops";
export function HunterDashboard({airdrops}:{airdrops:Airdrop[]}){
 const [slugs,setSlugs]=useState<string[]>([]);
 function load(){try{const value=JSON.parse(localStorage.getItem("teckdrop:watchlist")||"[]");setSlugs(Array.isArray(value)?value.filter((x):x is string=>typeof x==="string"):[]);}catch{setSlugs([]);}}
 useEffect(()=>{load();window.addEventListener("teckdrop:watchlist",load);return()=>window.removeEventListener("teckdrop:watchlist",load)},[]);
 const tracked=useMemo(()=>airdrops.filter(x=>slugs.includes(x.slug)),[airdrops,slugs]);
 function progress(item:Airdrop){try{const raw=localStorage.getItem("teckdrop:progress:"+item.slug);const done=raw?JSON.parse(raw):[];return Array.isArray(done)&&item.tasks.length?Math.min(100,Math.round((done.length/item.tasks.length)*100)):0}catch{return 0}}
 return <div className="mt-8"><div className="grid gap-4 sm:grid-cols-3"><Stat label="Tracked" value={tracked.length}/><Stat label="Avg score" value={tracked.length?Math.round(tracked.reduce((s,x)=>s+x.opportunityScore,0)/tracked.length):0}/><Stat label="Completed guides" value={tracked.filter(x=>progress(x)===100).length}/></div><div className="mt-8"><h2 className="text-xl font-bold">My tracked opportunities</h2>{tracked.length?<div className="mt-4 space-y-3">{tracked.map(x=><article key={x.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><Link href={"/airdrop/"+x.slug} className="font-semibold hover:text-violet-300">{x.name}</Link><p className="mt-1 text-xs text-slate-500">{x.verificationStatus} · score {x.opportunityScore}</p></div><div className="min-w-44"><div className="mb-1 flex justify-between text-xs text-slate-500"><span>Task progress</span><span>{progress(x)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-400" style={{width:progress(x)+"%"}}/></div></div></div></article>)}</div>:<div className="mt-4 rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-500">You are not tracking any opportunities yet. Open the directory and choose Track.</div>}</div></div>;
}
function Stat({label,value}:{label:string;value:number}){return <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="text-3xl font-black">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></article>}
