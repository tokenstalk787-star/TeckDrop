import type { ReactNode } from "react";
type AdminTask = { title:string; estimatedMinutes:number|null; required:boolean };\ntype AdminCategory = { category:{ name:string } };\ntype AdminItem = { id:string; name:string; slug:string; ecosystem:string|null; tier:string|null; status:string; verificationStatus:string; difficulty:string; riskLevel:string; opportunityScore:number; rewardPotential:number; effortScore:number; costScore:number; riskScore:number; longevityScore:number; verificationConfidence:number; verificationNotes:string|null; estimatedCostUsd:number|string|null; snapshotDate:Date|null; deadline:Date|null; shortDescription:string|null; description:string; websiteUrl:string|null; twitterUrl:string|null; discordUrl:string|null; tasks:AdminTask[]; categories:AdminCategory[] };\ntype Props={action:(formData:FormData)=>void|Promise<void>;submitLabel:string;item?:AdminItem};
export function AdminAirdropForm({action,submitLabel,item}:Props){
 const tasks=(item?.tasks||[]).map((t:AdminTask)=>[t.title,t.estimatedMinutes||5,t.required?"true":"false"].join(" | ")).join("\n");
 const categories=(item?.categories||[]).map((x:AdminCategory)=>x.category.name).join(", ");
 const date=(value:Date|null)=>value?new Date(value).toISOString().slice(0,10):"";
 return <form action={action} className="space-y-6">
 {item&&<input type="hidden" name="id" value={item.id}/>}
 <div className="grid gap-5 md:grid-cols-2">
  <Field label="Name"><input name="name" required defaultValue={item?.name||""}/></Field>
  <Field label="Slug"><input name="slug" required defaultValue={item?.slug||""}/></Field>
  <Field label="Ecosystem"><input name="ecosystem" placeholder="EVM, Solana..." defaultValue={item?.ecosystem||""}/></Field>
  <Field label="Tier"><input name="tier" placeholder="Tier 1" defaultValue={item?.tier||""}/></Field>
  <Select name="status" label="Status" value={item?.status||"ACTIVE"} options={["ACTIVE","UPCOMING","ENDED","WARNING","RUMOR"]}/>
  <Select name="verificationStatus" label="Verification" value={item?.verificationStatus||"UNVERIFIED"} options={["VERIFIED","UNVERIFIED","COMMUNITY_REPORTED","WARNING"]}/>
  <Select name="difficulty" label="Difficulty" value={item?.difficulty||"MEDIUM"} options={["EASY","MEDIUM","HARD"]}/>
  <Select name="riskLevel" label="Risk level" value={item?.riskLevel||"MEDIUM"} options={["LOW","MEDIUM","HIGH","CRITICAL"]}/>
  <Field label="Opportunity score (calculated)"><input name="opportunityScore" type="number" min="0" max="100" defaultValue={item?.opportunityScore??0} readOnly/></Field>\n  <Field label="Reward potential (0-100)"><input name="rewardPotential" type="number" min="0" max="100" defaultValue={item?.rewardPotential??50}/></Field>\n  <Field label="Effort efficiency (0-100)"><input name="effortScore" type="number" min="0" max="100" defaultValue={item?.effortScore??50}/></Field>\n  <Field label="Cost efficiency (0-100)"><input name="costScore" type="number" min="0" max="100" defaultValue={item?.costScore??50}/></Field>\n  <Field label="Risk safety (0-100)"><input name="riskScore" type="number" min="0" max="100" defaultValue={item?.riskScore??50}/></Field>\n  <Field label="Longevity (0-100)"><input name="longevityScore" type="number" min="0" max="100" defaultValue={item?.longevityScore??50}/></Field>\n  <Field label="Verification confidence (0-100)"><input name="verificationConfidence" type="number" min="0" max="100" defaultValue={item?.verificationConfidence??0}/></Field>
  <Field label="Estimated cost USD"><input name="estimatedCostUsd" type="number" min="0" step="0.01" defaultValue={item?.estimatedCostUsd??""}/></Field>
  <Field label="Snapshot date"><input name="snapshotDate" type="date" defaultValue={date(item?.snapshotDate)}/></Field>
  <Field label="Deadline"><input name="deadline" type="date" defaultValue={date(item?.deadline)}/></Field>
 </div>
 <Field label="Short description"><input name="shortDescription" defaultValue={item?.shortDescription||""}/></Field>
 <Field label="Description"><textarea name="description" required rows={6} defaultValue={item?.description||""}/></Field>\n <Field label="Verification notes"><textarea name="verificationNotes" rows={4} defaultValue={item?.verificationNotes||""} placeholder="Evidence and reasoning behind the verification status."/></Field>
 <div className="grid gap-5 md:grid-cols-3"><Field label="Official website"><input name="websiteUrl" type="url" defaultValue={item?.websiteUrl||""}/></Field><Field label="X / Twitter"><input name="twitterUrl" type="url" defaultValue={item?.twitterUrl||""}/></Field><Field label="Discord"><input name="discordUrl" type="url" defaultValue={item?.discordUrl||""}/></Field></div>
 <Field label="Categories (comma separated)"><input name="categories" placeholder="EVM, DeFi, Infrastructure" defaultValue={categories}/></Field>
 <Field label="Tasks"><textarea name="tasks" rows={8} defaultValue={tasks} placeholder={"Bridge funds | 10 | true\nUse the protocol | 15 | true\nJoin official community | 5 | false"}/><p className="mt-2 text-xs text-slate-600">One task per line: title | minutes | true/false</p></Field>
 <button className="rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white hover:bg-violet-400">{submitLabel}</button>
 </form>;
}
function Field({label,children}:{label:string;children:ReactNode}){return <label className="block text-sm text-slate-300">{label}{children}</label>}
function Select({name,label,value,options}:{name:string;label:string;value:string;options:string[]}){return <Field label={label}><select name={name} defaultValue={value}>{options.map(x=><option key={x}>{x}</option>)}</select></Field>}
