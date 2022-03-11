import fs from 'fs'
import { Feed } from 'feed';
import { siteUrl, siteTitle, siteDescription } from '../../next-seo.config'
import Notion from '../../lib/backend/notions'
import { IPageHead } from '../../interfaces/NotionPageApiResponses';

export default () => null;

export const getServerSideProps = async () => {
  await generateFeedXml(); // フィードのXMLを生成する（後述）

  return {
    props: {},
  };
};

async function generateFeedXml() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const date = new Date();
  // author の情報を書き換える
  const author = {
    name: 'しゃば',
    email: 'fromgarage.work@gmail.com',
    link: 'https://...com',
  };
  console.log('xml')

  // デフォルトになる feed の情報
  const feed = new Feed({
    title: process.env.NEXT_PUBLIC_SITE_NAME || '',
    description: process.env.NEXT_PUBLIC_SITE_DISC,
    id: baseUrl,
    link: baseUrl,
    language: 'ja',
    image: `${baseUrl}/public/favicon.ico`,  // image には OGP 画像でなくファビコンを指定
    copyright: `©from-garage ${date.getFullYear()} All rights reserved`,
    updated: date,
    feedLinks: {
      rss2: `${baseUrl}/rss/feed.xml`,
      json: `${baseUrl}/rss/feed.json`,
      atom: `${baseUrl}/rss/atom.xml`,
    },
    author: author,
  });

  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion: Notion = new Notion(token, databaseId);
  const allPostsData: Array<IPageHead> = await notion.getPostList();

  for (let post of allPostsData) {
    let description: string = await notion.getOpeningSentence(post.id)

    // console.log(description)
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/${post.slug}`,
      link: `${siteUrl}/${post.slug}`,
      description: description,
      content: description,
      date: new Date(post.createdAt),
    });
  }
  console.log(feed, null, ' ')
    // フィード情報を public/rss 配下にディレクトリを作って保存
  fs.mkdirSync('./public/rss', { recursive: true });
  fs.writeFileSync('./public/rss/feed.xml', feed.rss2());
  fs.writeFileSync('./public/rss/atom.xml', feed.atom1());
  fs.writeFileSync('./public/rss/feed.json', feed.json1());
}
