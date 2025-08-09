import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Products(){
  const [rows,setRows] = useState([])
  const [q,setQ] = useState('')
  const [form,setForm] = useState({ sku:'', name:'', category_id:null, unit:'pcs', cost:0, price:0, min_threshold:0 })

  useEffect(()=>{ load() },[])
  async function load(){
    let query = supabase.from('products').select('*').order('created_at',{ascending:false})
    if(q) query = query.ilike('name', `%${q}%`)
    const { data } = await query
    setRows(data||[])
  }
  async function save(e){
    e.preventDefault()
    await supabase.from('products').insert(form)
    setForm({ sku:'', name:'', category_id:null, unit:'pcs', cost:0, price:0, min_threshold:0 })
    load()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-slate-800">Products</h1>
      <div className="card"><div className="card-pad space-y-3">
        <div className="flex gap-2"><input className="input" placeholder="Search name" value={q} onChange={e=>setQ(e.target.value)} /><button className="btn btn-soft" onClick={load}>Search</button></div>
        <form onSubmit={save} className="grid md:grid-cols-6 gap-3">
          <input className="input" placeholder="SKU" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/>
          <input className="input md:col-span-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
          <input className="input" placeholder="Unit" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}/>
          <input type="number" className="input" placeholder="Cost" value={form.cost} onChange={e=>setForm({...form,cost:Number(e.target.value)})}/>
          <input type="number" className="input" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})}/>
          <input type="number" className="input" placeholder="Min threshold" value={form.min_threshold} onChange={e=>setForm({...form,min_threshold:Number(e.target.value)})}/>
          <div className="md:col-span-6"><button className="btn btn-brand">Add</button></div>
        </form>
      </div></div>

      <div className="card"><div className="card-pad">
        <div className="overflow-auto rounded-2xl ring-1 ring-slate-200">
          <table className="table">
            <thead><tr><th>SKU</th><th>Name</th><th>Unit</th><th>Cost</th><th>Price</th><th>Min</th></tr></thead>
            <tbody className="bg-white">
              {rows.map(r=>(<tr key={r.id}><td>{r.sku}</td><td className="font-medium">{r.name}</td><td>{r.unit}</td><td>{r.cost}</td><td>{r.price}</td><td>{r.min_threshold}</td></tr>))}
              {rows.length===0 && <tr><td colSpan="6" className="text-center text-slate-500 py-6">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div></div>
    </div>
  )
}
