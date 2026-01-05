import { IOgp } from 'core/types/NotionApiResponses';
import { JSDOM, VirtualConsole } from "jsdom";
import { OGPEntity } from '../objects/entities/OGPEntity';

export const getOGP = async (url: string): Promise<OGPEntity> => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGPBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    // Configure JSDOM to ignore CSS parsing errors
    const dom = new JSDOM(data, {
      virtualConsole: new VirtualConsole().on("error", () => {
        /* No-op to skip console errors.*/
      }),
      contentType: "text/html",
      runScripts: "outside-only",
      includeNodeLocations: false,
      storageQuota: 10000000,
      pretendToBeVisual: true,
      // This is the key option to bypass CSS parsing issues
      resources: "usable"
    });
    const metaList = dom.window.document.getElementsByTagName("meta");
    let ogp:IOgp = {
      siteUrl: url,
      thumbnailUrl: null
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
    return new OGPEntity(ogp.thumbnailUrl);
  } catch (e) {
    console.warn(`Failed to fetch OGP for URL: ${url}`, e);
    return new OGPEntity();
  }
}
