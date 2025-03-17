import axios from 'axios';

import {IOgp, IRetrieveBlockChildrenResponse} from '../../../../core/types/NotionApiResponses';

export const getOGP = async (url: string, id: string): Promise<IOgp> => {
  // Return a placeholder OGP until we can fix the JSDOM issue
  return {
    siteUrl: url,
    thumbnailUrl: 'https://placehold.jp/30/a1a1a1/ffffff/300x150.png?text=NO IMAGE',
    siteTitle: 'Placeholder Site',
    pageTitle: 'Placeholder Title',
    pageDescription: 'Placeholder description'
  }
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
