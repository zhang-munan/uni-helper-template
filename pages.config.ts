import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  pages: [
    {
      path: 'pages/home/index',
      style: {
        navigationBarTitleText: 'uni-app 模板',
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/profile/index',
      style: {
        navigationBarTitleText: '我的',
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/login/index',
      style: {
        navigationBarTitleText: '登录',
        navigationStyle: 'custom',
      },
    },
  ],
  globalStyle: {
    backgroundColor: '@bgColor',
    backgroundColorBottom: '@bgColorBottom',
    backgroundColorTop: '@bgColorTop',
    backgroundTextStyle: '@bgTxtStyle',
    navigationBarBackgroundColor: '#1a4a8e',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: 'uni-app 模板',
    navigationStyle: 'custom',
  },
  tabBar: {
    color: '#94a3b8',
    selectedColor: '#1a4a8e',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'static/tabbar/home.png',
        selectedIconPath: 'static/tabbar/home-active.png',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'static/tabbar/mine.png',
        selectedIconPath: 'static/tabbar/mine-active.png',
      },
    ],
  },
  easycom: {
    autoscan: true,
    custom: {
      // uni-ui 规则如下配置
      '^uni-(.*)': '@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue',
    },
  },
})
