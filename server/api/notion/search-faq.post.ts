import { Client } from '@notionhq/client'
import { createError, defineEventHandler, readBody } from 'h3'


interface RequestBody {
  query: string
}

export default defineEventHandler(async (event) => {
  try {
    const { query } = await readBody<RequestBody>(event)
    const config = useRuntimeConfig()
    
    const notion = new Client({
      auth: config.notionApiKey as string
    })

    // Query FAQ database
    const response = await notion.databases.query({
      database_id: config.notionFaqDatabaseId as string,
      filter: {
        property: 'Status',
        select: {
          equals: 'Active'
        }
      }
    })

    // Search through results
    const results = response.results.filter((page: any) => {
  // Safely extract question text
  const question = Array.isArray(page.properties.Question?.title) && page.properties.Question.title.length > 0
    ? page.properties.Question.title[0].plain_text.toLowerCase()
    : '';

  // Safely extract keywords names array
  const keywords = Array.isArray(page.properties.Keywords?.multi_select)
    ? page.properties.Keywords.multi_select.map((k: any) => (k.name ?? '').toLowerCase())
    : [];

  // Safely extract alternative phrasings text
  const altPhrases = Array.isArray(page.properties['Alternative Phrasings']?.rich_text) &&
                     page.properties['Alternative Phrasings'].rich_text.length > 0
    ? page.properties['Alternative Phrasings'].rich_text[0].plain_text.toLowerCase()
    : '';

  const searchTerm = query.toLowerCase();

  return question.includes(searchTerm) ||
         keywords.some((kw: string) => searchTerm.includes(kw)) ||
         altPhrases.includes(searchTerm);
});

const faqs = results.map((page: any) => ({
  question: Array.isArray(page.properties.Question?.title) && page.properties.Question.title.length > 0
              ? page.properties.Question.title[0].plain_text
              : '',
  answer: Array.isArray(page.properties.Answer?.rich_text) && page.properties.Answer.rich_text.length > 0
            ? page.properties.Answer.rich_text[0].plain_text
            : '',
  category: page.properties.Category?.select?.name ?? '',
  priority: page.properties.Priority?.select?.name ?? ''
}));


    return { faqs }

  } catch (error: any) {
    console.error('Notion FAQ search error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search FAQ'
    })
  }
})