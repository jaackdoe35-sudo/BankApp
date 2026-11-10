import type { AxiosAdapter, AxiosResponse } from 'axios'
type Account={id:string;accountNumber:string;type:'CHECKING'|'SAVINGS';currency:string;balance:string;status:'ACTIVE';createdAt:string}
const KEY='northstar.local-simulation.v1', PROFILE='northstar.profile.v1', now=()=>new Date().toISOString()
function readAccounts():Account[]{try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');if(Array.isArray(x.accounts)&&x.accounts.length)return x.accounts}catch{}const a=[{id:'acct-northstar-001',accountNumber:'•••• 4821',type:'CHECKING' as const,currency:'USD',balance:'1500000.00',status:'ACTIVE' as const,createdAt:now()}];writeAccounts(a);return a}
function writeAccounts(accounts:Account[]){localStorage.setItem(KEY,JSON.stringify({accounts}))}
function profile(){try{const p=JSON.parse(localStorage.getItem(PROFILE)||'null');if(p)return p}catch{}return {userId:'customer-northstar-001',email:localStorage.getItem('northstar.email')||'customer@example.com',role:'CUSTOMER',firstName:'Alex',lastName:'Morgan',dateOfBirth:null,phone:null,addressLine1:null,city:null,country:null,kycStatus:'VERIFIED'}}
function res(config:any,data:any,status=200):AxiosResponse{return {data,status,statusText:'OK',headers:{},config}}
function error(config:any,message:string,status=400){const e:any=new Error(message);e.config=config;e.response={data:{message},status,statusText:'Error',headers:{},config};return Promise.reject(e)}
export const localSimulationAdapter:AxiosAdapter=async config=>{
 const method=(config.method||'get').toLowerCase(),path=(config.url||'').split('?')[0],body=typeof config.data==='string'?JSON.parse(config.data||'{}'):(config.data||{})
 const ok=(data:any)=>Promise.resolve(res(config,data))
 if(path.endsWith('/auth/login')&&method==='post'){if(!body.email||!body.password)return error(config,'Enter your email and password',401);localStorage.setItem('northstar.email',body.email);return ok({accessToken:'local-access',refreshToken:'local-refresh',tokenType:'Bearer',expiresInSeconds:86400})}
 if(path.endsWith('/auth/register')&&method==='post'){localStorage.setItem('northstar.email',body.email);localStorage.setItem(PROFILE,JSON.stringify({...profile(),email:body.email,firstName:body.firstName,lastName:body.lastName}));return ok({accessToken:'local-access',refreshToken:'local-refresh',tokenType:'Bearer',expiresInSeconds:86400})}
 if(path.endsWith('/auth/refresh'))return ok({accessToken:'local-access',refreshToken:'local-refresh',tokenType:'Bearer',expiresInSeconds:86400})
 if(path.endsWith('/auth/logout'))return ok({})
 if(path.endsWith('/users/me')&&method==='get')return ok(profile())
 if(path.endsWith('/users/me/profile')&&method==='put'){const p={...profile(),...body};localStorage.setItem(PROFILE,JSON.stringify(p));return ok(p)}
 if(path==='/api/v1/accounts'&&method==='get')return ok(readAccounts())
 if(path==='/api/v1/accounts'&&method==='post'){const a=readAccounts(),item={id:'acct-'+Date.now(),accountNumber:'•••• '+String(Math.floor(1000+Math.random()*9000)),type:body.type||'CHECKING',currency:'USD',balance:'0.00',status:'ACTIVE',createdAt:now()} as Account;writeAccounts([...a,item]);return ok(item)}
 const match=path.match(/^\/api\/v1\/accounts\/([^/]+)(?:\/(transactions|withdraw))?$/)
 if(match){const a=readAccounts().find(x=>x.id===match[1]);if(!a)return error(config,'Account not found',404);if(match[2]==='transactions')return ok([]);if(match[2]==='withdraw')return error(config,'withdrawal rejected',400);return ok(a)}
 if(path.endsWith('/notifications/unread-count'))return ok({count:0})
 if(path.endsWith('/notifications'))return ok([])
 if(path.endsWith('/beneficiaries'))return ok([])
 if(path.endsWith('/transfers'))return error(config,'Transfers are unavailable in this local simulation')
 if(path.endsWith('/payments/top-up'))return error(config,'Top-ups are unavailable in this local simulation')
 if(path.includes('/cards')||path.includes('/loans')||path.includes('/admin'))return ok([])
 return error(config,'This feature is not enabled in the local simulation',404)
}
