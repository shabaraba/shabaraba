import React from "react";
import { Container, Box, useBreakpointValue, Flex } from "@chakra-ui/react";
import Layout from "./layout";
import { ListSwitchBox } from "components/patterns/Common/ListSwitchBox";
import Sidebar from "components/modules/sidebar";

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
  const isMobile = useBreakpointValue({ lg: false, sm: true, base: true });
  
  return (
    <Layout leftside={leftside}>
      <Container maxW="container.xl">
        <ListSwitchBox home={home} mylink={mylink} />
        
        <Flex direction={isMobile ? "column" : "row"} gap={6} mt={4}>
          <Box flex="3" minWidth="0">
            {children}
          </Box>
          
          {/* サイドバー */}
          {!isMobile && (
            <Box flex="1" minWidth="280px" maxWidth="340px">
              <Sidebar />
            </Box>
          )}
        </Flex>
        
        {/* モバイル表示時はコンテンツの下にサイドバーを表示 */}
        {isMobile && (
          <Box mt={8}>
            <Sidebar />
          </Box>
        )}
      </Container>
    </Layout>
  );
}
