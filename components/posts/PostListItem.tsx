import { LinkBox, LinkOverlay, Heading, Image, Text, SpaceProps, HStack, Button, Tag, Box } from '@chakra-ui/react'
import Link from 'next/link'
import Date from '../../components/date'

import type {
  NotionPostHead,
} from '../../entities/notion_entities';

interface IBlogTags {
  tags: Array<string>;
  marginTop?: SpaceProps['marginTop'];
}
const BlogTags: React.FC<IBlogTags> = (props) => {
  return (
    <HStack spacing={2} marginTop={props.marginTop}>
      {props.tags.map((tag) => {
        return (
          <Tag size={'md'} variant="solid" colorScheme="orange" key={tag}>
            {tag}
          </Tag>
        );
      })}
    </HStack>
  );
};

interface BlogAuthorProps {
  date: Date;
  name: string;
}

export const BlogAuthor: React.FC<BlogAuthorProps> = (props) => {
  return (
    <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
      <Image
        borderRadius="full"
        boxSize="40px"
        src="https://100k-faces.glitch.me/random-image"
        alt={`Avatar of ${props.name}`}
      />
      <Text fontWeight="medium">{props.name}</Text>
      <Text>—</Text>
      <Text>{props.date.toLocaleDateString()}</Text>
    </HStack>
  );
};

export default function PostListItem(props) {
  const postHead: NotionPostHead = props.post;
  return(
    <LinkBox
      marginTop={{ base: '5', sm: '5' }}
      display="flex"
      flexDirection={{ base: 'column', sm: 'row' }}
      justifyContent="space-between">
      <Box
        display="flex"
        flex="1"
        marginRight="3"
        position="relative"
        alignItems="center">
        <Box
          width={{ base: '100%', sm: '85%' }}
          zIndex="2"
          marginLeft={{ base: '0', sm: '5%' }}
          marginTop="5%">
          <LinkOverlay href="/">
            <Image
              borderRadius="lg"
              src={
                'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80'
              }
              alt="some good alt text"
              objectFit="contain"
            ></Image>
          </LinkOverlay>
        </Box>
        <Box zIndex="1" width="100%" position="absolute" height="100%">
          <Box
            // bgGradient={useColorModeValue(
            //   'radial(orange.600 1px, transparent 1px)',
            //   'radial(orange.300 1px, transparent 1px)'
            // )}
            backgroundSize="20px 20px"
            opacity="0.4"
            height="100%"
          ></Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flex="1"
        flexDirection="column"
        justifyContent="center"
        marginTop={{ base: '3', sm: '0' }}
      >
        <BlogTags tags={['Engineering', 'Product']} />
        <Heading marginTop="1">
          <Link href='/'>
            {postHead.title}
          </Link>
        </Heading>
        <Text
          as="p"
          marginTop="2"
          fontSize="lg">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text
          ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book.
        </Text>
      </Box>
    </LinkBox>
  )
} 
