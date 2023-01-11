import { Heading, Text } from '@chakra-ui/react'
import { Heading1BlockType } from 'core/types/PostBlockType';
import {v4 as uuidv4} from 'uuid';

type Props = {entity: Heading1BlockType};

export const Heading1Component: React.FC<Props> = ({entity}: Props) => {
  const headingStyle = {
      fontSize: { lg: '28px', md: '24px', base: '18px' },
      mt: 6,
      mb: 6,
  };

  return (
    <Heading as={'h1'} overflowWrap={'anywhere'} {...headingStyle}>
      {entity.content.texts.map(text =>
        <Text as='span' overflowWrap='anywhere' key={uuidv4()}>{text.content}</Text>
      )}
    </Heading>
  )
}


