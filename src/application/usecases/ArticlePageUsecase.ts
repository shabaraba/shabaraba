import { PostDetailService } from "application/modules/post/services/PostDetailService";
import { PostHeadService } from "application/modules/post/services/PostHeadService";
import { TagService } from "application/modules/tag/services/TagService";
import { PostDetailDxo } from "core/dxo/PostDetailDxo";
import { PostHeadType, PostHeadDxo } from "core/dxo/PostHeadDxo";

export class ArticlePageUsecase {
  public static async getStaticPaths() {
    const postHeadService = new PostHeadService();
    const pathParams = await postHeadService.getPathParams();
    return {
      paths: pathParams,
      fallback: false
    }
  }

  public static async getStaticProps({ params }) {
    const slug = params.id;

    const postHeadService = new PostHeadService();
    const postHeadDto = await postHeadService.getBySlug(slug);
    const postHeadJson: PostHeadType = PostHeadDxo.convertForPages(postHeadDto);
    const postDetailService = new PostDetailService();
    const postDetailDto = await postDetailService.get(postHeadDto.id);
    const postDetailEntity = PostDetailDxo.convertForPages(postDetailDto);

    const tagService = new TagService();
    const tags = await tagService.getListByPost(postHeadDto);

    return {
      props: {
        tags: tags,
        postHead: postHeadJson,
        postDetail: postDetailEntity,
        title: postHeadDto.title
      },
      // revalidate: 1 * 60
    }
  }
}