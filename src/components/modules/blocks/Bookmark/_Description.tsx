import React from 'react';
import { Text } from '@chakra-ui/react'

type props = {
  description: string,
  siteUrl: string
};

export const _Description: React.FC<props> =  (props: props): JSX.Element => {
    return (
      <>
        <Text fontSize='smaller' overflowWrap='anywhere' noOfLines={2}>{props.description}</Text>
        <Text fontSize='xs' overflowWrap='anywhere' noOfLines={1}>{props.siteUrl}</Text>
      </>
    );
}
