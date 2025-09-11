import React from "react";
import { Container, Text } from "@chakra-ui/react";
import styles from "./layout.module.css";
import Link from "next/link";
import Layout from "./layout";
import { useRouter } from "next/router";
import Head from "next/head";

export default function ListLayout({
  children,
  leftside,
  title,
  description,
  slug,
}: {
  children: React.ReactNode;
  leftside?: React.ReactNode;
  title?: string;
  description?: string;
  slug?: string;
}) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault()
    router.back()
  }

  // OGP画像のURL生成
  const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shaba.dev/blog';
  // OG画像は静的ファイルなので、ルートドメインから直接配信される
  const ogImageBaseUrl = 'https://shaba.dev';
  const ogImageUrl = slug 
    ? `${ogImageBaseUrl}/og-images/${slug}.png` 
    : `${ogImageBaseUrl}/og-images/default.png`;
  
  // 現在のページのURL
  const pageUrl = slug 
    ? `${siteBaseUrl}/posts/${slug}` 
    : siteBaseUrl;
  
  // 設定されていない場合のデフォルト値
  const pageTitle = title || 'Coffee Break Point';
  const pageDescription = description || '日々の気付きやメモを書いていくブログです';
  
  // background: '#e8cfc1'
  return (
    <>
      {/* OGPメタタグを追加 */}
      {slug && (
        <Head>
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:url" content={pageUrl} />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Coffee Break Point" />
          
          <meta property="og:image" content={ogImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:image" content={ogImageUrl} />
        </Head>
      )}
      
      <Layout leftside={leftside}>
        <Container maxW="container.lg">{children}</Container>
        <div className={styles.backToHome}>
          <Text as="a" onClick={(e) => router.back()} _hover={{cursor: "pointer"}}> ← Back to home </Text>
        </div>
      </Layout>
    </>
  );
}
