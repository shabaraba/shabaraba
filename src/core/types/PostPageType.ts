import { PostDetailType } from './PostDetailType';
import { PostHeadType } from './PostHeadType';
export type StaticProps = {
  props: {
    tags: any;
    postHead: PostHeadType;
    postDetail: PostDetailType;
    title: any;
  };
};