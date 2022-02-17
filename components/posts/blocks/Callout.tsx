import React from "react"
import { Center, Grid, GridItem, Text } from '@chakra-ui/react'
import type { Callout as CalloutEntity } from '../../../entities/notion/blocks';
import { Paragraph } from './Paragraph'

interface CalloutMap{
  icon: string,
  name: string,
  color: string
}

export function Callout({entity}: {entity: CalloutEntity}) {
  // console.log(entity)
  const calloutMaps: CalloutMap[] = [
    {
      icon: '⚠',
      name: 'WarningTwoIcon',
      color: 'yellow.500'
    },
    {
      icon: '💡',
      name: 'WarningTwoIcon',
      color: 'yellow.500'
    },
  ]

  return (
    <Grid
      mt={5}
      mb={5}
      p={2}
      borderRadius={10}
      filter='drop-shadow(10px 10px 10px rgba(0,0,0,0.4))'
      backgroundColor = 'red.100'
      templateColumns='repeat(10, 1fr)'
      gap={4}
    >
      <GridItem
        colSpan={1}
        display="flex"
        justifyContent='center'
        alignItems='center'
      >
        <Text
          fontSize={36}
        >
          {entity.icon}
        </Text>
      </GridItem>

      <GridItem
        colStart={2}
        colEnd={11}
        boxShadow='inner'
        p={2}
        // filter='drop-shadow(-10px -10px 10px rgba(0,0,0,0.4))'
      >
        <Paragraph entity={entity} />
      </GridItem>
    </Grid>
  )
}

