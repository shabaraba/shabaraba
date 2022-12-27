import { Heading, Text } from '@chakra-ui/react'
import {v4 as uuidv4} from 'uuid';
import type { Heading2 as Heading2Entity, } from '../../../../../../entities/notion/blocks';

type Props = {entity: Heading2Entity};

export const Heading2: React.FC<Props> = ({entity}: Props) => {
  const headingStyle = {
      fontSize: {lg: '24px', base: '18px' },
      mt: 5,
      mb: 5,
      pl: 5,
      borderStyle:'solid',
      borderLeftWidth:'10px',
      borderColor:'#CE6857'
  };

  return (
    <Heading key={entity.id}  as={'h2'} overflowWrap={'anywhere'} {...headingStyle}>
      {entity.texts.map(text =>
        <Text as='span' overflowWrap='anywhere' key={uuidv4()}>{text.content}</Text>
      )}
    </Heading>
  )
}
