type _RichTextType = {
  href: string;
  annotations: _AnnotationType;
}

type _AnnotationType = {
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

type _TextType = _RichTextType & { content?: string; link?: string; };
type _ParagraphType = {
  text: _TextType[];
  children: OneBlockType[];
}
type _HeadingType = { text: _TextType[] };
type _CalloutType = _ParagraphType & { icon?: string; }
type _FileFileType = { file: _IFileType }
type _IFileType = {
  type: "file"
  url: string
  caption?: _TextType[]
  expiry_time: string
}
type _ExternalFileType = { external: _ExternalType }
type _ExternalType = {
  type: "external"
  caption?: _TextType[]
  url: string;
}
type _CodeType = {
  text: _TextType[];
  caption?: _TextType[];
  language?: "abap" | "arduino" | "bash" | "basic" | "c" | "clojure" | "coffeescript" | "c++" | "c#" | "css" | "dart" | "diff" | "docker" | "elixir" | "elm" | "erlang" | "flow" | "fortran" | "f#" | "gherkin" | "glsl" | "go" | "graphql" | "groovy" | "haskell" | "html" | "java" | "javascript" | "json" | "julia" | "kotlin" | "latex" | "less" | "lisp" | "livescript" | "lua" | "makefile" | "markdown" | "markup" | "matlab" | "mermaid" | "nix" | "objective-c" | "ocaml" | "pascal" | "perl" | "php" | "plain text" | "powershell" | "prolog" | "protobuf" | "python" | "r" | "reason" | "ruby" | "rust" | "sass" | "scala" | "scheme" | "scss" | "shell" | "sql" | "swift" | "typescript" | "vb.net" | "verilog" | "vhdl" | "visual basic" | "webassembly" | "xml" | "yaml" |  "java/c/c++/c#";
}

type _BookmarkType = {
  siteTitle?: string;
  pageTitle?: string;
  pageDescription?: string;
  siteUrl?: string;
  thumbnailUrl?: string;
}

type _EmbedType = { url: string };

type _BaseBlockType = { id: string; nest: number; }

export type ParagraphBlockType = _BaseBlockType & { type: "paragraph", paragraph: _ParagraphType }
export type Heading1BlockType = _BaseBlockType & { type: "heading_1", heading_1: _HeadingType }
export type Heading2BlockType = _BaseBlockType & { type: "heading_2", heading_2: _HeadingType }
export type Heading3BlockType = _BaseBlockType & { type: "heading_3", heading_3: _HeadingType }
export type CalloutBlockType = _BaseBlockType & { type: "callout", callout: _CalloutType }
export type FileBlockType = _BaseBlockType & { type: "file", file: _FileFileType | _ExternalFileType }
export type CodeBlockType = _BaseBlockType & { type: "code", code: _CodeType }
export type ImageBlockType = _BaseBlockType & { type: "image"; url: string; captions: _TextType[]; }
export type BulletedListItemBlockType = _BaseBlockType & _ParagraphType & {type: "bulletedListItem"}
export type NumberedListItemBlockType = _BaseBlockType & _ParagraphType & { type: "numberedListItem"}
export type QuoteBlockType = _BaseBlockType & _ParagraphType & { type: "quote" }
export type BookmarkBlockType = _BaseBlockType & { type: "bookmark", bookmark: _BookmarkType}
export type EmbedBlockType = _BaseBlockType & {type: "embed", embed: _EmbedType};

export type OneBlockType =
    ParagraphBlockType |
    Heading1BlockType |
    Heading2BlockType |
    Heading3BlockType |
    CodeBlockType |
    CalloutBlockType |
    FileBlockType |
    ImageBlockType |
    BulletedListItemBlockType |
    NumberedListItemBlockType |
    QuoteBlockType |
    BookmarkBlockType |
    EmbedBlockType
