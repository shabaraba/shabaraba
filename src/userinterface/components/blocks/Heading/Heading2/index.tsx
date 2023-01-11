import { Heading, Text } from '@chakra-ui/react'
import { Heading2BlockType } from 'core/types/PostBlockType';
import {v4 as uuidv4} from 'uuid';

type Props = {entity: Heading2BlockType};

export const Heading2Component: React.FC<Props> = ({entity}: Props) => {
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
      {entity.content.texts.map(text =>
        <Text as='span' overflowWrap='anywhere' key={uuidv4()}>{text.content}</Text>
      )}
    </Heading>
  )
}
