import fs from 'fs'
import { Feed } from 'feed';
import { siteUrl, siteTitle, siteDescription } from '../../next-seo.config'
import { GetServerSidePropsContext } from 'next';
import Notion from '../../lib/notions'
import { IPageHead } from '../../interfaces/NotionPageApiResponses';

export default () => null;

// export const getServerSideProps = async (context: GetServerSidePropsContext) => {
export const getStaticProps = async () => {
  const rss = await generateFeedXml(); // フィードのXMLを生成する（後述）




  // const getMethods = (obj) => {
  //   let properties = new Set()
  //   let currentObj = obj
  //   do {
  //     Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  //   } while ((currentObj = Object.getPrototypeOf(currentObj)))
  //   return properties
  // }


  // context.res.statusCode = 200
  // context.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate') // 24時間キャッシュする
  // context.res.setHeader('Content-Type', 'text/xml')

  // context.res.end()

  return {
    props: {},
  };
};

async function generateFeedXml() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.from-garage.com';
  const date = new Date();
  // author の情報を書き換える
  const author = {
    name: 'しゃば',
    email: 'fromgarage.work@gmail.com',
    link: 'https://blog.from-garage.com',
  };

  // デフォルトになる feed の情報
  const feed = new Feed({
    title: process.env.NEXT_PUBLIC_SITE_NAME || 'Coffee-Break-Point',
    description: process.env.NEXT_PUBLIC_SITE_DISC || 'コーヒー休憩にちょうどよい技術よみものを目指して',
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


    feed.addItem({
      title: post.title,
      id: `${siteUrl}/posts/${post.slug}`,
      link: `${siteUrl}/posts/${post.slug}`,
      description: description,
      content: description,
      date: new Date(post.publishedAt),
    });
  }
    // フィード情報を public/rss 配下にディレクトリを作って保存
  fs.mkdirSync('./public/rss', { recursive: true });
  fs.writeFileSync('./public/rss/feed.xml', feed.rss2());
  fs.writeFileSync('./public/rss/atom.xml', feed.atom1());
  fs.writeFileSync('./public/rss/feed.json', feed.json1());

  return feed.rss2()
}
