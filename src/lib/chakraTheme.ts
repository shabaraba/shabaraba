import { extendTheme } from '@chakra-ui/theme-utils'
import type { ThemeConfig } from '@chakra-ui/theme'
import { theme as caffeTheme } from '../styles/theme'

// カラーモード設定（デフォルトの設定をここで提供）
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// デフォルトテーマを提供する（エラー回避用）
const defaultTheme = {
  config,
  colors: {
    brand: {
      100: '#F8F4EC',
      200: '#F1E7D6',
      300: '#A2674C',
      400: '#D99873',
      500: '#7B5E57',
      600: '#4B3832',
      700: '#4B3832',
      800: '#2D3748',
      900: '#1A202C',
    },
  },
  fonts: {
    body: "'Noto Serif JP', serif", 
    heading: "'Noto Serif JP', serif",
    mono: "Menlo, monospace",
  },
}

// Chakra UI用にテーマを拡張
export const chakraTheme = extendTheme(defaultTheme)
