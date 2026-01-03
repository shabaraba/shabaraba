import { PostDetailService } from "application/modules/post/services/PostDetailService";
import { PostHeadService } from "application/modules/post/services/PostHeadService";
import { TagService } from "application/modules/tag/services/TagService";
import { PostDetailDxo } from "core/dxo/PostDetailDxo";
import { PostHeadDxo } from "core/dxo/PostHeadDxo";
import { ArticleServiceFactory } from "core/factories/ArticleServiceFactory";
import { PostDetailType } from "core/types/PostDetailType";
import { PostHeadType } from "core/types/PostHeadType";
import { StaticProps } from "core/types/PostPageType";
import { CommonDataService } from "../../services/CommonDataService";

export class ArticlePageUsecase {
  public static async getStaticPaths() {
    try {
      console.log('[ArticlePageUsecase.getStaticPaths] ARTICLE_SOURCE:', process.env.ARTICLE_SOURCE);
      const postHeadService = ArticleServiceFactory.createArticleHeadService();
      const pathParams = await postHeadService.getPathParams();
      console.log('[ArticlePageUsecase.getStaticPaths] Generated paths:', JSON.stringify(pathParams, null, 2));
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
      
      // サイドバーデータを取得
      const sidebarData = await CommonDataService.getSidebarData();
      
      // JSONシリアライズ時のundefinedプロパティを処理
      const sanitizedArticle = this.sanitizeUndefinedValues(article);
      
      // シリアライズエラーをデバッグするための追加処理
      try {
        // 一度JSONにシリアライズしてから戻すことで、シリアライズできない値を除去
        const serialized = JSON.stringify(sanitizedArticle);
        const deserialized = JSON.parse(serialized);
        
        return {
          props: {
            article: deserialized,
            sidebarData: sidebarData,
          },
        };
      } catch (serializeError) {
        console.error('Serialization error:', serializeError);
        
        // エラー発生時はNullish値をすべて空オブジェクトに変換する緊急措置
        const emergencySanitized = JSON.parse(
          JSON.stringify(sanitizedArticle, (_, value) => 
            value === undefined ? null : value
          )
        );
        
        return {
          props: {
            article: emergencySanitized,
            sidebarData: sidebarData,
          },
        };
      }
    } catch (error) {
      console.error(`Error fetching article with slug "${slug}":`, error);
      return {
        notFound: true,
      };
    }
  }
  
  /**
   * オブジェクト内のundefined値をnullに変換
   * Next.jsのgetStaticPropsではundefined値を含むオブジェクトをJSONシリアライズできないため
   */
  private static sanitizeUndefinedValues(obj: any): any {
    if (obj === undefined) {
      return null; // undefinedをnullに変換
    }
    
    if (obj === null || typeof obj !== 'object') {
      return obj; // nullか非オブジェクトの場合はそのまま返す
    }
    
    if (Array.isArray(obj)) {
      // 配列の場合は各要素を再帰的に処理
      return obj.map(item => this.sanitizeUndefinedValues(item));
    }
    
    // オブジェクトの場合はプロパティごとに再帰的に処理
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = this.sanitizeUndefinedValues(obj[key]);
      }
    }
    return result;
  }
}

