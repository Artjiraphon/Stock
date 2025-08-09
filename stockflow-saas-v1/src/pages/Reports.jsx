import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Reports(){
  const [templates,setTemplates] = useState([])
  const [templateId,setTemplateId] = useState('')
  const [rows,setRows] = useState([])

  useEffect(()=>{ supabase.from('form_templates').select('id,name').then(({data})=>setTemplates(data||[])) },[])
  useEffect(()=>{ load() },[templateId])

  async function load(){
    if(!templateId) return setRows([])
    const { data } = await supabase.from('form_instances').select('*').eq('template_id', templateId)
    setRows(data||[])
  }

  const columns = useMemo(()=>{
    const sample = rows?.[0]?.data || {}
    return Object.keys(sample)
  },[rows])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Reports Explorer</h1>
        <select className="select w-64" value={templateId} onChange={e=>setTemplateId(e.target.value)}>
          <option value="">-- select template --</option>
          {templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div className="card"><div className="card-pad">
        <div className="overflow-auto rounded-2xl ring-1 ring-slate-200">
          <table className="table">
            <thead><tr><th>Time</th><th>Status</th>{columns.map(c=><th key={c}>{c}</th>)}</tr></thead>
            <tbody className="bg-white">
              {rows.map(r=>(
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td><span className="badge">{r.status}</span></td>
                  {columns.map(c=> <td key={c}>{String(r.data?.[c] ?? '')}</td>)}
                </tr>
              ))}
              {rows.length===0 && <tr><td colSpan={2+columns.length} className="text-center text-slate-500 py-6">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div></div>
    </div>
  )
}
