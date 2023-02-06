import { Wrap, WrapItem } from "@chakra-ui/react";
import { ListSwitchLink } from "components/modules/common/ListSwitchLink";

type Props = {
  home: boolean;
  mylink: boolean;
};

export const ListSwitchBox = ({ home, mylink }: Props) => {
  return (
    <Wrap justify={"left"} alignItems={"bottom"}>
      <WrapItem> <ListSwitchLink isShown={home} path="/" title="Articles" /> </WrapItem>
      <WrapItem> <ListSwitchLink isShown={mylink} path="/mylink" title="MyLinks" /> </WrapItem>
    </Wrap>
  );
};
