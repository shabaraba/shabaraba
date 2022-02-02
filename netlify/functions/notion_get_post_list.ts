import { Client } from "@notionhq/client"
import { Handler } from "@netlify/functions";

import type {
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'

import type {
  NotionPostHead,
  NotionTag,
} from '../../entities/notion_entities';

const handler: Handler = async (event, context) => {
  console.log("notion_get_post_list start");
  console.log("event: " + JSON.stringify(event));
  console.log("context: " + JSON.stringify(context));
  console.log("env?: " + JSON.stringify(process.env));
  console.log(process.env.NOTION_TOKEN);
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  console.log(process.env.NOTION_BLOG_DATABASE)

  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.NOTION_BLOG_DATABASE,
    sorts: [
        {
            "timestamp": "last_edited_time",
            "direction":"ascending"
        }
    ]
  });
  console.log(response)

  const postList: NotionPostHead[] = response.results.map((item: any) => {
    let properties = item.properties;
    let tags: NotionTag[] = properties.Tags.multi_select;
    let slug: string|null = properties.Slug.rich_text[0]?.plain_text;
    console.log(tags)
    return {
      id: 1,
      title: item.title,
      tags: tags,
      slug: slug,
      createdAt: properties.Created.created_time,
      updatedAt: properties.Date.date,
    }
  });
  console.log(postList);

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

export { handler };
