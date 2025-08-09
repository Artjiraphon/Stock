import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export default function Templates(){
  const [rows, setRows] = useState([])
  const [name, setName] = useState('')

  useEffect(()=>{ load() },[])

  async function load(){
    const { data } = await supabase.from('form_templates').select('*').order('created_at',{ascending:false})
    setRows(data||[])
  }
  async function create(){
    if(!name.trim()) return
    const slug = name.toLowerCase().replace(/\s+/g,'-') + '-' + Math.random().toString(36).slice(2,6)
    const schema = { title: name, fields: [] }
    await supabase.from('form_templates').insert({ id: uuidv4(), name, slug, version: 1, schema, is_published: false })
    setName(''); load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Templates</h1>
        <div className="flex gap-2">
          <input className="input" placeholder="Template name" value={name} onChange={e=>setName(e.target.value)} />
          <button className="btn btn-brand" onClick={create}>Create</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {rows.map(t => (
          <div key={t.id} className="card">
            <div className="card-pad">
              <div className="text-lg font-semibold">{t.name} <span className="badge ml-2">v{t.version}</span></div>
              <div className="text-slate-500 text-sm mt-1">slug: {t.slug}</div>
              <div className="mt-3 flex gap-2">
                <a className="btn btn-soft" href={`/p/${t.slug}`} target="_blank">Open public link</a>
              </div>
            </div>
          </div>
        ))}
        {rows.length===0 && <div className="text-slate-500">No templates</div>}
      </div>
    </div>
  )
}
