import {Redis} from '@upstash/redis';
export const db=new Redis({url:process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN});
export const admin=r=>!!process.env.ADMIN_PIN&&r.headers['x-pin']===process.env.ADMIN_PIN;
// tanggal dianggap terpakai jika belum batal dan (sudah lunas atau belum lewat batas bayar 23.49 WIB hari H)
export const live=b=>b.status==='lunas'||(b.status==='menunggu'&&Date.now()<=Date.parse(b.deadline));
