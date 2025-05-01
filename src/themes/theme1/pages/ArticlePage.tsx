// SlideFade is not available in base package, using Box instead as a temporary solution
import { Box } from '@chakra-ui/react'
import { ArticlePageUsecase } from 'application/usecases/ArticlePageUsecase'
import { PostHeadEntity } from 'core/entities/PostHeadEntity'
import { PostDetailType } from 'core/types/PostDetailType'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import AuthorBox from '../components/units/common/AuthorBox'
import { Seo } from '../components/units/common/Seo'
import { PostDetail } from '../components/modules/post/PostDetail'
import { PostTitle } from '../components/modules/post/PostTitle'
import DetailLayout from '../components/layouts/DetailLayout'


const SideArea = ({ tags, post, title }: { tags: any[], post: PostHeadEntity, title: string }) => {
  return (
    <>
      <PostTitle tags={tags} post={post} title={title} />
    </>
  )
}

const MainArea = ({ postDetail }: { postDetail: PostDetailType }) => {
  return (
    <PostDetail postDetail={postDetail} />
  )
}

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default ({ tags, postHead, title, postDetail }: Props) => {
  const postHeadEntity:PostHeadEntity = new PostHeadEntity(postHead);

  return (
    <DetailLayout 
      leftside={
        <Box mt="20px">
          <SideArea tags={tags} post={postHeadEntity} title={title} />
        </Box>
      }
      title={postHeadEntity.title}
      description={postHeadEntity.excerpt || ''}
      slug={postHeadEntity.slug}
    >
      {/* Seoコンポーネントは互換性のために残しておきます */}
      <Seo title={postHeadEntity.title} coverImageUrl={postHeadEntity.coverImageUrl} />
      <Head> <title>{postHeadEntity.title}</title> </Head>
      <Box mt="20px">
        <MainArea postDetail={postDetail} />
      </Box>
      <AuthorBox />
    </DetailLayout>
  )
}

// server側で呼ばれる
export const getStaticPaths = async () => ArticlePageUsecase.getStaticPaths();

// server側で呼ばれる
export const getStaticProps = async ({ params }) => ArticlePageUsecase.getStaticProps({params});
