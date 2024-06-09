type _RichTextType = {
  href?: string;
  annotations?: _AnnotationType;
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

type ParagraphType = {
  texts: TextType[];
  children?: SomeoneBlockType[];
}
type HeadingType = { texts: TextType[] };
type CalloutType = ParagraphType & { icon?: string; }
type FileFileType = { file: IFileType }
type IFileType = {
  type: "file"
  url: string
  caption?: TextType[]
  expiry_time: string
}
type ExternalFileType = { external: ExternalType }
type ExternalType = {
  type: "external"
  caption?: TextType[]
  url: string;
}
type CodeType = {
  texts: TextType[];
  caption?: TextType[];
  language?: "abap" | "arduino" | "bash" | "basic" | "c" | "clojure" | "coffeescript" | "c++" | "c#" | "css" | "dart" | "diff" | "docker" | "elixir" | "elm" | "erlang" | "flow" | "fortran" | "f#" | "gherkin" | "glsl" | "go" | "graphql" | "groovy" | "haskell" | "html" | "java" | "javascript" | "json" | "julia" | "kotlin" | "latex" | "less" | "lisp" | "livescript" | "lua" | "makefile" | "markdown" | "markup" | "matlab" | "mermaid" | "nix" | "objective-c" | "ocaml" | "pascal" | "perl" | "php" | "plain text" | "powershell" | "prolog" | "protobuf" | "python" | "r" | "reason" | "ruby" | "rust" | "sass" | "scala" | "scheme" | "scss" | "shell" | "sql" | "swift" | "typescript" | "vb.net" | "verilog" | "vhdl" | "visual basic" | "webassembly" | "xml" | "yaml" | "java/c/c++/c#";
}

type BookmarkType = {
  siteTitle?: string;
  pageTitle?: string;
  pageDescription?: string;
  siteUrl?: string;
  thumbnailUrl?: string;
}

type BulletedListItemType = ParagraphType;
type NumberedListItemType = ParagraphType;
type BulletedListType = { listItem: BulletedListItemBlockType[]; };
type NumberedListType = { listItem: NumberedListItemBlockType[]; };
type ImageType = { url: string; captions: TextType[]; }
type QuoteType = ParagraphType;
type EmbedType = { url: string };

type BaseBlockType = { id: string; nest: number; }

export type TextType = _RichTextType & { content?: string; link?: string; };
export type ParagraphBlockType = BaseBlockType & { type: "Paragraph", content: ParagraphType };
export type Heading1BlockType = BaseBlockType & { type: "Heading1", content: HeadingType };
export type Heading2BlockType = BaseBlockType & { type: "Heading2", content: HeadingType };
export type Heading3BlockType = BaseBlockType & { type: "Heading3", content: HeadingType };
export type CalloutBlockType = BaseBlockType & { type: "Callout", content: CalloutType };
export type FileBlockType = BaseBlockType & { type: "File", content: FileFileType | ExternalFileType };
export type CodeBlockType = BaseBlockType & { type: "Code", content: CodeType };
export type ImageBlockType = BaseBlockType & { type: "Image"; content: ImageType };
export type BulletedListItemBlockType = BaseBlockType & { type: "BulletedListItem"; content: BulletedListItemType };
export type NumberedListItemBlockType = BaseBlockType & { type: "NumberedListItem"; content: NumberedListItemType };
export type BulletedListBlockType = BaseBlockType & { type: "BulletedList"; content: BulletedListType };
export type NumberedListBlockType = BaseBlockType & { type: "NumberedList"; content: NumberedListType };
export type QuoteBlockType = BaseBlockType & { type: "Quote"; content: QuoteType };
export type BookmarkBlockType = BaseBlockType & { type: "Bookmark", content: BookmarkType };
export type EmbedBlockType = BaseBlockType & { type: "Embed", content: EmbedType };

export type SomeoneBlockType =
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
  BulletedListBlockType |
  NumberedListBlockType |
  QuoteBlockType |
  BookmarkBlockType |
  EmbedBlockType

export type SomeoneType =
  TextType |
  ParagraphType |
  HeadingType |
  CalloutType |
  FileFileType |
  ExternalFileType |
  CodeType |
  ImageType |
  BulletedListItemType |
  NumberedListItemType |
  BulletedListType |
  NumberedListType |
  QuoteType |
  BookmarkType |
  EmbedType 
