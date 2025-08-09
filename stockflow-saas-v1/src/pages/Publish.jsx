import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Publish(){
  const [rows, setRows] = useState([])

  useEffect(()=>{ load() },[])
  async function load(){
    const { data } = await supabase.from('form_templates').select('id,name,slug,is_published').order('created_at',{ascending:false})
    setRows(data||[])
  }
  async function togglePublish(t){
    await supabase.from('form_templates').update({ is_published: !t.is_published }).eq('id', t.id)
    load()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-slate-800">Publish</h1>
      <div className="card"><div className="card-pad">
        <table className="table">
          <thead><tr><th>Name</th><th>Status</th><th>Link</th><th></th></tr></thead>
          <tbody className="bg-white">
            {rows.map(t=>(
              <tr key={t.id}>
                <td className="font-medium">{t.name}</td>
                <td>{t.is_published? <span className="badge">Published</span>:<span className="badge">Unpublished</span>}</td>
                <td><a href={`/p/${t.slug}`} className="text-brand-700 underline" target="_blank">/p/{t.slug}</a></td>
                <td><button className="btn btn-soft" onClick={()=>togglePublish(t)}>{t.is_published?'Unpublish':'Publish'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  )
}
