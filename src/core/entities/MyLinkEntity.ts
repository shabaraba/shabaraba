import { MyLinkType } from "core/types/MyLinkType";

type Props = MyLinkType;

export class MyLinkEntity {
  public id: string;
  public url: string;
  public tags: any; // TODO:
  public title: string;

  constructor({ id, title, url, tags }: Props) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.tags = tags;
  }
}