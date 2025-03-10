'use server'

import { cookies } from 'next/headers'

export async function setWebsite(website: string) {
  // Clean up the URL - remove protocol and www
  const cleanUrl = website
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/$/, '') // Remove trailing slash
  
  cookies().set('currentWebsite', cleanUrl)
}

export async function getCurrentWebsite() {
  return cookies().get('currentWebsite')?.value ?? 'agencyspot.seoscientist.ai'
} 