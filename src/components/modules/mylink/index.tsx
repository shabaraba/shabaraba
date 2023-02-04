import { LinkBox } from "@chakra-ui/react";
import { MyLinkEntity } from "core/entities/MyLinkEntity";
import { FC } from "react";
import { Description } from "./_Description";
import { EyeChatch } from "./_EyeCatch";

type Props = { mylink: MyLinkEntity };

export const MyLink: FC<Props> = ({ mylink }) => {
  const style = {
    marginTop: 5,
    display: { md: "flex" },
    borderRadius: 10,
    overflow: 'hidden',
    filter: 'drop-shadow(3px 3px 3px rgba(0,0,0,0.2))',
    _hover: {
      filter: 'drop-shadow(10px 10px 10px rgba(0,0,0,0.4))',
      transition: 'all .3s',
    },
    bg: '#FFF5F3',
    height: { md: 120 },
    width: '100%',
  };

  return (
    <LinkBox as="article" position='relative' {...style}>
      <EyeChatch eyeCatchUrl={mylink.ogp} />
      <Description url={mylink.url} title={mylink.title} tagList={mylink.tags} />
    </LinkBox>
  )
} 
