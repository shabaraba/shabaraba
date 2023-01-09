import { Heading, Text } from '@chakra-ui/react'
import {v4 as uuidv4} from 'uuid';
import { Heading3 as Heading3Entity } from "../../../../../application/modules/post/objects/entities/blocks/Heading3";

type Props = {entity: Heading3Entity};

export const Heading3Component: React.FC<Props> = ({entity}: Props) => {
  const headingStyle = {
      size: 'md',
      mt: 5,
      mb: 5,
  };

  return (
    <Heading key={entity.id} as={'h3'} overflowWrap={'anywhere'} {...headingStyle}>
      {entity.texts.map(text =>
        <Text as='span' overflowWrap='anywhere' key={uuidv4()}>{text.content}</Text>
      )}
    </Heading>
  )
}


