import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
const FIELD_TYPES = ['text','number','date','select','checkbox']

export default function Builder(){
  const [templates,setTemplates] = useState([])
  const [templateId,setTemplateId] = useState('')
  const [schema,setSchema] = useState(null)
  const [newField,setNewField] = useState({ label:'', key:'', type:'text', options:'' })

  useEffect(()=>{ supabase.from('form_templates').select('id,name').then(({data})=>setTemplates(data||[])) },[])

  async function load(){
    if(!templateId) return
    const { data } = await supabase.from('form_templates').select('schema').eq('id',templateId).single()
    setSchema(data?.schema || { title:'', fields:[] })
  }
  async function save(){
    await supabase.from('form_templates').update({ schema }).eq('id',templateId)
    alert('Saved template')
  }
  function addField(){
    if(!schema) return
    const key = newField.key || newField.label.toLowerCase().replace(/\s+/g,'_')
    const field = { ...newField, key }
    if(field.type==='select') field.options = field.options.split(',').map(s=>s.trim()).filter(Boolean)
    setSchema({ ...schema, fields:[...schema.fields, field] })
    setNewField({ label:'', key:'', type:'text', options:'' })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-slate-800">Builder</h1>
      <div className="card"><div className="card-pad space-y-3">
        <div className="flex gap-2">
          <select className="select w-72" value={templateId} onChange={e=>setTemplateId(e.target.value)}>
            <option value="">-- select template --</option>
            {templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button className="btn btn-soft" onClick={load}>Load</button>
          <button className="btn btn-brand" onClick={save} disabled={!schema}>Save</button>
        </div>
        {schema && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card"><div className="card-pad space-y-2">
              <div className="font-medium">Fields</div>
              <ul className="space-y-2">{schema.fields.map((f,i)=>(<li key={i} className="flex justify-between"><span>{f.label} <span className="badge">{f.type}</span></span></li>))}</ul>
            </div></div>
            <div className="card"><div className="card-pad space-y-2">
              <div className="font-medium">Add Field</div>
              <input className="input" placeholder="Label" value={newField.label} onChange={e=>setNewField({...newField,label:e.target.value})}/>
              <input className="input" placeholder="Key (unique)" value={newField.key} onChange={e=>setNewField({...newField,key:e.target.value})}/>
              <select className="select" value={newField.type} onChange={e=>setNewField({...newField,type:e.target.value})}>{FIELD_TYPES.map(t=><option key={t}>{t}</option>)}</select>
              {newField.type==='select' && <input className="input" placeholder="Options comma separated" value={newField.options} onChange={e=>setNewField({...newField,options:e.target.value})}/>}
              <button className="btn btn-brand" onClick={addField}>Add</button>
            </div></div>
          </div>
        )}
      </div></div>
    </div>
  )
}
