import fs from 'fs'
import { Feed } from 'feed';
import { siteUrl } from '../../../next-seo.config'
import { CommonDataService } from '../../services/CommonDataService'
import { IPageHead } from 'core/types/NotionPageApiResponses';

export default () => null;

// export const getServerSideProps = async (context: GetServerSidePropsContext) => {
export const getStaticProps = async () => {
  try {
    const rss = await generateFeedXml(); // フィードのXMLを生成する（後述）
  } catch (error) {
    console.error('RSS generation failed:', error);
    // レート制限やその他のエラーが発生した場合でもビルドを継続
  }




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
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.shaba.dev';
    const date = new Date();
    // author の情報を書き換える
    const author = {
      name: 'しゃば',
      email: 'fromgarage.work@gmail.com',
      link: 'https://blog.shaba.dev',
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

    console.log('[RSS] Starting RSS feed generation...');
    
    // CommonDataServiceを使用してキャッシュされたデータを取得
    const data = await CommonDataService.getAllData();
    const allPostsData: Array<IPageHead> = data.posts;

    console.log(`[RSS] Processing ${allPostsData.length} posts for RSS feed`);

    for (let post of allPostsData) {
      // APIコールを避けてdescriptionプロパティを使用
      const description: string = post.description || post.title;

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

    console.log('[RSS] RSS feed generation completed successfully');
    return feed.rss2();
  } catch (error) {
    console.error('[RSS] Error generating RSS feed:', error);
    // フィード生成に失敗した場合、空のRSSフィードを生成
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.shaba.dev';
    const date = new Date();
    
    const fallbackFeed = new Feed({
      title: process.env.NEXT_PUBLIC_SITE_NAME || 'Coffee-Break-Point',
      description: process.env.NEXT_PUBLIC_SITE_DISC || 'コーヒー休憩にちょうどよい技術よみものを目指して',
      id: baseUrl,
      link: baseUrl,
      language: 'ja',
      image: `${baseUrl}/public/favicon.ico`,
      copyright: `©from-garage ${date.getFullYear()} All rights reserved`,
      updated: date,
      feedLinks: {
        rss2: `${baseUrl}/rss/feed.xml`,
        json: `${baseUrl}/rss/feed.json`,
        atom: `${baseUrl}/rss/atom.xml`,
      },
      author: {
        name: 'しゃば',
        email: 'fromgarage.work@gmail.com',
        link: 'https://blog.shaba.dev',
      },
    });

    // 空のフィードファイルを生成
    fs.mkdirSync('./public/rss', { recursive: true });
    fs.writeFileSync('./public/rss/feed.xml', fallbackFeed.rss2());
    fs.writeFileSync('./public/rss/atom.xml', fallbackFeed.atom1());
    fs.writeFileSync('./public/rss/feed.json', fallbackFeed.json1());
    
    console.log('[RSS] Generated fallback empty RSS feed');
    return fallbackFeed.rss2();
  }
}
