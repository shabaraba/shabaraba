import { Icon, Wrap, WrapItem } from "@chakra-ui/react";
import Date from "./date";
import React from "react";
import { MdCreate, MdArrowRightAlt, MdUpdate } from "react-icons/md";

type Props = {
  publishedAt: string,
  updatedAt: string,
}
export const PublishDate: React.FC<Props> = ({ publishedAt, updatedAt }) => {
  return (
    <Wrap justify='right'>
      <WrapItem>
        <Icon as={MdCreate} />
        <Date dateString={publishedAt}/>
      </WrapItem>
      <WrapItem>
        <Icon as={MdArrowRightAlt} />
      </WrapItem>
      <WrapItem>
        <Icon as={MdUpdate} />
        <Date dateString={updatedAt}/>
      </WrapItem>
    </Wrap>
  )
}