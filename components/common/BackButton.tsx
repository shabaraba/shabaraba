import { useRouter } from 'next/router'
import { Button } from '@chakra-ui/react'

export default () => {
  const router = useRouter()

  return (
    <Button onClick={() => router.back()}>
      Click here to go back
    </Button>
  )
}
