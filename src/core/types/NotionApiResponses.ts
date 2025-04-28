// ========== Common Types ==========
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

// ========== Database & Page Property Types ==========
export type IDatabaseResponse = {
  object: "database";
  id: string;
  cover: IExternalFile | IFileFile | null;
  icon: IEmoji | IExternalFile | IFileFile | null;
  created_time: string;
  last_edited_time: string;
  title: IText[];
  description: IText[];
  properties: {
    [key: string]: IDatabaseProperty;
  };
  parent: {
    type: "workspace" | "page" | "block";
    workspace?: boolean;
    page_id?: string;
    block_id?: string;
  };
  url: string;
  archived: boolean;
}

export type IDatabaseProperty = 
  | ITitleProperty
  | IRichTextProperty
  | INumberProperty
  | ISelectProperty
  | IMultiSelectProperty
  | IDateProperty
  | IPeopleProperty
  | IFilesProperty
  | ICheckboxProperty
  | IUrlProperty
  | IEmailProperty
  | IPhoneNumberProperty
  | IFormulaProperty
  | IRelationProperty
  | IRollupProperty
  | ICreatedTimeProperty
  | ICreatedByProperty
  | ILastEditedTimeProperty
  | ILastEditedByProperty;

export type ITitleProperty = {
  id: string;
  name: string;
  type: "title";
  title: {};
}

export type IRichTextProperty = {
  id: string;
  name: string;
  type: "rich_text";
  rich_text: {};
}

export type INumberProperty = {
  id: string;
  name: string;
  type: "number";
  number: {
    format?: "number" | "number_with_commas" | "percent" | "dollar" | "euro" | "pound" | "yen" | "ruble" | "rupee" | "won" | "yuan";
  };
}

export type ISelectProperty = {
  id: string;
  name: string;
  type: "select";
  select: {
    options: {
      id: string;
      name: string;
      color: string;
      description?: string;
    }[];
  };
}

export type IMultiSelectProperty = {
  id: string;
  name: string;
  type: "multi_select";
  multi_select: {
    options: {
      id: string;
      name: string;
      color: string;
      description?: string;
    }[];
  };
}

export type IDateProperty = {
  id: string;
  name: string;
  type: "date";
  date: {};
}

export type IPeopleProperty = {
  id: string;
  name: string;
  type: "people";
  people: {};
}

export type IFilesProperty = {
  id: string;
  name: string;
  type: "files";
  files: {};
}

export type ICheckboxProperty = {
  id: string;
  name: string;
  type: "checkbox";
  checkbox: {};
}

export type IUrlProperty = {
  id: string;
  name: string;
  type: "url";
  url: {};
}

export type IEmailProperty = {
  id: string;
  name: string;
  type: "email";
  email: {};
}

export type IPhoneNumberProperty = {
  id: string;
  name: string;
  type: "phone_number";
  phone_number: {};
}

export type IFormulaProperty = {
  id: string;
  name: string;
  type: "formula";
  formula: {
    expression: string;
  };
}

export type IRelationProperty = {
  id: string;
  name: string;
  type: "relation";
  relation: {
    database_id: string;
    type?: "single_property";
    single_property?: {};
  };
}

export type IRollupProperty = {
  id: string;
  name: string;
  type: "rollup";
  rollup: {
    relation_property_name: string;
    relation_property_id: string;
    rollup_property_name: string;
    rollup_property_id: string;
    function: string;
  };
}

export type ICreatedTimeProperty = {
  id: string;
  name: string;
  type: "created_time";
  created_time: {};
}

export type ICreatedByProperty = {
  id: string;
  name: string;
  type: "created_by";
  created_by: {};
}

export type ILastEditedTimeProperty = {
  id: string;
  name: string;
  type: "last_edited_time";
  last_edited_time: {};
}

export type ILastEditedByProperty = {
  id: string;
  name: string;
  type: "last_edited_by";
  last_edited_by: {};
}

// ========== Property Value Types ==========
export type IPropertyValue = 
  | ITitlePropertyValue
  | IRichTextPropertyValue
  | INumberPropertyValue
  | ISelectPropertyValue
  | IMultiSelectPropertyValue
  | IDatePropertyValue
  | IPeoplePropertyValue
  | IFilesPropertyValue
  | ICheckboxPropertyValue
  | IUrlPropertyValue
  | IEmailPropertyValue
  | IPhoneNumberPropertyValue
  | IFormulaPropertyValue
  | IRelationPropertyValue
  | IRollupPropertyValue
  | ICreatedTimePropertyValue
  | ICreatedByPropertyValue
  | ILastEditedTimePropertyValue
  | ILastEditedByPropertyValue;

