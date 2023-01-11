import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { Text } from "./Text";
import { Block } from "./Block";


export class Code extends Block {
  public texts: Text[];
  public captions?: Text[];
  public language?: "abap" | "arduino" | "bash" | "basic" | "c" | "clojure" | "coffeescript" | "c++" | "c#" | "css" | "dart" | "diff" | "docker" | "elixir" | "elm" | "erlang" | "flow" | "fortran" | "f#" | "gherkin" | "glsl" | "go" | "graphql" | "groovy" | "haskell" | "html" | "java" | "javascript" | "json" | "julia" | "kotlin" | "latex" | "less" | "lisp" | "livescript" | "lua" | "makefile" | "markdown" | "markup" | "matlab" | "mermaid" | "nix" | "objective-c" | "ocaml" | "pascal" | "perl" | "php" | "plain text" | "powershell" | "prolog" | "protobuf" | "python" | "r" | "reason" | "ruby" | "rust" | "sass" | "scala" | "scheme" | "scss" | "shell" | "sql" | "swift" | "typescript" | "vb.net" | "verilog" | "vhdl" | "visual basic" | "webassembly" | "xml" | "yaml" | "java/c/c++/c#";

  constructor(resp: NotionBlockInterfaces.ICodeBlock) {
    super(resp.id);
    this.type = "Code";

    this.texts = [];
    resp.code.text.map((text: NotionBlockInterfaces.IText) => {
      this.texts.push(new Text(text));
    });
    this.captions = [];
    resp.code.caption?.map((caption: NotionBlockInterfaces.IText) => {
      this.captions.push(new Text(caption));
    });
    this.language = resp.code.language;
  }
}
