"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearAdminSession, isAdminAuthenticated, setAdminSession } from "@/lib/admin-auth";

async function requireAdmin(){if(!(await isAdminAuthenticated())) redirect("/admin/login");}

function text(form:FormData,key:string){return String(form.get(key)||"").trim();}
function number(form:FormData,key:string, fallback=0){const n=Number(form.get(key));return Number.isFinite(n)?n:fallback;}

export async function loginAdmin(form:FormData){
  const password=text(form,"password");
  if(!process.env.ADMIN_PASSWORD || password!==process.env.ADMIN_PASSWORD) redirect("/admin/login?error=1");
  await setAdminSession(); redirect("/admin");
}
export async function logoutAdmin(){await clearAdminSession();redirect("/admin/login");}

function taskRows(raw:string){
  return raw.split("\n").map(x=>x.trim()).filter(Boolean).map((line,index)=>{
    const [title,minutes,required]=line.split("|").map(x=>x.trim());
    return {title,description:null,order:index+1,required:required!=="false",difficulty:"MEDIUM" as const,estimatedMinutes:Number(minutes)||5};
  });
}
async function syncCategories(airdropId:string, raw:string){
  const names=[...new Set(raw.split(",").map(x=>x.trim()).filter(Boolean))];
  await prisma.airdropCategory.deleteMany({where:{airdropId}});
  for(const name of names){
    const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    if(!slug) continue;
    const category=await prisma.category.upsert({where:{slug},update:{name},create:{name,slug}});
    await prisma.airdropCategory.create({data:{airdropId,categoryId:category.id}});
  }
}
function airdropData(form:FormData){
  return {
    name:text(form,"name"),slug:text(form,"slug"),description:text(form,"description"),
    shortDescription:text(form,"shortDescription")||null,websiteUrl:text(form,"websiteUrl")||null,
    twitterUrl:text(form,"twitterUrl")||null,discordUrl:text(form,"discordUrl")||null,
    ecosystem:text(form,"ecosystem")||null,tier:text(form,"tier")||null,
    status:text(form,"status") as "ACTIVE"|"UPCOMING"|"ENDED"|"WARNING"|"RUMOR",
    verificationStatus:text(form,"verificationStatus") as "VERIFIED"|"UNVERIFIED"|"COMMUNITY_REPORTED"|"WARNING",
    opportunityScore:Math.min(100,Math.max(0,number(form,"opportunityScore"))),
    difficulty:text(form,"difficulty") as "EASY"|"MEDIUM"|"HARD",
    riskLevel:text(form,"riskLevel") as "LOW"|"MEDIUM"|"HIGH"|"CRITICAL",
    estimatedCostUsd:text(form,"estimatedCostUsd")?number(form,"estimatedCostUsd"):null,
    snapshotDate:text(form,"snapshotDate")?new Date(text(form,"snapshotDate")):null,
    deadline:text(form,"deadline")?new Date(text(form,"deadline")):null,
    lastVerifiedAt:text(form,"lastVerifiedAt")?new Date(text(form,"lastVerifiedAt")):null
  };
}
export async function createAirdrop(form:FormData){
  await requireAdmin();
  const data=airdropData(form);
  const item=await prisma.airdrop.create({data:{...data,tasks:{create:taskRows(text(form,"tasks"))}}});
  await syncCategories(item.id,text(form,"categories"));
  revalidatePath("/airdrops");revalidatePath("/dashboard");revalidatePath("/daily");revalidatePath("/calendar");redirect("/admin/airdrops");
}
export async function updateAirdrop(form:FormData){
  await requireAdmin();
  const id=text(form,"id");const data=airdropData(form);
  await prisma.airdrop.update({where:{id},data});
  await prisma.airdropTask.deleteMany({where:{airdropId:id}});
  await prisma.airdropTask.createMany({data:taskRows(text(form,"tasks")).map(task=>({...task,airdropId:id}))});
  await syncCategories(id,text(form,"categories"));
  revalidatePath("/airdrops");revalidatePath("/dashboard");revalidatePath("/daily");revalidatePath("/calendar");revalidatePath("/airdrop/[slug]","page");redirect("/admin/airdrops");
}
export async function deleteAirdrop(form:FormData){
  await requireAdmin();const id=text(form,"id");await prisma.airdrop.delete({where:{id}});
  revalidatePath("/airdrops");revalidatePath("/dashboard");redirect("/admin/airdrops");
}
