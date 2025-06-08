'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirectTo') as string || '/'

  const supabase = createServerActionClient({ cookies })

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message, success: false }
    }

    revalidatePath('/', 'layout')
    redirect(redirectTo)
  } catch (error: any) {
    return { error: error.message || 'An unexpected error occurred', success: false }
  }
}