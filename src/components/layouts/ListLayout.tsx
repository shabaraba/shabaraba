import React from "react";
import { Container } from "@chakra-ui/react";
import Layout from "./layout";
import { ListSwitchBox } from "components/patterns/Common/ListSwitchBox";

export default function ListLayout({
  children,
  leftside,
  home,
}: {
  children: React.ReactNode;
  leftside?: React.ReactNode;
  home?: boolean;
}) {
  // background: '#e8cfc1'
  return (
    <Layout leftside={leftside}>
      <Container maxW="container.lg">
        <ListSwitchBox home={home} />
        {children}
      </Container>
    </Layout>
  );
}
