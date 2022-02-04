import * as NotionBlockInterfaces from '../../interfaces/NotionApiResponses';

export abstract class Block {
  constructor() {}

  get type() {
    return this.constructor.name;
  }
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
    super();
    this.texts = [];
    resp.paragraph.text.map( (text) => {
      this.texts.push( new Text(text) )
    });
  }
}

export class Heading1 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading1Block) {
    super();
    this.texts = [];
    resp.heading_1.text.map( (text) => {
      this.texts.push( new Text(text) )
    });
  }
}

export class Heading2 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading2Block) {
    super();
    this.texts = [];
    resp.heading_2.text.map( (text) => {
      this.texts.push( new Text(text) )
    });
  }
}

export class Heading3 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading3Block) {
    super();
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
    super();
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
    super();
    const fileType = resp.image.type;
    this.url = resp.image[fileType].url;
  }
}

export class Callout extends Block {
  public texts: Text[];
  public icon?: string;

  constructor(resp: NotionBlockInterfaces.ICalloutBlock) {
    super();
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
