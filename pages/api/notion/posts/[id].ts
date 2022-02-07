import { Client } from "@notionhq/client"
import { NextApiRequest, NextApiResponse } from 'next'

import type {
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'

const find = async (id: string) => {
  console.log("notion_get_post start");
  console.log(process.env.NOTION_TOKEN);
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  console.log(process.env.NOTION_BLOG_DATABASE);

  const response: ListBlockChildrenResponse = await notion.blocks.children.list({
    block_id: id
  });
  return response;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      const id = req.query.id as string
      // データの取得処理
      const result = await find(id);
      res.status(200).json(result);
      break;
    }
    default: {
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
    }
  }
}
