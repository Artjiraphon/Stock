import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Movements(){
  const [rows,setRows]=useState([])
  const [products,setProducts]=useState([])
  const [form,setForm]=useState({ type:'IN', product_id:'', qty:0, note:'' })

  useEffect(()=>{ load() },[])
  async function load(){
    const { data: p } = await supabase.from('products').select('id,sku,name').order('name')
    setProducts(p||[])
    const { data: m } = await supabase.from('movements').select('*').order('created_at',{ascending:false}).limit(500)
    setRows(m||[])
  }
  async function submit(e){
    e.preventDefault()
    const payload = { ...form, qty:Number(form.qty) }
    await supabase.from('movements').insert(payload)
    setForm({ type:'IN', product_id:'', qty:0, note:'' })
    load()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-slate-800">Movements</h1>
      <form onSubmit={submit} className="card"><div className="card-pad grid md:grid-cols-4 gap-3">
        <select className="select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>IN</option><option>OUT</option><option>ADJUST</option></select>
        <select className="select md:col-span-2" value={form.product_id} onChange={e=>setForm({...form,product_id:e.target.value})}><option value="">-- product --</option>{products.map(p=><option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}</select>
        <input type="number" className="input" placeholder="Qty" value={form.qty} onChange={e=>setForm({...form,qty:e.target.value})}/>
        <input className="input md:col-span-4" placeholder="Note" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/>
        <div className="md:col-span-4"><button className="btn btn-brand">Save</button></div>
      </div></form>
      <div className="card"><div className="card-pad">
        <div className="overflow-auto rounded-2xl ring-1 ring-slate-200">
          <table className="table"><thead><tr><th>Time</th><th>Type</th><th>Product</th><th>Qty</th><th>Note</th></tr></thead><tbody className="bg-white">
            {rows.map(r=>(<tr key={r.id}><td>{new Date(r.created_at).toLocaleString()}</td><td>{r.type}</td><td>{r.product_id}</td><td>{r.qty}</td><td>{r.note}</td></tr>))}
            {rows.length===0 && <tr><td colSpan="5" className="text-center text-slate-500 py-6">No data</td></tr>}
          </tbody></table>
        </div>
      </div></div>
    </div>
  )
}
