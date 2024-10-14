import { XMLSerializer, DOMParser } from '@xmldom/xmldom'

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const path = decodeURIComponent(req.query['path'] as string)
    const url = new URL(path, `${process.env['VITE_FRAME_APP_URL']}/api`)
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
    })

    if (response.ok) {
      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, 'text/xml')
      if (!doc.getElementsByTagName('head').length) return res.json({ error: 'No head tag found' })

      const s = new XMLSerializer()
      const head = doc.getElementsByTagName('head')[0]!!

      const metadata: string[] = []
      for (let i = 0; i < head.childNodes.length; i++) {
        const node = head.childNodes[i]!!
        metadata.push(s.serializeToString(node))
      }

      return res.json({ metadata })
    } else if (response.status) {
      return res.json({ error: `Failed to fetch metadata: ${response.status}` })
    }

    return res.json({ error: 'Failed to fetch metadata' })
  } catch (error) {
    return res.json({ error: `Failed to fetch metadata: ${error}` })
  }
}
