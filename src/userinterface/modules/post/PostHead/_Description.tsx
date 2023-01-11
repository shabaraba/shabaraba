import { FC } from "react"
import NextLink from 'next/link'
import { Box, LinkOverlay } from '@chakra-ui/react'
import { TagList } from "../../../patterns/TagList";
import { IPageTag } from "core/types/NotionPageApiResponses";

type Props = {
  url: string;
  title: string;
  tagList?: IPageTag[];
};

export const Description: FC<Props> = ({ url, title, tagList=[] }) => {
  const style = {
    p: 2,
    mt: { base: 4, md: 0 },
    ml: { md: 6 },
    h: '100%',
    w: '100%',
  };

  return (
    <Box {...style}>
      <LinkOverlay as={NextLink} href={url} fontSize={{ md: '18px', sm: '18px', base: '16px' }} overflowWrap='anywhere'>
        {title}
      </LinkOverlay>
      <TagList tags={tagList} />
    </Box>
  )
}