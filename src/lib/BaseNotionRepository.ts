import { Client } from "@notionhq/client"

export class BaseNotionRepository {
  protected _notion: Client;
  protected _token: string;;
  protected _databaseId: string;

  constructor(token: string, databaseId: string) {
    this._token = token;
    this._databaseId = databaseId;

    this._notion = new Client({
      auth: this._token
    });
  }

  protected _query(target: 'database'|'page'|'block') {

  }

}