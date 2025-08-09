import React, { useState } from 'react'
import { signIn } from '../lib/auth'

export default function Login(){
  const [email,setEmail] = useState('')
  const [sent,setSent] = useState(false)

  async function submit(e){
    e.preventDefault()
    await signIn(email)
    setSent(true)
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <div className="card max-w-md w-full">
        <div className="card-pad space-y-4">
          <div className="text-2xl font-bold">เข้าสู่ระบบ</div>
          {sent ? (
            <div className="text-slate-600 text-sm">เราได้ส่งลิงก์เข้าสู่ระบบไปที่อีเมลของคุณแล้ว กรุณาเช็คกล่องจดหมาย</div>
          ):(
            <form onSubmit={submit} className="space-y-3">
              <input className="input" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
              <button className="btn btn-brand w-full">รับลิงก์เข้าสู่ระบบ</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
