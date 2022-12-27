import { Heading, Text } from '@chakra-ui/react'
import {v4 as uuidv4} from 'uuid';
import type { Heading1 as Heading1Entity, } from '../../../../../../entities/notion/blocks';

type Props = {entity: Heading1Entity};

export const Heading1: React.FC<Props> = ({entity}: Props) => {
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


