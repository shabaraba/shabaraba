import { ACTIVE_THEME } from '../../config/themeSelector';
import { ArticleServiceFactory } from '../../core/factories/ArticleServiceFactory';
import { ArticlePageUsecase } from 'application/usecases/ArticlePageUsecase';
import dynamic from 'next/dynamic';

// 動的にテーマの記事詳細ページコンポーネントをインポート
const ArticlePage = dynamic(() =>
  import(`../../themes/${ACTIVE_THEME}/pages/ArticlePage`).then(mod => mod.default),
  {
    // loading: () => <Loading />, // 読み込み中に表示されるコンポーネント
    loading: () => null,
    ssr: false, // 必要に応じて
  }

);

// ページコンポーネントをエクスポート
export default ArticlePage;

// 静的パスを生成するための関数
export async function getStaticPaths() {
  return ArticlePageUsecase.getStaticPaths();
}

// 静的ページ生成のためのデータ取得関数
export async function getStaticProps({ params }) {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }
  return ArticlePageUsecase.getStaticProps({ params });
}
<<<<<<< HEAD
=======

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default ({ tags, postHead, title, postDetail }: Props) => {
  const postHeadEntity:PostHeadEntity = new PostHeadEntity(postHead);

  return (
    <DetailLayout leftside={
      <SlideFade in={true} offsetY='20px'>
        <SideArea tags={tags} post={postHeadEntity} title={title} />
      </SlideFade>
    } >
      <Seo title={postHeadEntity.title} slug={postHead.slug} coverImageUrl={postHeadEntity.coverImageUrl} />
      <Head> <title>{postHeadEntity.title}</title> </Head>
      <SlideFade in={true} offsetY='20px'>
        <MainArea postDetail={postDetail} />
      </SlideFade>
      <AuthorBox />
    </DetailLayout>
  )
}

// server側で呼ばれる
export const getStaticPaths = async () => ArticlePageUsecase.getStaticPaths();

// server側で呼ばれる
export const getStaticProps = async ({ params }) => ArticlePageUsecase.getStaticProps({params});
>>>>>>> 7fe3759 (feat: implement OGP image generation at build time)
