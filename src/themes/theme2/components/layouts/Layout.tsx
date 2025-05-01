import React, { ReactNode } from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "../sidebar/Sidebar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showSidebar?: boolean;
  sidebarContent?: ReactNode;
  slug?: string; // 記事のスラッグ（URLパス）
}

/**
 * 共通レイアウトコンポーネント
 */
export default function Layout({
  children,
  title = "Coffee Break Point",
  description = "日々の気付きやメモを書いていくブログです",
  showSidebar = true,
  sidebarContent,
  slug,
}: LayoutProps) {
  // OGP画像のURL生成
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.shaba.dev';
  const ogImageUrl = slug 
    ? `${baseUrl}/og-images/${slug}.png` 
    : `${baseUrl}/og-images/default.png`;
  
  // 現在のページのURL
  const pageUrl = slug 
    ? `${baseUrl}/posts/${slug}` 
    : baseUrl;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* OGP基本設定 */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content={slug ? "article" : "website"} />
        <meta property="og:site_name" content="Coffee Break Point" />
        
        {/* OGP画像設定 */}
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card設定 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <div className="container">
        <Header />
        <main className="main-layout">
          <div className="main-column">
            {children}
          </div>
          {showSidebar && (
            <aside className="sidebar">
              {sidebarContent || <Sidebar />}
            </aside>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
