import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import { BaseNotionRepository } from "lib/BaseNotionRepository"
import { MyLinkEntity } from "../objects/entities/MyLinkEntity"
import { NotionPageResponseDxo } from "./NotionPageResponseDxo"

export default class NotionRepository extends BaseNotionRepository {

  public async getPostList(): Promise<MyLinkEntity[]> {
    const response: QueryDatabaseResponse = await this._notion.databases.query({
      database_id: this._databaseId,
      filter: {
        and: [{
          property: 'Published',
          checkbox: { equals: true }
        },{
          property: 'Url',
          url: { is_not_empty: true }
        }],
      },
      sorts: [
        {
            // "timestamp": "created_time",
            "property": "Published_Time",
            "direction":"descending"
        }
      ]
    })

    return response.results.map((item: any) => {
      return NotionPageResponseDxo.convert(item)
    })
  }
}


