import {db,admin,live} from './_lib.js';
const H='tshake:bk',cut=(v,n)=>String(v||'').slice(0,n);
export default async (req,res)=>{
  const all=async()=>Object.values(await db.hgetall(H)||{});
  if(req.method==='GET'){
    if(!admin(req))return res.status(401).json({error:'PIN salah'});
    const a=(await all()).map(b=>({...b,status:b.status==='menunggu'&&!live(b)?'kedaluwarsa':b.status}));
    return res.json(a.sort((x,y)=>y.created-x.created));
  }
  if(req.method==='PATCH'){
    if(!admin(req))return res.status(401).json({error:'PIN salah'});
    const {id,status}=req.body||{},b=await db.hget(H,id);
    if(!b||!['menunggu','lunas','batal'].includes(status))return res.status(400).json({error:'Data tidak valid'});
    b.status=status;await db.hset(H,{[id]:b});return res.json(b);
  }
  if(req.method!=='POST')return res.status(405).end();
  const q=req.body||{},today=new Date(Date.now()+7*36e5).toISOString().slice(0,10);
  if(!/^\d{4}-\d\d-\d\d$/.test(q.date)||q.date<today||!q.name||String(q.wa).length<9)return res.status(400).json({error:'Data tidak lengkap atau tanggal tidak valid'});
  if((await all()).some(b=>b.date===q.date&&live(b)))return res.status(409).json({error:'Tanggal sudah dipesan, pilih tanggal lain.'});
  const id='TS'+Date.now().toString(36).toUpperCase();
  const b={id,date:q.date,pkg:cut(q.pkg,60),amt:Math.max(0,+q.amt||0),name:cut(q.name,80),wa:String(q.wa).replace(/\D/g,''),place:cut(q.place,160),note:cut(q.note,300),status:'menunggu',deadline:q.date+'T23:49:00+07:00',created:Date.now()};
  await db.hset(H,{[id]:b});res.status(201).json(b);
};
