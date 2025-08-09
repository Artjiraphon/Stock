import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export default function PublicForm(){
  const { slug } = useParams()
  const [tpl, setTpl] = useState(null)
  const [vals, setVals] = useState({})
  const [ok, setOk] = useState(false)

  useEffect(()=>{
    (async()=>{
      const { data } = await supabase.from('form_templates').select('*').eq('slug',slug).single()
      setTpl(data)
    })()
  },[slug])

  async function submit(e){
    e.preventDefault()
    const payload = { id: uuidv4(), template_id: tpl.id, status:'SUBMITTED', data: vals }
    await supabase.from('form_instances').insert(payload)
    setOk(true)
  }

  if(!tpl) return <div>Loading...</div>
  if(!tpl.is_published) return <div className="p-6">This form is closed</div>
  if(ok) return <div className="p-6">Submitted. Thank you.</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{tpl.name}</h1>
      <form onSubmit={submit} className="card"><div className="card-pad space-y-3">
        {tpl.schema?.fields?.map((f,i)=>{
          const common = { className:'input', value: vals[f.key]||'', onChange:e=>setVals({...vals,[f.key]: e.target.value}) }
          return (
            <div key={i}>
              <div className="text-sm text-slate-600 mb-1">{f.label}</div>
              {f.type==='text' && <input {...common}/>}
              {f.type==='number' && <input type="number" {...common}/>}
              {f.type==='date' && <input type="date" {...common}/>}
              {f.type==='select' && <select className="select" value={vals[f.key]||''} onChange={e=>setVals({...vals,[f.key]: e.target.value})}><option value="">-- Select --</option>{(f.options||[]).map(op=><option key={op} value={op}>{op}</option>)}</select>}
              {f.type==='checkbox' && <input type="checkbox" checked={!!vals[f.key]} onChange={e=>setVals({...vals,[f.key]: e.target.checked})}/>}
            </div>
          )
        })}
        <button className="btn btn-brand">Submit</button>
      </div></form>
    </div>
  )
}
