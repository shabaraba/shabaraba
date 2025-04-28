type _IBlock = {
    object: 'block';
    id: string;
    created_time: string;
    last_edited_time: string;
    has_children: boolean;
    archived: boolean;
}

type _IRichText = {
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

export type IText = _IRichText & {
  text: {
    content?: string;
    link?: string;
  }
}

// TODO
export type IMention = _IRichText
export type IEquation = _IRichText & { type: "equation" }

export type IParagraphBlock = _IBlock & { type: "paragraph", paragraph: _IParagraph }
type _IParagraph = { rich_text: IText[], children: IRetrieveBlockChildrenResponse }

export type IHeading1Block = _IBlock & { type: "heading_1", heading_1: _IHeading }
export type IHeading2Block = _IBlock & { type: "heading_2", heading_2: _IHeading }
export type IHeading3Block = _IBlock & { type: "heading_3", heading_3: _IHeading }
type _IHeading = { rich_text: IText[] }

export type ICalloutBlock = _IBlock & { type: "callout", callout: _ICallout }
type _IIcon = IFileFile | IExternalFile | IEmoji
type _ICallout = _IParagraph & { icon: _IIcon }

export type IFileBlock = _IBlock & { type: "file", file: IFileFile | IExternalFile }
export type IFileFile = { file: _IFile }
type _IFile = {
  type: "file"
  url: string
  caption?: IText[]
  expiry_time: string
}
export type IExternalFile = { external: _IExternal }
type _IExternal = {
  type: "external"
  caption?: IText[]
  url: string;
}

export type IEmoji = { emoji: string; }

export type ICodeBlock = _IBlock & { type: "code", code: _ICode }
type _ICode = {
  rich_text: IText[];
  caption?: IText[];
  language?: "abap" | "arduino" | "bash" | "basic" | "c" | "clojure" | "coffeescript" | "c++" | "c#" | "css" | "dart" | "diff" | "docker" | "elixir" | "elm" | "erlang" | "flow" | "fortran" | "f#" | "gherkin" | "glsl" | "go" | "graphql" | "groovy" | "haskell" | "html" | "java" | "javascript" | "json" | "julia" | "kotlin" | "latex" | "less" | "lisp" | "livescript" | "lua" | "makefile" | "markdown" | "markup" | "matlab" | "mermaid" | "nix" | "objective-c" | "ocaml" | "pascal" | "perl" | "php" | "plain text" | "powershell" | "prolog" | "protobuf" | "python" | "r" | "reason" | "ruby" | "rust" | "sass" | "scala" | "scheme" | "scss" | "shell" | "sql" | "swift" | "typescript" | "vb.net" | "verilog" | "vhdl" | "visual basic" | "webassembly" | "xml" | "yaml" |  "java/c/c++/c#";
}

export type IImageBlock = _IBlock & {
  type: "image"
  image: _IFile | _IExternal
}

export type IBulletedListItemBlock = _IBlock & { type: "bulleted_list_item", bulleted_list_item: _IParagraph}
export type INumberedListItemBlock = _IBlock & { type: "numbered_list_item", numbered_list_item: _IParagraph}
export type IQuoteBlock = _IBlock & { type: "quote", quote: _IParagraph}

export type IBookmarkBlock = _IBlock & { type: "bookmark", bookmark: _IBookmark}
type _IBookmark = {
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

export type IEmbedBlock = _IBlock & {type: "embed", embed: _IEmbed}
type _IEmbed = {
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

