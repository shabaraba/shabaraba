import { Heading, Text } from '@chakra-ui/react'
import {v4 as uuidv4} from 'uuid';
import { Heading1 as Heading1Entity } from "../../../../../application/modules/post/objects/entities/blocks/Heading1";

type Props = {entity: Heading1Entity};

export const Heading1Component: React.FC<Props> = ({entity}: Props) => {
  const headingStyle = {
      fontSize: { lg: '28px', md: '24px', base: '18px' },
      mt: 6,
      mb: 6,
  };

  return (
    <Heading as={'h1'} overflowWrap={'anywhere'} {...headingStyle}>
      {entity.texts.map(text =>
        <Text as='span' overflowWrap='anywhere' key={uuidv4()}>{text.content}</Text>
      )}
    </Heading>
  )
}


