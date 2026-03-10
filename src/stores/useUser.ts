import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const _Prefix = 'MESSAGE_'

export interface UserInfo {
  id?: string
  targetId?: string
  realName?: string | null
  gender?: number | null
  phone?: string
  nickName?: string
  avatarUrl?: string
  sign?: string | null // 个性签名
  wxUnionId?: string | null
  wxMinipgOpenId?: string | null
  platform?: string
  token?: string
  vipLevel?: number // 0: 普通用户, 1: VIP
  vipExpireTime?: string
  balance?: number
  sentCount?: number
  receivedCount?: number
  createTime?: string
}

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserInfo>({})

  const token = ref<string>()

  // 登录状态
  const isLoggedIn = computed(() => !!userInfo.value.token)

  // 是否是VIP
  const isVip = computed(() => {
    if (!userInfo.value.vipLevel || userInfo.value.vipLevel === 0)
      return false
    if (userInfo.value.vipExpireTime) {
      return new Date(userInfo.value.vipExpireTime) > new Date()
    }
    return userInfo.value.vipLevel > 0
  })

  // 显示的手机号（脱敏）
  const maskedPhone = computed(() => {
    if (!userInfo.value.phone)
      return ''
    const phone = userInfo.value.phone
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  })

  // 显示的昵称
  const displayName = computed(() => {
    return userInfo.value.nickName || maskedPhone.value || '去登录'
  })

  // VIP等级名称
  const vipName = computed(() => {
    if (!isVip.value)
      return '普通用户'
    const levelNames: Record<number, string> = {
      1: '月度会员',
      2: '季度会员',
      3: '年度会员',
      4: '永久会员',
    }
    return levelNames[userInfo.value.vipLevel || 1] || 'VIP会员'
  })

  // 设置用户信息
  function setUserInfo(info: UserInfo) {
    userInfo.value = { ...userInfo.value, ...info }
    // 持久化到本地存储
    uni.setStorageSync(`${_Prefix}_USER_INFO`, JSON.stringify(userInfo.value))
  }

  // 登录成功后设置用户信息
  function login(info: UserInfo) {
    setUserInfo(info)
    // 存储 token
    if (info.token) {
      token.value = info.token
      uni.setStorageSync(`${_Prefix}_ACCESS_TOKEN`, info.token)
    }
  }

  // 更新用户信息（部分更新）
  function updateUserInfo(info: Partial<UserInfo>) {
    userInfo.value = { ...userInfo.value, ...info }
    uni.setStorageSync(`${_Prefix}_USER_INFO`, JSON.stringify(userInfo.value))
  }

  // 退出登录
  function logout() {
    userInfo.value = {}
    uni.removeStorageSync(`${_Prefix}_USER_INFO`)
    uni.removeStorageSync(`${_Prefix}_ACCESS_TOKEN`)
  }

  // 从本地存储恢复用户信息
  function restoreUserInfo() {
    try {
      const storedUserInfo = uni.getStorageSync(`${_Prefix}_USER_INFO`)
      if (storedUserInfo) {
        userInfo.value = JSON.parse(storedUserInfo)
      }

      token.value = uni.getStorageSync(`${_Prefix}_ACCESS_TOKEN`)
    }
    catch (e) {
      console.error('恢复用户信息失败', e)
    }
  }

  // 初始化时恢复用户信息
  restoreUserInfo()

  return {
    token,
    userInfo,
    isLoggedIn,
    isVip,
    maskedPhone,
    displayName,
    vipName,
    setUserInfo,
    login,
    updateUserInfo,
    logout,
    restoreUserInfo,
  }
})
