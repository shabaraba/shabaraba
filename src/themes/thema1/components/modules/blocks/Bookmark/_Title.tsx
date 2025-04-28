import React from 'react';
import { LinkOverlay } from '@chakra-ui/react';

type Props = {
  siteUrl: string,
  pageTitle: string,
  siteTitle: string
};

export const _Title: React.FC<Props> = (props: Props) => (
  <LinkOverlay href={props.siteUrl} fontSize='md' overflowWrap='anywhere'>{props.pageTitle} | {props.siteTitle}</LinkOverlay>
)
