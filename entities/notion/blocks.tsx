import * as NotionBlockInterfaces from '../../interfaces/NotionApiResponses';
import axios from 'axios'
import parse from 'html-react-parser';

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

  static deserialize(input: any) {
    const data: any[] = JSON.parse(input)
    console.log(data)
    const blockList = data.map(item => {
      console.log(item)
      // let itemType = item.type;
    })
    return new BlockList(data)
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
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IParagraphBlock) {
    super(resp.id);
    this.type = "Paragraph";

    this.texts = [];
    resp.paragraph.text.map( (text) => {
      this.texts.push( new Text(text) )
    });
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

export class BulletedListItem extends Paragraph {
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
    super(paragraph);
    this.type = "BulletedListItem";
  }
}

export class Bookmark extends Block {
  public url: string
  public siteTitle?: string
  public pageTitle?: string
  public imageUrl?: string

  constructor(resp: NotionBlockInterfaces.IBookmarkBlock) {
    super(resp.id);
    this.type = "Bookmark";
    this.url = resp.bookmark.url
  }

  public getOGP() {
    axios.get(this.url)
      .then( res => {
        parse(res.data, {replace: domNode => {
            // console.dir(domNode, { depth: null })
          }})
      })
      // .then( text => {
      //   const el = parser.parseFromString(text, "text/html")
      //   const headEls = (el.head.children)
      //   console.log(JSON.stringify(headEls))
      //   Array.from(headEls).map(v => {
      //       const prop = v.getAttribute('property')
      //       if (!prop) return;
      //       console.log(prop, v.getAttribute("content"))
      //   })
      // })
  }
}
