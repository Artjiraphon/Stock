import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Tasks(){
  const [rows,setRows] = useState([])

  useEffect(()=>{ load() },[])
  async function load(){
    const { data } = await supabase.from('form_instances').select('id,status,created_at,template_id').order('created_at',{ascending:false})
    setRows(data||[])
  }

  async function setStatus(id, status){ await supabase.from('form_instances').update({ status }).eq('id',id); load() }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>
      <div className="card"><div className="card-pad">
        <table className="table">
          <thead><tr><th>ID</th><th>Status</th><th>Time</th><th></th></tr></thead>
          <tbody className="bg-white">
            {rows.map(r=>(
              <tr key={r.id}>
                <td className="font-mono text-xs">{r.id.slice(0,8)}…</td>
                <td><span className="badge">{r.status}</span></td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td className="flex gap-2">
                  <button className="btn btn-soft" onClick={()=>setStatus(r.id,'IN_REVIEW')}>Review</button>
                  <button className="btn btn-brand" onClick={()=>setStatus(r.id,'APPROVED')}>Approve</button>
                </td>
              </tr>
            ))}
            {rows.length===0 && <tr><td colSpan="4" className="text-center text-slate-500 py-6">No tasks</td></tr>}
          </tbody>
        </table>
      </div></div>
    </div>
  )
}
