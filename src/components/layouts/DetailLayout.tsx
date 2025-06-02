import React from "react";
import { Container, Text } from "@chakra-ui/react";
import styles from "./layout.module.css";
import Link from "next/link";
import Layout from "./layout";
import { useRouter } from "next/router";

export function DetailLayout({
  children,
  leftside,
}: {
  children: React.ReactNode;
  leftside?: React.ReactNode;
}) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault()
    router.back()
  }

  // background: '#e8cfc1'
  return (
    <Layout leftside={leftside}>
      <Container maxW="container.lg">{children}</Container>
      <div className={styles.backToHome}>
        <Text as="a" onClick={(e) => router.back()} _hover={{cursor: "pointer"}}> ← Back to home </Text>
      </div>
    </Layout>
  );
}

export default DetailLayout;
