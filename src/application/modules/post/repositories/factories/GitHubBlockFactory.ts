import { Heading1BlockType, Heading2BlockType, Heading3BlockType, ParagraphBlockType, TextType } from "core/types/PostBlockType";
import {v4 as uuidv4} from 'uuid';

type TextProps = {
  text: string;
  type?: "text"|"strong"|"emphasis"|"strikethrough";
  href?: string;
}

const _makeText = (props: TextProps): TextType => {
  return {
    href: props.href,
    annotations: {
      bold: props.type === "strong" ? true : false,
      italic: props.type === "emphasis" ? true : false,
      strikethrough: props.type === "strikethrough" ? true : false,
      underline: false,
      code: false,
      color: "default",
    },
    content: props.text,
  }
}

type HeadingProps = {
  depth: 1|2|3|4|5|6;
  text: string;
  nest?: number;
}
export const makeHeading = (props: HeadingProps): Heading1BlockType|Heading2BlockType|Heading3BlockType|null => {
  if (props.depth === 4 || props.depth === 5 || props.depth === 6) return null;
  const type: "Heading1"|"Heading2"|"Heading3" = `Heading${props.depth}`;
  return {
    id: uuidv4(),
    nest: props.nest ?? 0,
    type: type,
    content: {
      texts: [_makeText({text: props.text})]
    }
  };
}

type ParagraphProps = {
  nest?: number;
  type?: "strong"|"emphasis";
  children?: _ParagraphProps[];
}
export const makeParagraph = (props: ParagraphProps): ParagraphBlockType => {
  console.log(JSON.stringify(props, null, 2));
  return {
    id: uuidv4(),
    nest: props.nest ?? 0,
    type: "Paragraph",
    content: {
      texts: [_makeText({text: ""})],
      children: props.children?.map(child => _makeParagraph({...child, nest: props.nest+1}))
    }
  };
}

type _ParagraphProps = 
  | {
      type: "strong"|"emphasis";
      nest?: number;
      children?: _ParagraphProps[];
    }
  | {
      type: "text"|"inlineCode";
      value: string;
      nest?: number;
      children?: _ParagraphProps[];
    }
const _makeParagraph = (props: _ParagraphProps): ParagraphBlockType => {
  console.log(JSON.stringify(props, null, 2));
  const text = props.type === "text" || props.type === "inlineCode"
    ? props.value 
    : props.children?.map(child => child.value ?? "").join("");
  const type = (text.startsWith("~~") && text.endsWith("~~"))
    ? "strikethrough"
    : props.type;
  return {
    id: uuidv4(),
    nest: props.nest ?? 0,
    type: "Paragraph",
    content: {
      texts: [_makeText({text, type})],
      children: props.children?.map(child => _makeParagraph({...child, nest: props.nest+1}))
    }
  };
}

// const _getText = (props: _ParagraphProps) => {
//   _getText(props.children)
//   if (props.type === "text") {
//     return props.value;
//   }
//
//   const type = props.type;
//   return {...getText(props.child)
//   {
//     bold: props.type === "strong" ? true : false,
//     italic: props.type === "emphasis" ? true : false,
//     strikethrough: props.type === "strikethrough" ? true : false,
//     underline: false,
//     code: false,
//   }
//   return {
//     props.value
//   }
// }
//
