import {db,admin,live} from './_lib.js';
export default async (req,res)=>{
  if(req.method==='POST'){
    if(!admin(req))return res.status(401).json({error:'PIN salah'});
    await db.set('tshake:data',req.body);return res.json({ok:1});
  }
  const data=await db.get('tshake:data');
  const all=Object.values(await db.hgetall('tshake:bk')||{});
  res.setHeader('Cache-Control','no-store');
  if(data&&data.off&&!admin(req))return res.json({off:true,busy:[]});
  res.json({data,busy:all.filter(live).map(b=>b.date)});
};
