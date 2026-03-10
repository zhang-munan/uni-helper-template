import dayjs from 'dayjs'
import { Platform } from '@/enum/common.ts'

export function isWechatOfficialAccount() {
  const userAgent = window.navigator.userAgent.toLowerCase()
  // 第一步：先判断是微信浏览器
  const isWechat = /micromessenger/.test(userAgent)
  if (!isWechat)
    return false

  // 第二步：排除微信小程序（小程序环境有特定标识）
  const isMiniProgram = /miniProgram/i.test(userAgent) || window.__wxjs_environment === 'miniprogram'
  // 第三步：排除微信PC端（可选，根据业务需求）
  const isWechatPC = /windowswechat/i.test(userAgent)

  // 最终：是微信浏览器 + 非小程序 + 非PC端 = 公众号环境
  return isWechat && !isMiniProgram && !isWechatPC
}

export function getPlatForm() {
  let platform = null
  // #ifdef H5
  if (isWechatOfficialAccount()) {
    platform = Platform.wxPa
  }
  else {
    platform = Platform.h5
  }
  // #endif
  // #ifdef MP-WEIXIN
  platform = Platform.wxMinipg
  // #endif
  // #ifdef MP-TOUTIAO
  platform = Platform.wxToutiao
  // #endif

  return platform
}

/**
 * 日期格式化
 *
 */
export function formatDateStr(time: number, second: boolean) {
  const now = new Date()
  const that = new Date(time)
  if (that.getFullYear() === now.getFullYear()
    && that.getMonth() === now.getMonth()
    && that.getDate() === now.getDate() - 1) {
    return `昨天 ${dayjs(that).format(`HH:mm${second ? ':ss' : ''}`)}`
  }
  if (that.getFullYear() === now.getFullYear()
    && that.getMonth() === now.getMonth()
    && that.getDate() === now.getDate()) {
    return `今天 ${dayjs(that).format(`HH:mm${second ? ':ss' : ''}`)}`
  }
  if (that.getFullYear() === now.getFullYear()
    && that.getMonth() === now.getMonth()
    && that.getDate() === now.getDate() - 2) {
    return `前天 ${dayjs(that).format(`HH:mm${second ? ':ss' : ''}`)}`
  }

  if (that.getFullYear() === now.getFullYear()
    && that.getMonth() === now.getMonth()
    && that.getDate() !== now.getDate()) {
    return dayjs(that).format('MM-DD')
  }

  if (that.getFullYear() === now.getFullYear()
    && that.getMonth() !== now.getMonth()) {
    return dayjs(that).format(`MM-DD HH:mm${second ? ':ss' : ''}`)
  }

  if (that.getFullYear() !== now.getFullYear()) {
    return dayjs(that).format(`YYYY-MM-DD HH:mm${second ? ':ss' : ''}`)
  }
  return dayjs(that).format(`YYYY-MM-DD HH:mm${second ? ':ss' : ''}`)
}
