import * as NotionBlockInterfaces from '../../interfaces/NotionApiResponses';

export class BlockList {
  public data:Block[]

  constructor(data?: Block[]) {
    if (data == null) {
      this.data = []
    } else {
      this.data = data
    }
  }

  public append(block: Block) {
    this.data.push(block)
  }

  public serialize() {
    return JSON.stringify(this.data)
  }

  static deserialize(input: NotionBlockInterfaces.BlockType[]): BlockList {
    let isInBulletedList: boolean = false
    let isInNumberedList: boolean = false

    let bulletedList = new BulletedList("id")
    let numberedList = new NumberedList("id")

    let blocks: BlockList = new BlockList()
    input.map((item: NotionBlockInterfaces.BlockType) => {

      if (isInBulletedList && item.type != 'bulleted_list_item') {
        isInBulletedList = false
        blocks.append(bulletedList)
        bulletedList = new BulletedList("id")
      }
      if (isInNumberedList && item.type != 'numbered_list_item') {
        isInNumberedList = false
        blocks.append(numberedList)
        numberedList = new NumberedList("id")
      }

      switch (item.type) {
        case 'paragraph':
          blocks.append(new Paragraph(item as NotionBlockInterfaces.IParagraphBlock));
          break;
        case 'heading_1':
          blocks.append(new Heading1(item as NotionBlockInterfaces.IHeading1Block));
          break;
        case 'heading_2':
          blocks.append(new Heading2(item as NotionBlockInterfaces.IHeading2Block));
          break;
        case 'heading_3':
          blocks.append(new Heading3(item as NotionBlockInterfaces.IHeading3Block));
          break;
        case 'callout':
          blocks.append(new Callout(item as NotionBlockInterfaces.ICalloutBlock));
          break;
        case 'code':
          blocks.append(new Code(item as NotionBlockInterfaces.ICodeBlock));
          break;
        case 'image':
          blocks.append(new Image(item as NotionBlockInterfaces.IImageBlock));
          break;
        case 'bookmark':
          blocks.append(new Bookmark(item as NotionBlockInterfaces.IBookmarkBlock));
          break;
        case 'bulleted_list_item':
          isInBulletedList = true
          // console.log(item.bulleted_list_item.text[0].plain_text)
          bulletedList.appendItem(new BulletedListItem(item as NotionBlockInterfaces.IBulletedListItemBlock))
          break;
        case 'numbered_list_item':
          isInNumberedList = true
          numberedList.appendItem(new NumberedListItem(item as NotionBlockInterfaces.INumberedListItemBlock))
          break;
        case 'quote':
          blocks.append(new Quote(item as NotionBlockInterfaces.IQuoteBlock));
          break;
        // case 'table':
          // break;
        default:
          break;
      }
    })
    if (isInBulletedList) {
      isInBulletedList = false
      blocks.append(bulletedList)
    }
    if (isInNumberedList) {
      isInNumberedList = false
      blocks.append(numberedList)
    }

    return blocks;
  }
}

export abstract class Block {
  public id: string;
  public type: string;
  constructor(id: string) {
    this.id = id
  }

  // minifyするとクラス名が変わるので、クラス名からブロックの種別を
  // 判断させるのは無理
}

export class Text {
  public href: string;
  public annotations: NotionBlockInterfaces.Annotations;
  public content: string;
  public link: string;

  constructor(text: NotionBlockInterfaces.IText) {
    this.href = text.href;
    this.annotations = text.annotations;
    this.content = text.text.content;
    this.link = text.text.link;
  }
}

export class Paragraph extends Block {
  public texts: Text[]
  public children: Block[]

  constructor(resp: NotionBlockInterfaces.IParagraphBlock) {
    super(resp.id)
    this.type = "Paragraph"

    this.texts = []
    resp.paragraph.text.map( (text: NotionBlockInterfaces.IText) => {
      this.texts.push( new Text(text) )
    })
    this.children = []
    if (resp.paragraph.children?.results?.length > 0) {
      console.log("---------nest in-----------")
      console.log(JSON.stringify(resp.paragraph.children, null, ' '))
      const childBlockList = BlockList.deserialize(resp.paragraph.children.results)
      this.children = childBlockList.data
      // console.log(JSON.stringify(childBlockList, null, ' '))
      console.log("---------nest out-----------")
    }
  }
}

export class Heading1 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading1Block) {
    super(resp.id);
    this.type = "Heading1";

    this.texts = [];
    resp.heading_1.text.map( (text) => {
      this.texts.push( new Text(text) )
    });
  }
}

export class Heading2 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading2Block) {
    super(resp.id);
    this.type = "Heading2";

    this.texts = [];
    resp.heading_2.text.map( (text) => {
      this.texts.push( new Text(text) )
    });
  }
}

export class Heading3 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading3Block) {
    super(resp.id);
    this.type = "Heading3";

    this.texts = [];
    resp.heading_3.text.map( (text) => {
      this.texts.push( new Text(text) )
    });
  }
}

