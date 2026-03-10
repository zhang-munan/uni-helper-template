import { instance } from './config'

/**
 * 发送短信验证码
 * @param data - 请求参数
 * @param data.phone - 手机号
 */
export function sendSmsCodeApi(data: { phone: string }) {
  return instance.post('auth/send-sms', data)
}

/**
 * 验证码登录
 * @param data - 请求参数
 * @param data.phone - 手机号
 * @param data.code - 验证码
 */
export function phoneLoginApi(data: { phone: string, code: string }) {
  return instance.post('auth/login', data)
}

/**
 * 微信小程序登录
 * @param data - 请求参数
 * @param data.code - 微信登录凭证
 */
export function wxLoginApi(data: { code: string }) {
  return instance.post('auth/wx-login', data)
}

/**
 * 获取当前用户信息
 */
export function getUserInfoApi() {
  return instance.get('user/info')
}

/**
 * 更新用户信息
 * @param data - 用户信息
 * @param data.nickname - 昵称
 * @param data.avatar - 头像
 */
export function updateUserInfoApi(data: { nickname?: string, avatar?: string }) {
  return instance.post('user/update', data)
}
