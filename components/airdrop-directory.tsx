"use client";
import {useMemo,useState} from "react";
import {Search,SlidersHorizontal} from "lucide-react";
import type {Airdrop} from "@/data/airdrops";
import {AirdropCard} from "@/components/airdrop-card";

export function AirdropDirectory({airdrops}:{airdrops:Airdrop[]}){
 const [search,setSearch]=useState(""); const [ecosystem,setEcosystem]=useState("ALL"); const [tier,setTier]=useState("ALL"); const [verification,setVerification]=useState("ALL");
 const ecosystems=[...new Set(airdrops.map(x=>x.ecosystem))], tiers=[...new Set(airdrops.map(x=>x.tier))];
 const filtered=useMemo(()=>airdrops.filter(x=>{
  const q=search.trim().toLowerCase();
  return (!q||[x.name,x.ecosystem,x.description].some(v=>v.toLowerCase().includes(q)))&&(ecosystem==="ALL"||x.ecosystem===ecosystem)&&(tier==="ALL"||x.tier===tier)&&(verification==="ALL"||x.verificationStatus===verification);
 }),[airdrops,search,ecosystem,tier,verification]);
 return <div>
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
   <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search airdrops, ecosystems..." className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/50"/></div>
   <div className="mt-3 flex flex-wrap items-center gap-2"><SlidersHorizontal className="mr-1 h-4 w-4 text-slate-500"/>
    <FilterSelect value={ecosystem} onChange={setEcosystem} options={["ALL",...ecosystems]}/><FilterSelect value={tier} onChange={setTier} options={["ALL",...tiers]}/><FilterSelect value={verification} onChange={setVerification} options={["ALL","VERIFIED","UNVERIFIED","WARNING"]}/>
    <span className="ml-auto text-xs text-slate-500">{filtered.length} opportunities</span>
   </div>
  </div>
  <div className="mt-5 grid gap-4 lg:grid-cols-2">{filtered.map(x=><AirdropCard key={x.slug} airdrop={x}/>)}</div>
  {!filtered.length&&<div className="mt-5 rounded-2xl border border-dashed border-white/10 p-12 text-center text-slate-500">No opportunities match your filters.</div>}
 </div>;
}
function FilterSelect({value,onChange,options}:{value:string;onChange:(v:string)=>void;options:string[]}){
 return <select value={value} onChange={e=>onChange(e.target.value)} className="rounded-lg border border-white/10 bg-[#0b1017] px-3 py-2 text-xs text-slate-300 outline-none focus:border-violet-400/50">{options.map(o=><option key={o} value={o}>{o==="ALL"?"All":o.replaceAll("_"," ")}</option>)}</select>;
}