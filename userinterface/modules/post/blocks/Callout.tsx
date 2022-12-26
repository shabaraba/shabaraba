import React from "react"
import { Center, Grid, GridItem, Text } from '@chakra-ui/react'
import type { Callout as CalloutEntity } from '../../../../entities/notion/blocks';
import { Paragraph } from './Paragraph'

interface CalloutMap{
  icon: string,
  name: string,
  color: string
}

export function Callout({entity}: {entity: CalloutEntity}) {
  return (
    <Grid
      mt={5}
      mb={5}
      p={2}
      borderRadius={10}
      filter='drop-shadow(3px 3px 10px rgba(0,0,0,0.2))'
      backgroundColor = '#CE6857'
      color='#f7f7f7'
      templateColumns='repeat(10, 1fr)'
      gap={2}
    >
      <GridItem
        colSpan={1}
        display="flex"
        justifyContent='center'
        alignItems='center'
      >
        <Text
          fontSize={36}
          color='yellow.500'
          fontWeight='bold'
        >
          {entity.icon}
        </Text>
      </GridItem>

      <GridItem
        colStart={2}
        colEnd={11}
        p={2}
      >
        <Paragraph entity={entity} />
      </GridItem>
    </Grid>
  )
}

