import { Client } from "@notionhq/client"
import { Handler } from "@netlify/functions";

import type {
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'


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

  const myPage: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.NOTION_BLOG_DATABASE,
    sorts: [
        {
            "timestamp": "last_edited_time",
            "direction":"ascending"
        }
    ]
    // filter: {
    //   property: "Landmark",
    //   text: {
    //     contains: "Bridge",
    //   },
    // },
  });

  return {
    statusCode: 200,
    body: JSON.stringify(myPage),
  };
};

export { handler };
