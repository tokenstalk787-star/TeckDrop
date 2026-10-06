"use client";
import { useState } from "react";
export function WatchlistToggle({slug}:{slug:string}){
 const [tracked,setTracked]=useState(()=>typeof window!=="undefined"&&JSON.parse(localStorage.getItem("teckdrop:watchlist")||"[]").includes(slug));
 function toggle(){const current=JSON.parse(localStorage.getItem("teckdrop:watchlist")||"[]") as unknown[];const next=tracked?current.filter(x=>x!==slug):[...current,slug];localStorage.setItem("teckdrop:watchlist",JSON.stringify(next));setTracked(!tracked);window.dispatchEvent(new Event("teckdrop:watchlist"));}
 return <button type="button" onClick={toggle} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5">{tracked?"Tracked":"Track"}</button>;
}
