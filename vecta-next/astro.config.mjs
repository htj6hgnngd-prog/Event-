import 'dotenv/config'
import {defineConfig} from 'astro/config'

// The public site works without a Sanity account while we await owner access.
// When a real project ID is supplied, Astro embeds Sanity Studio at /admin.
// Studio uses real Sanity project authentication; no pretend login is rendered.
const projectId=process.env.PUBLIC_SANITY_PROJECT_ID
const integrations=[]
if(projectId){
  const [{default:sanity},{default:react}]=await Promise.all([
    import('@sanity/astro'),import('@astrojs/react')
  ])
  integrations.push(sanity({
    projectId,
    dataset:process.env.PUBLIC_SANITY_DATASET||'production',
    useCdn:false,
    studioBasePath:'/admin'
  }))
  integrations.push(react())
}

export default defineConfig({
  site:process.env.PUBLIC_SITE_URL||'https://event-production-site.vercel.app',
  output:'static',
  integrations
})
