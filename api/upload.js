import {put} from '@vercel/blob';
import {admin} from './_lib.js';
export const config={api:{bodyParser:false}};
export default async (req,res)=>{
  if(req.method!=='POST'||!admin(req))return res.status(401).json({error:'PIN salah'});
  const ct=req.headers['content-type']||'image/jpeg',ext=ct.includes('png')?'png':'jpg';
  const b=await put(`tshake/${Date.now()}.${ext}`,req,{access:'public',contentType:ct,addRandomSuffix:true});
  res.json({url:b.url});
};
