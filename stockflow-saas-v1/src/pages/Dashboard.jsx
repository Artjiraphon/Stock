import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard(){
  const [stats,setStats]=useState({products:0, movements:0, alerts:0})

  useEffect(()=>{
    (async()=>{
      const { count: p } = await supabase.from('products').select('*',{count:'exact', head:true})
      const { count: m } = await supabase.from('movements').select('*',{count:'exact', head:true})
      const { data: low } = await supabase.rpc('low_stock_alerts')
      setStats({ products:p||0, movements:m||0, alerts: (low||[]).length })
    })()
  },[])

  return (
    <>
      <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card"><div className="card-pad"><div className="text-sm text-slate-500">Products</div><div className="text-2xl font-semibold">{stats.products}</div></div></div>
        <div className="card"><div className="card-pad"><div className="text-sm text-slate-500">Movements</div><div className="text-2xl font-semibold">{stats.movements}</div></div></div>
        <div className="card"><div className="card-pad"><div className="text-sm text-slate-500">Low stock alerts</div><div className="text-2xl font-semibold">{stats.alerts}</div></div></div>
      </div>
    </>
  )
}
