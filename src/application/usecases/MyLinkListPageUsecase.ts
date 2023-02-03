import { MyLinkDto } from "application/modules/mylink/objects/dtos/MyLinkDto";
import { MyLinkService } from "application/modules/mylink/services/MyLinkService";
import { MyLinkDxo } from "core/dxo/MyLinkDxo";
import { StaticProps } from "core/types/MyLinkListPageType";
import { MyLinkType } from "core/types/MyLinkType";

export class MyLinkListPageUsecase {
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

}