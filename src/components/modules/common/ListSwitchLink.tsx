import { Text, Link } from "@chakra-ui/react";

type Props = {
  isShown: boolean,
  path: string,
  title: string,
}

export const ListSwitchLink = ({isShown, path, title}: Props) => {
  if (isShown) return <Text fontSize="xl" borderBottom="solid" mt={10}> {title} </Text>
  return <Link href={path} fontSize="xl" mt={10}> {title} </Link>
}