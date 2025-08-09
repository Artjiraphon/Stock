import { supabase } from './supabase'
export async function signIn(email){ return supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo: window.location.origin } }) }
export async function signOut(){ return supabase.auth.signOut() }
export async function session(){ const { data } = await supabase.auth.getSession(); return data.session }
