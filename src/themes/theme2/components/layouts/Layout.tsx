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
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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