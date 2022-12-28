import fs from 'fs';
import axios from 'axios';
import { JSDOM } from "jsdom";

import {IOgp, IRetrieveBlockChildrenResponse} from '../../interfaces/NotionApiResponses';

export const getOGP = async (url: string, id: string): Promise<IOgp> => {
  const response = await axios.get(url)
  const data = response.data
  const dom = new JSDOM(data)
  const metaList = dom.window.document.getElementsByTagName("meta");
  let ogp:IOgp = {
    siteUrl: url,
    thumbnailUrl: 'https://placehold.jp/30/a1a1a1/ffffff/300x150.png?text=NO IMAGE'
  }
  Array.from(metaList).map((meta: HTMLMetaElement) => {
    let name = meta.getAttribute("name")
    if (typeof name == "string") {
      if (name.match("site_name")) ogp.siteTitle = meta.getAttribute("content")
      if (name.match("title")) ogp.pageTitle = meta.getAttribute("content")
      if (name.match("description")) ogp.pageDescription = meta.getAttribute("content")
      if (name.match("image")) ogp.thumbnailUrl = meta.getAttribute("content")
    }
    let property = meta.getAttribute("property"); // OGPが設定されるのはpropertyなのでこちらが優先
    if (property === "og:site_name") ogp.siteTitle = meta.getAttribute("content")
    if (property === "og:title") ogp.pageTitle = meta.getAttribute("content")
    if (property === "og:description") ogp.pageDescription = meta.getAttribute("content")
    if (property === "og:image") ogp.thumbnailUrl = meta.getAttribute("content")
  })
  console.log(JSON.stringify(ogp));
  return ogp
}

export const setOGPToBookmarkBlocks = async (blockList: IRetrieveBlockChildrenResponse): Promise<IRetrieveBlockChildrenResponse> => {

  const blocks: IRetrieveBlockChildrenResponse = {object: "list", results: []};
  for (let item of blockList.results) {
    if (item.has_children === true) { 
      item[item.type].children = await setOGPToBookmarkBlocks(item[item.type].children)
    }
    if (item.type === 'bookmark') {
      let ogp:IOgp = await getOGP(item.bookmark.url, item.id)
      item.bookmark.ogp = ogp
    }
    blocks.results.push(item)
  }
  return blocks
}
