import { presetUni } from '@uni-helper/unocss-preset-uni'
import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUni(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      primary: '#b39e00',
      secondary: '#f97316',
    },
  },
  rules: [
    // 阴影规则
    ['shadow-primary', { 'box-shadow': '0 10px 15px -3px rgba(26, 74, 142, 0.2)' }],
    // 背景透明度
    [/^bg-primary-(\d+)$/, ([, d]) => ({ 'background-color': `rgba(26, 74, 142, ${Number(d) / 100})` })],
    [/^bg-secondary-(\d+)$/, ([, d]) => ({ 'background-color': `rgba(249, 115, 22, ${Number(d) / 100})` })],
    [/^bg-orange-(\d+)$/, ([, d]) => ({ 'background-color': `rgba(249, 115, 22, ${Number(d) / 100})` })],
    // 边框透明度
    [/^border-primary-(\d+)$/, ([, d]) => ({ 'border-color': `rgba(26, 74, 142, ${Number(d) / 100})` })],
    [/^border-secondary-(\d+)$/, ([, d]) => ({ 'border-color': `rgba(249, 115, 22, ${Number(d) / 100})` })],
    [/^border-orange-(\d+)$/, ([, d]) => ({ 'border-color': `rgba(249, 115, 22, ${Number(d) / 100})` })],
    // 文字透明度
    [/^text-primary-(\d+)$/, ([, d]) => ({ color: `rgba(26, 74, 142, ${Number(d) / 100})` })],
    [/^text-secondary-(\d+)$/, ([, d]) => ({ color: `rgba(249, 115, 22, ${Number(d) / 100})` })],
    [/^text-orange-(\d+)$/, ([, d]) => ({ color: `rgba(249, 115, 22, ${Number(d) / 100})` })],
  ],
})
