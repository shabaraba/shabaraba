import React from "react";
import { Container } from "@chakra-ui/react";
import Layout from "./layout";
import { ListSwitchBox } from "../patterns/Common/ListSwitchBox";

export default function ListLayout({
  children,
  leftside,
  home,
  mylink,
}: {
  children: React.ReactNode;
  leftside?: React.ReactNode;
  home?: boolean;
  mylink?: boolean;
}) {
  // background: '#e8cfc1'
  return (
    <Layout leftside={leftside}>
      <Container maxW="container.lg">
        <ListSwitchBox home={home} mylink={mylink} />
        {children}
      </Container>
    </Layout>
  );
}
