// export * from './Paragraph';
// export * from './Heading1';
// export * from './Heading2';
// export * from './Heading3';
// export * from './Callout';
// export * from './Code';
// export * from './Image';

import { Paragraph } from './Paragraph'
import { Heading1 } from './Heading1'
import { Heading2 } from './Heading2'
import { Heading3 } from './Heading3'
import { Callout } from './Callout'
import { Code } from './Code'
import { Image } from './Image'
import { BulletedListItem } from './BulletedListItem'
import { NumberedListItem } from './NumberedListItem'
import { Quote } from './Quote'
import { Bookmark } from './Bookmark'

export default {
  Paragraph: Paragraph,
  Heading1: Heading1,
  Heading2: Heading2,
  Heading3: Heading3,
  Code: Code,
  Callout: Callout,
  Image: Image,
  BulletedListItem: BulletedListItem,
  NumberedListItem: NumberedListItem,
  Quote: Quote,
  Bookmark: Bookmark,
}

