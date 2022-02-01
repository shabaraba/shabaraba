import axios from "axios"

import type {
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'

export async function test() {
  // Initializing a client
  console.log("call axios");
  axios.get(
    '/.netlify/functions/notion_get_post_list',
  ).then(res => {
    console.log("catch: ");
    console.log(res);
  })
  return 1;
}
