import React from 'react'
import KeywordSearch from '@/components/dashboard/keyword-research/keyword-search/keyword-search'

export const runtime = 'edge' // Add Edge runtime configuration for Cloudflare Pages

const page = () => {
  return (
    <div>
        <KeywordSearch />
    </div>
  )
}

export default page