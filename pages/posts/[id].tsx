import { Center, Spinner } from '@chakra-ui/react'
import Layout from '../../components/layout';
import Block from '../../components/posts/Block';
import axios from 'axios';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { test } from '../../lib/notions';
import {v4 as uuidv4} from 'uuid';

import * as NotionBlock from '../../entities/notion/blocks';

export default function Post() {
  const router = useRouter();

	const { data, error } = useSWR(
    '/api/notion/posts/' + router.query.id,
    url => axios.get(url).then((res) => {
      return test(res.data);
    })
  )

	if (error)return <div>failed to load</div>
	if (!data)return (
      <Center h='100vh'>
        <Spinner />
      </Center>
    )

  return (
    <Layout>
      <Head>
        <title>{router.query.id}</title>
      </Head>
      <article>
        {data.map((block: NotionBlock.Block) =>
          <Block
            key = {uuidv4()}
            entity={block} />
        )}
      </article>
    </Layout>
  )
}

