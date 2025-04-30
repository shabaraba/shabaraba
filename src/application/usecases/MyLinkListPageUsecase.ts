import { MyLinkDto } from "application/modules/mylink/objects/dtos/MyLinkDto";
import { MyLinkService } from "application/modules/mylink/services/MyLinkService";
import { MyLinkDxo } from "core/dxo/MyLinkDxo";
import { StaticProps } from "core/types/MyLinkListPageType";
import { MyLinkType } from "core/types/MyLinkType";
import { PaginatedData } from "../../services/CommonDataService"; // 追加

export class MyLinkListPageUsecase {
  /**
   * 通常の静的ページ生成用データ取得関数
   */
  public static async getStaticProps(): Promise<StaticProps> {
    const mylinkService = new MyLinkService();
    const myLinkDtoList: MyLinkDto[] = await mylinkService.getList();
    const myLinkEntityList: MyLinkType[] = myLinkDtoList.map(myLinkDto => MyLinkDxo.convertForPages(myLinkDto));

    return {
      props: {
        allData: myLinkEntityList,
      },
      // revalidate: 1 * 60
    }
  }

  /**
   * ページネーション対応の静的ページ生成用データ取得関数
   * @param page ページ番号
   * @param pageSize 1ページあたりの表示件数
   */
  public static async getPaginatedData(page: number = 1, pageSize: number = 10): Promise<PaginatedData & { allData: any[] }> {
    // マイリンク一覧の取得
    const mylinkService = new MyLinkService();
    const myLinkDtoList: MyLinkDto[] = await mylinkService.getList();
    const myLinkEntityList: MyLinkType[] = myLinkDtoList.map(myLinkDto => MyLinkDxo.convertForPages(myLinkDto));
    
    // 全件数
    const totalItems = myLinkEntityList.length;
    
    // 合計ページ数
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // ページ内のデータ抽出
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedItems = myLinkEntityList.slice(startIndex, endIndex);
    
    return {
      items: paginatedItems,
      allData: paginatedItems, // StaticPropsの型に合わせて互換性を持たせる
      totalItems,
      pageSize,
      currentPage: page,
      totalPages
    };
  }
}