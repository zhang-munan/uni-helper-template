<script setup lang="ts">
import { isWechatOfficialAccount } from '@/utils/utils'

onLaunch(() => {
  // #ifdef H5
  if (isWechatOfficialAccount()) {
    // 1. 处理URL：hash模式下去掉#及后续内容，只保留参数部分
    const url = window.location.href.split('#')[0]
    // 2. 解析URL参数（原生API，无需手动分割，更稳定）
    const params = new URLSearchParams(url.split('?')[1] || '')
    const code = params.get('code')

    if (!code) {
      // 2. 无code则跳转到微信授权页面
      const appid = import.meta.env.VITE_MP_APPID
      // 授权回调地址（必须和公众号配置的网页授权域名一致，encodeURIComponent编码）
      const redirectUri = encodeURIComponent(import.meta.env.VITE_CALLBACK_URL)
      // 授权类型：
      // snsapi_base：静默授权（无需用户确认，仅能获取openid，推荐）
      // snsapi_userinfo：手动授权（需用户点击确认，可获取昵称/头像等）
      const scope = 'snsapi_base'
      // 构造授权URL并跳转
      const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=123#wechat_redirect`
      window.location.href = authUrl
    }
    else {
      uni.setStorageSync('wxPaCode', code)
    }
    // uni.setStorageSync("wxPaCode", "021zgh1w3dHlC63W8r3w3VAbOh4zgh1L")
  }
  // #endif
})

onLoad(() => {
})
</script>

<style lang="scss">
@import '@/static/style/common.scss';
@import '@/static/iconfont/iconfont.css';

body,
page {
  background: $uni-bg-color;
}
</style>
