import { Wrap, WrapItem } from "@chakra-ui/react";
import { ListSwitchLink } from "components/modules/common/ListSwitchLink";

type Props = {
  home?: boolean;
};

export const ListSwitchBox = ({ home }: Props) => {
  return (
    <Wrap justify={"left"} alignItems={"bottom"}>
      <WrapItem> <ListSwitchLink isShown={home} path="/" title="Articles" /> </WrapItem>
    </Wrap>
  );
};
