import { un } from '@uni-helper/uni-network'

export const instance = un.create({
  baseUrl: import.meta.env.VITE_BASE_URL,
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.header,
    }
    if (userStore.token) {
      defaultHeaders.Authorization = `Bearer ${userStore.token}`
    }

    config.headers = defaultHeaders
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    const data = response.data
    if (!data || typeof data !== 'object' || data instanceof ArrayBuffer) {
      uni.showToast({ title: '系统错误' })
      return Promise.reject(new Error('系统错误'))
    }

    // 登录过期处理
    if (data.code === 401 || data.code === 'not_login') {
      const userStore = useUserStore()
      userStore.logout()
      uni.navigateTo({ url: '/pages/login/index' })
      return Promise.reject(new Error('登录已过期'))
    }

    // 请求失败处理
    if (!data.success && data.code !== 0) {
      uni.showToast({ title: (data as any).message || '请求失败' })
      return Promise.reject(new Error((data as any).message || '请求失败'))
    }

    return (data as any).data ?? {} as any
  },
  (error) => {
    uni.showToast({ title: '网络错误' })
    return Promise.reject(error)
  },
)
