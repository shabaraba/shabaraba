import { Heading, Text } from '@chakra-ui/react'
import { Heading3BlockType } from 'core/types/PostBlockType';
import {v4 as uuidv4} from 'uuid';

type Props = {entity: Heading3BlockType};

export const Heading3Component: React.FC<Props> = ({entity}: Props) => {
  const headingStyle = {
      size: 'md',
      mt: 5,
      mb: 5,
  };

  return (
    <Heading key={entity.id} as={'h3'} overflowWrap={'anywhere'} {...headingStyle}>
      {entity.content.texts.map(text =>
        <Text as='span' overflowWrap='anywhere' key={uuidv4()}>{text.content}</Text>
      )}
    </Heading>
  )
}


