import { Box } from "@chakra-ui/react";
import { MyLink } from "../../modules/mylink";
import { MyLinkEntity } from "core/entities/MyLinkEntity";
import { FC } from "react";

type Props = { data: MyLinkEntity[] };

export const MyLinkList: FC<Props> = ({ data }) => {
  return (
    <Box p="2" w='100%'>
      {data.map((entity: MyLinkEntity) =>
        <MyLink key={entity.id} mylink={entity} />
      )}
    </Box>
  )
}

