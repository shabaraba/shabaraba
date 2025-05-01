import { MyLinkType } from "./MyLinkType";

export type StaticProps = {
  props: {
    allData: MyLinkType[],
    sidebarData?: {
      trendingPosts: any[],
      tags: any[],
      series: any[]
    }
  };
};