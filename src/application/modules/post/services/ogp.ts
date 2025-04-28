import axios from "axios";
import { JSDOM, VirtualConsole } from "jsdom";

import {
  IOgp,
  IRetrieveBlockChildrenResponse,
} from "../../../../core/types/NotionApiResponses";

export const getOGP = async (url: string, id: string): Promise<IOgp> => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    // Configure JSDOM to ignore CSS parsing errors
    const dom = new JSDOM(data, {
      virtualConsole: (new VirtualConsole()).on("error", () => { /* No-op to skip console errors.*/ }),
      contentType: "text/html",
      runScripts: "outside-only",
      includeNodeLocations: false,
      storageQuota: 10000000,
      pretendToBeVisual: true,
      // This is the key option to bypass CSS parsing issues
      resources: "usable",
    });

    const metaList = dom.window.document.getElementsByTagName("meta");
    let ogp: IOgp = {
      siteUrl: url,
      thumbnailUrl:
        "https://placehold.jp/30/a1a1a1/ffffff/300x150.png?text=NO IMAGE",
    };
    Array.from(metaList).map((meta: HTMLMetaElement) => {
      let name = meta.getAttribute("name");
      if (typeof name == "string") {
        if (name.match("site_name"))
          ogp.siteTitle = meta.getAttribute("content");
        if (name.match("title")) ogp.pageTitle = meta.getAttribute("content");
        if (name.match("description"))
          ogp.pageDescription = meta.getAttribute("content");
        if (name.match("image"))
          ogp.thumbnailUrl = meta.getAttribute("content");
      }
      let property = meta.getAttribute("property"); // OGPが設定されるのはpropertyなのでこちらが優先
      if (property === "og:site_name")
        ogp.siteTitle = meta.getAttribute("content");
      if (property === "og:title") ogp.pageTitle = meta.getAttribute("content");
      if (property === "og:description")
        ogp.pageDescription = meta.getAttribute("content");
      if (property === "og:image")
        ogp.thumbnailUrl = meta.getAttribute("content");
    });
    return ogp;
  } catch (error) {
    console.warn(`Failed to fetch OGP for URL: ${url}`, error);
    // Return default OGP on error
    return {
      siteUrl: url,
      siteTitle: "Unknown Site",
      pageTitle: "Unknown Page",
      pageDescription: "No description available",
      thumbnailUrl:
        "https://placehold.jp/30/a1a1a1/ffffff/300x150.png?text=NO IMAGE",
    };
  }
};

export const setOGPToBookmarkBlocks = async (
  blockList: any,
): Promise<any> => {
  console.log(JSON.stringify(blockList, null, 2));
  try {
    const blocks = [];
    for (let item of blockList) {
      try {
        if (item.has_children === true) {
          item[item.type].children = await setOGPToBookmarkBlocks(
            item[item.type].children,
          );
        }
        if (item.type === "bookmark") {
          let ogp: IOgp = await getOGP(item.bookmark.url, item.id);
          item.bookmark.ogp = ogp;
        }
        blocks.push(item);
      } catch (itemError) {
        console.warn(`Error processing block: ${item.id}`, itemError);
        // Still push the item even if OGP fetching fails
        blocks.push(item);
      }
    }
    return blocks;
  } catch (error) {
    console.error("Error in setOGPToBookmarkBlocks", error);
    // Return the original blocklist if processing fails
    return blockList;
  }
};
