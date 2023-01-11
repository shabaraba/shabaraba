import { Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import { TwitterShareButton, TwitterIcon, LineShareButton, LineIcon, HatenaShareButton, HatenaIcon, FacebookShareButton, FacebookIcon } from "react-share";

type Props = {
  url: string,
  title: string,
}
export const ShareButtonList: React.FC<Props> = ({ url, title }) => {
  return (
    <Wrap justify='right'>
      <WrapItem>
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={32} round={true} />
        </TwitterShareButton>
      </WrapItem>
      <WrapItem>
        <LineShareButton url={url} title={title}>
          <LineIcon size={32} round={true} />
        </LineShareButton>
      </WrapItem>
      <WrapItem>
        <HatenaShareButton url={url} title={title}>
          <HatenaIcon size={32} round={true} />
        </HatenaShareButton>
      </WrapItem>
      <WrapItem>
        <FacebookShareButton url={url} title={title}>
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
      </WrapItem>
    </Wrap>
  )
}