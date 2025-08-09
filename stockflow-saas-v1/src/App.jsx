import React, { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { signOut } from './lib/auth'

import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Templates from './pages/Templates.jsx'
import Builder from './pages/Builder.jsx'
import Publish from './pages/Publish.jsx'
import PublicForm from './pages/PublicForm.jsx'
import Tasks from './pages/Tasks.jsx'
import Reports from './pages/Reports.jsx'
import Products from './pages/Products.jsx'
import Movements from './pages/Movements.jsx'
import Warehouses from './pages/Warehouses.jsx'
import Categories from './pages/Categories.jsx'
import Users from './pages/Users.jsx'

function SidebarLink({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      className={({isActive}) =>
        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition
         ${isActive ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'}`
      }
    >
      <span className="text-lg">{icon}</span>{children}
    </NavLink>
  )
}

function AppShell({ user }){
  const nav = useNavigate()
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-slate-50">
      <aside className="bg-brand-700 text-white px-4 py-6">
        <div className="px-2">
          <div className="text-2xl font-bold tracking-wide">StockFlow</div>
          <div className="text-xs opacity-80 mt-1">SaaS v1</div>
        </div>
        <nav className="mt-6 space-y-1">
          <SidebarLink to="/" icon="📊">Dashboard</SidebarLink>
          <SidebarLink to="/products" icon="📦">Products</SidebarLink>
          <SidebarLink to="/categories" icon="📂">Categories</SidebarLink>
          <SidebarLink to="/warehouses" icon="🏬">Warehouses</SidebarLink>
          <SidebarLink to="/movements" icon="🔁">Movements</SidebarLink>
          <SidebarLink to="/templates" icon="📄">Templates</SidebarLink>
          <SidebarLink to="/builder" icon="🧩">Builder</SidebarLink>
          <SidebarLink to="/publish" icon="🔗">Publish</SidebarLink>
          <SidebarLink to="/tasks" icon="✅">Tasks</SidebarLink>
          <SidebarLink to="/reports" icon="📈">Reports</SidebarLink>
          <SidebarLink to="/users" icon="👤">Users</SidebarLink>
        </nav>
        <button onClick={async()=>{ await signOut(); nav('/login') }} className="btn btn-soft w-full mt-6">Sign out</button>
      </aside>
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/categories" element={<Categories/>} />
          <Route path="/warehouses" element={<Warehouses/>} />
          <Route path="/movements" element={<Movements/>} />
          <Route path="/templates" element={<Templates/>} />
          <Route path="/builder" element={<Builder/>} />
          <Route path="/publish" element={<Publish/>} />
          <Route path="/tasks" element={<Tasks/>} />
          <Route path="/reports" element={<Reports/>} />
          <Route path="/users" element={<Users/>} />
          <Route path="/p/:slug" element={<PublicForm/>} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App(){
  const [user,setUser] = useState(null)
  useEffect(()=>{
    supabase.auth.onAuthStateChange((_event, session)=> setUser(session?.user||null))
    supabase.auth.getSession().then(({data})=> setUser(data.session?.user||null))
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js')
  },[])

  if(!user) return <Routes><Route path="*" element={<Login/>} /></Routes>
  return <AppShell user={user} />
}
