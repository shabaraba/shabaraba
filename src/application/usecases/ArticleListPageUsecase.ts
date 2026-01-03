
import { PostHeadDto } from "application/modules/post/objects/dtos/PostHeadDto";
import { PostHeadDxo } from "core/dxo/PostHeadDxo";
import { PostHeadType } from "core/types/PostHeadType";
import { StaticProps } from "core/types/PostListPageType";
import { PostHeadService } from "application/modules/post/services/PostHeadService";

export class ArticleListPageUsecase {
  public static async getStaticProps(): Promise<StaticProps> {
    const postHeadService = new PostHeadService();
    const postHeadDtoList: PostHeadDto[] = await postHeadService.getList();
    const postHeadEntityList: PostHeadType[] = postHeadDtoList.map(postHeadDto => PostHeadDxo.convertForPages(postHeadDto));

    return {
      props: {
        allPostsData: postHeadEntityList,
      },
      // revalidate: 1 * 60
    }
  }

}