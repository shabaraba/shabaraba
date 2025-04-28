import { extendTheme } from '@chakra-ui/react'

// Coffee Break Point カラーテーマ
const colors = {
  brand: {
    100: '#F8F4EC', // やわらかいベージュ (メイン背景)
    200: '#F1E7D6', // カフェオレ風のやわらかいトーン (サイドバー背景)
    300: '#D99873', // キャラメルブラウン (ホバー)
    400: '#A2674C', // 焙煎感ある赤みブラウン (リンク)
    500: '#7B5E57', // コーヒーのようなダークブラウン (アクセント)
    600: '#4B3832', // 重厚感ある濃いチョコレート (タイトル/見出し)
  }
}

// フォント設定
const fonts = {
  heading: `'Noto Serif JP', serif`,
  body: `'Noto Serif JP', serif`,
}

// コンポーネントのスタイル
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.300',
        },
      },
      outline: {
        border: '2px solid',
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.100',
        },
      },
    },
  },
  Link: {
    baseStyle: {
      color: 'brand.400',
      _hover: {
        color: 'brand.300',
        textDecoration: 'none',
      },
    },
  },
  Heading: {
    baseStyle: {
      color: 'brand.600',
      fontWeight: 'bold',
    },
  },
  Card: {
    baseStyle: {
      p: 4,
      bg: 'white',
      borderRadius: 'md',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
  },
}

// カフェ風テーマの設定
const theme = extendTheme({
  colors,
  fonts,
  components,
  styles: {
    global: {
      body: {
        bg: 'brand.100',
        color: '#333',
      },
    },
  },
})

export default theme
