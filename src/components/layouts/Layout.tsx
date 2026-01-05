'use client';

import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "../sidebar/Sidebar";
import { IPageHead } from 'core/types/NotionPageApiResponses';
import { TagData, SeriesData } from 'contexts/SidebarContext';

interface SidebarData {
  trendingPosts?: IPageHead[];
  tags?: TagData[];
  series?: SeriesData[];
}

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showSidebar?: boolean;
  sidebarContent?: ReactNode;
  sidebarData?: SidebarData;
  slug?: string;
}

export default function Layout({
  children,
  showSidebar = true,
  sidebarContent,
  sidebarData = {},
}: LayoutProps) {
  return (
    <div className="container">
      <Header />
      <main className="main-layout">
        <div className="main-column">
          {children}
        </div>
        {showSidebar && (
          <aside className="sidebar">
            {sidebarContent || (
              <Sidebar
                trendingPosts={sidebarData.trendingPosts}
                tags={sidebarData.tags}
                series={sidebarData.series}
              />
            )}
          </aside>
        )}
      </main>
      <Footer />
    </div>
  );
}
