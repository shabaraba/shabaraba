export type IBlock = {
    object: 'block';
    id: string;
    created_time: string;
    last_edited_time: string;
    has_children: boolean;
    archived: boolean;
}

export type IRichText = {
  plain_text: string;
  href: string;
  annotations: Annotations;
  type: "text" | "mention" | "equation";
}

export type Annotations = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color:
    "default" |
    "gray" |
    "brown" |
    "orange" |
    "yellow" |
    "green" |
    "blue" |
    "purple" |
    "pink" |
    "red" |
    "gray_background" |
    "brown_background" |
    "orange_background" |
    "yellow_background" |
    "green_background" |
    "blue_background" |
    "purple_background" |
    "pink_background" |
    "red_background"
  ;
}

export type IText = IRichText & {
  text: {
    content?: string;
    link?: string;
  }
}

// TODO
export type IMention = IRichText
export type IEquation = IRichText & { type: "equation" }

export type IParagraphBlock = IBlock & { type: "paragraph", paragraph: IParagraph }
export type IParagraph = {
  text: IText[],
  children: IRetrieveBlockChildrenResponse
}

export type IHeading1Block = IBlock & { type: "heading_1", heading_1: IHeading }
export type IHeading2Block = IBlock & { type: "heading_2", heading_2: IHeading }
export type IHeading3Block = IBlock & { type: "heading_3", heading_3: IHeading }
export type IHeading = {
  text: IText[],
}

export type ICalloutBlock = IBlock & { type: "callout", callout: ICallout }
export type IIcon = IFileFile | IExternalFile | IEmoji
export type ICallout = IParagraph & {
  icon: IIcon
}

export type IFileBlock = IBlock & { type: "file", file: IFileFile | IExternalFile }
export type IFileFile = { file: IFile }
export type IFile = {
  type: "file"
  url: string
  expiry_time: string
}
export type IExternalFile = { external: IExternal }
export type IExternal = {
  type: "external"
  url: string;
}

export type IEmoji = {
  emoji: string;
}

export type ICodeBlock = IBlock & { type: "code", code: ICode }
export type ICode = {
  text: IText[];
  caption?: IText[];
  language?: "abap" | "arduino" | "bash" | "basic" | "c" | "clojure" | "coffeescript" | "c++" | "c#" | "css" | "dart" | "diff" | "docker" | "elixir" | "elm" | "erlang" | "flow" | "fortran" | "f#" | "gherkin" | "glsl" | "go" | "graphql" | "groovy" | "haskell" | "html" | "java" | "javascript" | "json" | "julia" | "kotlin" | "latex" | "less" | "lisp" | "livescript" | "lua" | "makefile" | "markdown" | "markup" | "matlab" | "mermaid" | "nix" | "objective-c" | "ocaml" | "pascal" | "perl" | "php" | "plain text" | "powershell" | "prolog" | "protobuf" | "python" | "r" | "reason" | "ruby" | "rust" | "sass" | "scala" | "scheme" | "scss" | "shell" | "sql" | "swift" | "typescript" | "vb.net" | "verilog" | "vhdl" | "visual basic" | "webassembly" | "xml" | "yaml" |  "java/c/c++/c#";
}

export type IImageBlock = IBlock & { type: "image", image: IFile| IExternal}

export type IBulletedListItemBlock = IBlock & { type: "bulleted_list_item", bulleted_list_item: IParagraph}
export type INumberedListItemBlock = IBlock & { type: "numbered_list_item", numbered_list_item: IParagraph}
export type IQuoteBlock = IBlock & { type: "quote", quote: IParagraph}

export type IBookmarkBlock = IBlock & { type: "bookmark", bookmark: IBookmark}
export type IBookmark = {
  url: string
  caption?: IText[]
  ogp?: IOgp // 取得時は存在しない、後から取得する

}
export type IOgp = {
  siteTitle?: string
  pageTitle?: string
  pageDescription?: string
  siteUrl?: string
  thumbnailUrl?: string
}

export type IEmbedBlock = IBlock & {type: "embed", embed: IEmbed}
export type IEmbed = {
  url: string
}

export type BlockType =
    IParagraphBlock |
    IHeading1Block |
    IHeading2Block |
    IHeading3Block |
    ICodeBlock |
    ICalloutBlock |
    IFileBlock |
    IImageBlock |
    IBulletedListItemBlock |
    INumberedListItemBlock |
    IQuoteBlock |
    IBookmarkBlock |
    IEmbedBlock

export type IRetrieveBlockChildrenResponse = {
  object: "list";
  results: BlockType[];
}

