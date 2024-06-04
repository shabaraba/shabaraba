
export type PostHeadType = {
  id: string;
  title: string;
  coverImageUrl: string;
  iconText: string;
  tags: Array<{name: string; color: string;}>;
  slug: string;
  publishedAt: string;
  updatedAt: string;
}
