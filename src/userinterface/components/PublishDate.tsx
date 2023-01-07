import React from "react";
import { Icon, Wrap, WrapItem } from "@chakra-ui/react";
import { MdCreate, MdArrowRightAlt, MdUpdate } from "react-icons/md";
import Date from "./date";

type Props = {
  publishedAt: Date,
  updatedAt: Date,
}
export const PublishDate: React.FC<Props> = ({ publishedAt, updatedAt }) => {
  return (
    <Wrap justify='right'>
      <WrapItem>
        <Icon as={MdCreate} />
        <Date date={publishedAt}/>
      </WrapItem>
      <WrapItem>
        <Icon as={MdArrowRightAlt} />
      </WrapItem>
      <WrapItem>
        <Icon as={MdUpdate} />
        <Date date={updatedAt}/>
      </WrapItem>
    </Wrap>
  )
}