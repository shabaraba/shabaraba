import { PostDetailService } from "application/modules/post/services/PostDetailService";
import { PostHeadService } from "application/modules/post/services/PostHeadService";
import { TagService } from "application/modules/tag/services/TagService";
import { PostDetailDxo } from "core/dxo/PostDetailDxo";
import { PostHeadDxo } from "core/dxo/PostHeadDxo";
import { ArticleServiceFactory } from "core/factories/ArticleServiceFactory";
import { PostDetailType } from "core/types/PostDetailType";
import { PostHeadType } from "core/types/PostHeadType";
import { StaticProps } from "core/types/PostPageType";

export class ArticlePageUsecase {
  public static async getStaticPaths() {
    try {
      const postHeadService = ArticleServiceFactory.createArticleHeadService();
      const pathParams = await postHeadService.getPathParams();
      return {
        paths: pathParams,
        fallback: false,
      };
    } catch (error) {
      console.error("Error generating static paths:", error);
      return {
        paths: [],
        fallback: false, // blockingから変更
      };
    }
  }

  public static async getStaticProps({ params }): Promise<any> {
    const slug = params.id;

    try {
      const articleService = ArticleServiceFactory.createArticleService();
      const articleHeadService = ArticleServiceFactory.createArticleHeadService();
      const articleHead = articleHeadService.getBySlug(slug);
      const article = await articleService.getArticleBySlug(slug);

      return {
        props: {
          article,
        },
      };
    } catch (error) {
      console.error(`Error fetching article with slug "${slug}":`, error);
      return {
        notFound: true,
      };
    }
  }
}

