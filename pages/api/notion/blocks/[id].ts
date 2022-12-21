import { NextApiRequest, NextApiResponse } from 'next'
import BackendNotion from '../../../../lib/backend/notions'
import * as NotionBlockInterfaces from '../../../../interfaces/NotionApiResponses';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != 'GET') res.status(405)

  const id: string = req.query.id as string
  console.log(id)

  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion: BackendNotion = new BackendNotion(token, databaseId);
  const block: NotionBlockInterfaces.BlockType = await notion.getBlockById(id)
  // console.log('api: ' + JSON.stringify(block))
  res.status(200).json(block)
}


