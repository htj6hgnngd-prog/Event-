import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './sanity/schemaTypes'

const projectId=process.env.PUBLIC_SANITY_PROJECT_ID
if(!projectId) {
  throw new Error('Set PUBLIC_SANITY_PROJECT_ID before enabling the real /admin Studio.')
}

export default defineConfig({
  name:'vecta-weddings',
  title:'VECTA · Weddings 2027',
  projectId,
  dataset:process.env.PUBLIC_SANITY_DATASET || 'production',
  basePath:'/admin',
  plugins:[structureTool({
    structure:(S)=>S.list().title('VECTA').items([
      S.listItem().title('Главная страница').id('homePage').child(
        S.document().schemaType('homePage').documentId('homePage')
      ),
      S.listItem().title('Настройки').id('settings').child(
        S.document().schemaType('siteSettings').documentId('siteSettings')
      ),
      S.divider(),
      S.documentTypeListItem('servicePage').title('Страницы свадебных услуг')
    ])
  })],
  schema:{types:schemaTypes},
  document:{
    actions:(prev,ctx)=>['homePage','siteSettings'].includes(ctx.schemaType)
      ? prev.filter(action=>!['delete','duplicate'].includes(action.action||''))
      : prev
  }
})
