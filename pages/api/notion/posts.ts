import { Client } from "@notionhq/client"
import { NextApiRequest, NextApiResponse } from 'next'

import type {
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'

import type {
  NotionPostHead,
  NotionTag,
  NotionIcon,
} from '../../../entities/notion_entities';

const getList = async () => {
  console.log("notion_get_post_list start");
  // console.log("env?: " + JSON.stringify(process.env));
  console.log(process.env.NOTION_TOKEN);
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  console.log(process.env.NOTION_TOKEN);
  console.log(process.env.NOTION_BLOG_DATABASE)

  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.NOTION_BLOG_DATABASE,
    sorts: [
        {
            "timestamp": "created_time",
            "direction":"descending"
        }
    ]
  });
  console.log(response)

  const postList: NotionPostHead[] = response.results.map((item: any) => {
    let properties = item.properties;
    let title: string = properties.Name.title[0]?.plain_text;
    let tags: NotionTag[] = properties.Tags.multi_select;
    let slug: string|null = properties.Slug.rich_text[0]?.plain_text;
    if (slug === null) {
      slug = item.id;
    }
    let icon: NotionIcon = item.icon;
    return {
      id: item.id,
      title: title,
      tags: tags,
      slug: slug,
      icon: icon,
      createdAt: properties.Created?.created_time,
      updatedAt: properties.Updated?.last_edited_time,
    }
  });

  console.log(postList);
  return postList;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      // データの取得処理
      const result = await getList();
      res.status(200).json(result);
      break;
    }
    default: {
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
    }
  }
}