export class Code extends Block {
  public texts: Text[];
  public captions?: Text[];
  public language?: "abap" | "arduino" | "bash" | "basic" | "c" | "clojure" | "coffeescript" | "c++" | "c#" | "css" | "dart" | "diff" | "docker" | "elixir" | "elm" | "erlang" | "flow" | "fortran" | "f#" | "gherkin" | "glsl" | "go" | "graphql" | "groovy" | "haskell" | "html" | "java" | "javascript" | "json" | "julia" | "kotlin" | "latex" | "less" | "lisp" | "livescript" | "lua" | "makefile" | "markdown" | "markup" | "matlab" | "mermaid" | "nix" | "objective-c" | "ocaml" | "pascal" | "perl" | "php" | "plain text" | "powershell" | "prolog" | "protobuf" | "python" | "r" | "reason" | "ruby" | "rust" | "sass" | "scala" | "scheme" | "scss" | "shell" | "sql" | "swift" | "typescript" | "vb.net" | "verilog" | "vhdl" | "visual basic" | "webassembly" | "xml" | "yaml" |  "java/c/c++/c#";

  constructor(resp: NotionBlockInterfaces.ICodeBlock) {
    super(resp.id);
    this.type = "Code";

    this.texts = [];
    resp.code.text.map( (text: NotionBlockInterfaces.IText) => {
      this.texts.push( new Text(text) )
    });
    this.captions = [];
    resp.code.caption?.map( (caption: NotionBlockInterfaces.IText) => {
      this.captions.push( new Text(caption) )
    });
    this.language = resp.code.language;
  }
}

export class Image extends Block {
  public url: string;

  constructor(resp: NotionBlockInterfaces.IImageBlock) {
    super(resp.id);
    this.type = "Image";

    const fileType = resp.image.type;
    this.url = resp.image[fileType].url;
  }
}

export class Callout extends Paragraph {
  public icon?: string;

  constructor(resp: NotionBlockInterfaces.ICalloutBlock) {
    const paragraph: NotionBlockInterfaces.IParagraphBlock = {
      object: 'block',
      id: resp.id,
      created_time: resp.created_time,
      last_edited_time: resp.last_edited_time,
      has_children: resp.has_children,
      archived: resp.archived,
      type: "paragraph",
      paragraph: {
        text: resp.callout.text,
        children: resp.callout.children,
      }
    }
    super(paragraph);
    this.type = "Callout";

    this.texts = [];
    resp.callout.text.map( (text: NotionBlockInterfaces.IText) => {
      this.texts.push( new Text(text) )
    });

    this.icon = null;
    if ('emoji' in resp.callout.icon) {
      this.icon = resp.callout.icon.emoji;
    }
  }
}

export class Quote extends Paragraph {
  constructor(resp: NotionBlockInterfaces.IQuoteBlock) {
    const paragraph: NotionBlockInterfaces.IParagraphBlock = {
      object: 'block',
      id: resp.id,
      created_time: resp.created_time,
      last_edited_time: resp.last_edited_time,
      has_children: resp.has_children,
      archived: resp.archived,
      type: "paragraph",
      paragraph: {
        text: resp.quote.text,
        children: resp.quote.children,
      }
    }
    super(paragraph);
    this.type = "Quote";
  }
}

export class List extends Block {
  public listItem: ListItem[] = []

  constructor(id: string) {
    super(id)
  }

  public appendItem(item: ListItem) {
    this.listItem.push(item)
  }
}

export class ListItem extends Paragraph {
  constructor(resp: NotionBlockInterfaces.IParagraphBlock) {
    super(resp)
  }
}

export class BulletedList extends List {
  constructor(id: string) {
    super(id);
    this.type = "BulletedList";
  }
}

export class BulletedListItem extends ListItem {
  constructor(resp: NotionBlockInterfaces.IBulletedListItemBlock) {
    const paragraph: NotionBlockInterfaces.IParagraphBlock = {
      object: 'block',
      id: resp.id,
      created_time: resp.created_time,
      last_edited_time: resp.last_edited_time,
      has_children: resp.has_children,
      archived: resp.archived,
      type: "paragraph",
      paragraph: {
        text: resp.bulleted_list_item.text,
        children: resp.bulleted_list_item.children,
      }
    }
    // console.log("----------------------------------")
    super(paragraph);
    this.type = "BulletedListItem";
    // console.log(paragraph)
    // console.log(JSON.stringify(this, null, " "))
  }
}

export class NumberedList extends List {
  constructor(id: string) {
    super(id);
    this.type = "NumberedList";
  }
}

export class NumberedListItem extends Paragraph {
  constructor(resp: NotionBlockInterfaces.INumberedListItemBlock) {
    const paragraph: NotionBlockInterfaces.IParagraphBlock = {
      object: 'block',
      id: resp.id,
      created_time: resp.created_time,
      last_edited_time: resp.last_edited_time,
      has_children: resp.has_children,
      archived: resp.archived,
      type: "paragraph",
      paragraph: {
        text: resp.numbered_list_item.text,
        children: resp.numbered_list_item.children,
      }
    }
    super(paragraph);
    this.type = "NumberedListItem";
  }
}

export class Bookmark extends Block {
  public siteTitle?: string
  public pageTitle?: string
  public pageDescription?: string
  public siteUrl?: string
  public thumbnailUrl?: string

  constructor(resp: NotionBlockInterfaces.IBookmarkBlock) {
    super(resp.id);
    this.type = "Bookmark";
    this.siteUrl = resp.bookmark.url
    this.siteTitle = resp.bookmark.ogp.siteTitle
    this.pageTitle = resp.bookmark.ogp.pageTitle
    this.pageDescription = resp.bookmark.ogp.pageDescription
    this.thumbnailUrl = resp.bookmark.ogp.thumbnailUrl
  }

}