export type ITitlePropertyValue = {
  id: string;
  type: "title";
  title: IText[];
}

export type IRichTextPropertyValue = {
  id: string;
  type: "rich_text";
  rich_text: IText[];
}

export type INumberPropertyValue = {
  id: string;
  type: "number";
  number: number | null;
}

export type ISelectPropertyValue = {
  id: string;
  type: "select";
  select: {
    id: string;
    name: string;
    color: string;
  } | null;
}

export type IMultiSelectPropertyValue = {
  id: string;
  type: "multi_select";
  multi_select: {
    id: string;
    name: string;
    color: string;
  }[];
}

export type IDatePropertyValue = {
  id: string;
  type: "date";
  date: {
    start: string;
    end: string | null;
    time_zone: string | null;
  } | null;
}

export type IPeoplePropertyValue = {
  id: string;
  type: "people";
  people: {
    object: "user";
    id: string;
    name: string;
    avatar_url: string | null;
    type: "person" | "bot";
    person?: {
      email: string;
    };
    bot?: {};
  }[];
}

export type IFilesPropertyValue = {
  id: string;
  type: "files";
  files: ({
    name: string;
  } & (IFileFile | IExternalFile))[];
}

export type ICheckboxPropertyValue = {
  id: string;
  type: "checkbox";
  checkbox: boolean;
}

export type IUrlPropertyValue = {
  id: string;
  type: "url";
  url: string | null;
}

export type IEmailPropertyValue = {
  id: string;
  type: "email";
  email: string | null;
}

export type IPhoneNumberPropertyValue = {
  id: string;
  type: "phone_number";
  phone_number: string | null;
}

export type IFormulaPropertyValue = {
  id: string;
  type: "formula";
  formula: {
    type: "string" | "number" | "boolean" | "date";
    string?: string;
    number?: number;
    boolean?: boolean;
    date?: {
      start: string;
      end: string | null;
      time_zone: string | null;
    };
  };
}

export type IRelationPropertyValue = {
  id: string;
  type: "relation";
  relation: {
    id: string;
  }[];
}

export type IRollupPropertyValue = {
  id: string;
  type: "rollup";
  rollup: {
    type: "number" | "date" | "array";
    number?: number;
    date?: {
      start: string;
      end: string | null;
      time_zone: string | null;
    };
    array: any[]; // This can be an array of any property value type
  };
}

export type ICreatedTimePropertyValue = {
  id: string;
  type: "created_time";
  created_time: string;
}

export type ICreatedByPropertyValue = {
  id: string;
  type: "created_by";
  created_by: {
    object: "user";
    id: string;
    name: string;
    avatar_url: string | null;
    type: "person" | "bot";
    person?: {
      email: string;
    };
    bot?: {};
  };
}

export type ILastEditedTimePropertyValue = {
  id: string;
  type: "last_edited_time";
  last_edited_time: string;
}

export type ILastEditedByPropertyValue = {
  id: string;
  type: "last_edited_by";
  last_edited_by: {
    object: "user";
    id: string;
    name: string;
    avatar_url: string | null;
    type: "person" | "bot";
    person?: {
      email: string;
    };
    bot?: {};
  };
}

// ========== Page Type ==========
export type IPageResponse = {
  object: "page";
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: "user";
    id: string;
  };
  last_edited_by: {
    object: "user";
    id: string;
  };
  cover: IExternalFile | IFileFile | null;
  icon: IEmoji | IExternalFile | IFileFile | null;
  parent: {
    type: "database_id" | "page_id" | "workspace";
    database_id?: string;
    page_id?: string;
    workspace?: boolean;
  };
  archived: boolean;
  properties: {
    [key: string]: IPropertyValue;
  };
  url: string;
}

// ========== Block Types =========

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
type _IParagraph = { 
  // Notion APIの仕様変更に対応: textからrich_textに変更
  // 後方互換性のために、textもrich_textとして扱う
  rich_text?: IText[],
  text?: IText[],
  children?: IRetrieveBlockChildrenResponse
}

export type IHeading1Block = _IBlock & { type: "heading_1", heading_1: _IHeading }
export type IHeading2Block = _IBlock & { type: "heading_2", heading_2: _IHeading }
export type IHeading3Block = _IBlock & { type: "heading_3", heading_3: _IHeading }
type _IHeading = { 
  // Notion APIの仕様変更に対応: textからrich_textに変更
  // 後方互換性のために、textもrich_textとして扱う
  rich_text?: IText[],
  text?: IText[]
}

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
  // Notion APIの仕様変更に対応: textからrich_textに変更
  // 後方互換性のために、textもrich_textとして扱う
  rich_text?: IText[],
  text?: IText[],
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

