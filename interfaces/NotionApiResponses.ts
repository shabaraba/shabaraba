export interface IBlock {
    object: 'block';
    id: string;
    created_time: string;
    last_edited_time: string;
    has_children: boolean;
    archived: boolean;
    type: "paragraph" | "heading_1" | "heading_2" | "heading_3" | "bulleted_list_item" | "numbered_list_item" | "to_do" | "toggle" | "child_page" | "child_database" | "embed" | "image" | "video" | "file" | "pdf" | "bookmark" | "callout" | "quote" | "equation" | "divider" | "table_of_contents" | "column" | "column_list" | "link_preview" | "synced_block" | "template" | "link_to_page" | "table" | "table_row" | "unsupported";
}

export interface IRichText {
  plain_text: string;
  href: string;
  annotations: Annotations;
  type: "text" | "mention" | "equation";
}

export interface Annotations {
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

export interface IText extends IRichText {
  text: {
    content?: string;
    link?: string;
  }
}

// TODO
export interface IMention extends IRichText { }
export interface IEquation extends IRichText { }

export interface IParagraphBlock extends IBlock { paragraph: IParagraph }
export interface IParagraph {
  text: IText[],
  children: IBlock[],
}

export interface IHeading1Block extends IBlock { heading_1: IHeading }
export interface IHeading2Block extends IBlock { heading_2: IHeading }
export interface IHeading3Block extends IBlock { heading_3: IHeading }
export interface IHeading extends IBlock {
  text: IText[],
}

export interface ICalloutBlock extends IBlock { callout: ICallout }
export interface ICallout extends IBlock {
  text: IText[];
  icon: IFileFile | IExternalFile | IEmoji;
  children: IBlock[];
}

export interface IFileBlock extends IBlock { file: IFileFile | IExternalFile }
export interface IFileObject {
  type: "file" | "external";
}
export interface IFileFile extends IFileObject { file: IFile }
export interface IFile {
  url: string;
  expiry_time: string;
}
export interface IExternalFile extends IFileObject { external: IExternal }
export interface IExternal {
  url: string;
}

export interface IEmoji {
  emoji: string;
}

export interface ICodeBlock extends IBlock { code: ICode }
export interface ICode {
  text: IText[];
  caption?: IText[];
  language?: "abap" | "arduino" | "bash" | "basic" | "c" | "clojure" | "coffeescript" | "c++" | "c#" | "css" | "dart" | "diff" | "docker" | "elixir" | "elm" | "erlang" | "flow" | "fortran" | "f#" | "gherkin" | "glsl" | "go" | "graphql" | "groovy" | "haskell" | "html" | "java" | "javascript" | "json" | "julia" | "kotlin" | "latex" | "less" | "lisp" | "livescript" | "lua" | "makefile" | "markdown" | "markup" | "matlab" | "mermaid" | "nix" | "objective-c" | "ocaml" | "pascal" | "perl" | "php" | "plain text" | "powershell" | "prolog" | "protobuf" | "python" | "r" | "reason" | "ruby" | "rust" | "sass" | "scala" | "scheme" | "scss" | "shell" | "sql" | "swift" | "typescript" | "vb.net" | "verilog" | "vhdl" | "visual basic" | "webassembly" | "xml" | "yaml" |  "java/c/c++/c#";
}

export interface IImageBlock extends IBlock { image: IFileFile | IExternalFile }

export interface IRetrieveBlockChildrenResponse {
  object: "list";
  results: Array<
    IParagraphBlock |
    IHeading1Block |
    IHeading2Block |
    IHeading3Block |
    ICalloutBlock |
    IFileBlock |
    IImageBlock |
    ICodeBlock
  >;
}
