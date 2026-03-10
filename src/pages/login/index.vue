<script setup lang="ts">
import { phoneLoginApi, sendSmsCodeApi } from '@/api/auth'

definePage({
  navigationBarTitleText: '登录',
  navigationStyle: 'custom',
})

const userStore = useUserStore()

// 表单数据
const phone = ref('')
const code = ref('')
const countdown = ref(0)
const isSending = ref(false)
const isLoading = ref(false)

// 验证手机号
function validatePhone() {
  if (!phone.value) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return false
  }
  return true
}

// 发送验证码
async function sendCode() {
  if (!validatePhone())
    return
  if (countdown.value > 0 || isSending.value)
    return

  isSending.value = true

  try {
    await sendSmsCodeApi({ phone: phone.value })
    uni.showToast({ title: '验证码已发送', icon: 'success' })

    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
  catch (error) {
    console.error('发送验证码失败:', error)
  }
  finally {
    isSending.value = false
  }
}

// 登录
async function handleLogin() {
  if (!validatePhone())
    return
  if (!code.value) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return
  }

  isLoading.value = true

  try {
    const res = await phoneLoginApi({
      phone: phone.value,
      code: code.value,
    })

    // 登录成功，保存用户信息
    userStore.login({
      ...(res as any),
      phone: (res as any)?.phone || phone.value,
    })

    uni.showToast({ title: '登录成功', icon: 'success' })

    // 延迟返回上一页或跳转首页
    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      }
      else {
        uni.switchTab({ url: '/pages/home/index' })
      }
    }, 500)
  }
  catch (error) {
    console.error('登录失败:', error)
  }
  finally {
    isLoading.value = false
  }
}

// 返回
function handleBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  }
  else {
    uni.switchTab({ url: '/pages/home/index' })
  }
}
</script>

<template>
  <view class="login-page">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="bg-circle bg-circle-1" />
      <view class="bg-circle bg-circle-2" />
    </view>

    <!-- 返回按钮 -->
    <!-- #ifdef MP-WEIXIN -->
    <view class="back-btn cursor-pointer" @click="handleBack">
      <view class="i-carbon-arrow-left text-lg" />
    </view>
    <!-- #endif -->

    <!-- Logo 区域 -->
    <view class="logo-section">
      <view class="logo-wrapper">
        <image class="logo" src="@/static/images/logo.png" mode="aspectFit" />
      </view>
      <text class="app-name">
        uni-app 模板
      </text>
      <text class="app-slogan">
        登录接口调用示例
      </text>
    </view>

    <!-- 登录区域 -->
    <view class="login-section">
      <!-- 手机号输入 -->
      <view class="input-group">
        <view class="input-icon">
          <view class="i-carbon-phone text-lg" />
        </view>
        <view class="input-prefix">
          +86
        </view>
        <input
          v-model="phone"
          type="number"
          :maxlength="11"
          placeholder="请输入手机号"
          class="input-field"
        >
      </view>

      <!-- 验证码输入 -->
      <view class="input-group">
        <view class="input-icon">
          <view class="i-carbon-locked text-lg" />
        </view>
        <input
          v-model="code"
          type="number"
          :maxlength="6"
          placeholder="请输入验证码"
          class="input-field"
        >
        <view
          class="code-btn cursor-pointer"
          :class="{ disabled: countdown > 0 || isSending }"
          @click="sendCode"
        >
          <view v-if="isSending" class="i-carbon-progress-bar-round mr-1 animate-spin" />
          <text>{{ countdown > 0 ? `${countdown}s` : isSending ? '发送中' : '获取验证码' }}</text>
        </view>
      </view>

      <!-- 登录按钮 -->
      <button
        class="login-btn cursor-pointer"
        :class="{ 'btn-loading': isLoading }"
        :disabled="isLoading"
        @click="handleLogin"
      >
        <view v-if="isLoading" class="i-carbon-progress-bar-round mr-2 animate-spin" />
        <text>{{ isLoading ? '登录中...' : '登录' }}</text>
      </button>
    </view>

    <!-- 底部装饰 -->
    <view class="footer-decoration">
      <view class="footer-line" />
      <text class="footer-text">
        安全登录
      </text>
      <view class="footer-line" />
    </view>
  </view>
</template>

<style scoped lang="scss">
// 中性色
$gray-50: #f8fafc;
$gray-100: #f1f5f9;
$gray-200: #e2e8f0;
$gray-300: #cbd5e1;
$gray-400: #94a3b8;
$gray-500: #64748b;
$gray-600: #475569;
$gray-900: #0f172a;

.login-page {
  position: relative;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 0 48rpx;
  /* #ifdef H5 */
  padding-top: 160rpx;
  /* #endif */
  /* #ifndef H5 */
  padding-top: 260rpx;
  /* #endif */
  background: linear-gradient(180deg, $gray-50 0%, #fff 50%, $gray-50 100%);
  overflow: hidden;
}

// 背景装饰
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 600rpx;
  overflow: hidden;
  z-index: 0;

  .bg-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(26, 74, 142, 0.08) 0%, rgba(26, 74, 142, 0.02) 100%);
  }

  .bg-circle-1 {
    width: 400rpx;
    height: 400rpx;
    top: -100rpx;
    right: -100rpx;
  }

  .bg-circle-2 {
    width: 300rpx;
    height: 300rpx;
    top: 200rpx;
    left: -150rpx;
  }
}

// 返回按钮
.back-btn {
  position: absolute;
  /* #ifdef H5 */
  top: 30rpx;
  /* #endif */
  /* #ifndef H5 */
  top: 100rpx;
  /* #endif */
  left: 32rpx;
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  color: $gray-600;
  z-index: 10;

  &:active {
    transform: scale(0.95);
    background: $gray-100;
  }
}

// Logo 区域
.logo-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 64rpx;
  z-index: 1;

  .logo-wrapper {
    width: 140rpx;
    height: 140rpx;
    background: #fff;
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 32rpx rgba(26, 74, 142, 0.12);
    margin-bottom: 32rpx;
  }

  .logo {
    width: 100rpx;
    height: 100rpx;
  }

  .app-name {
    font-size: 44rpx;
    font-weight: 700;
    color: $gray-900;
    letter-spacing: 2rpx;
    margin-bottom: 12rpx;
  }

  .app-slogan {
    font-size: 26rpx;
    color: $gray-500;
    letter-spacing: 1rpx;
  }
}

// 登录区域
.login-section {
  position: relative;
  z-index: 1;
  margin-bottom: 48rpx;
}

// 输入框组
.input-group {
  display: flex;
  align-items: center;
  height: 95rpx;
  background: #fff;
  border: 2rpx solid $gray-200;
  border-radius: 20rpx;
  margin-bottom: 16rpx;
  padding: 0 28rpx;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: $uni-color-primary;
    box-shadow: 0 0 0 4rpx rgba(26, 74, 142, 0.1);
  }

  .input-icon {
    width: 44rpx;
    height: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $gray-400;
    margin-right: 16rpx;
  }

  .input-prefix {
    font-size: 30rpx;
    font-weight: 500;
    color: $gray-900;
    padding-right: 20rpx;
    border-right: 2rpx solid $gray-200;
    margin-right: 20rpx;
  }

  .input-field {
    flex: 1;
    height: 100%;
    font-size: 30rpx;
    color: $gray-900;
  }

  .code-btn {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    font-weight: 500;
    color: $uni-color-primary;
    padding: 16rpx 24rpx;
    background: rgba(26, 74, 142, 0.1);
    border-radius: 12rpx;
    white-space: nowrap;

    &.disabled {
      color: $gray-400;
      background: $gray-100;
    }
  }
}

// 登录按钮
.login-btn {
  width: 100%;
  height: 90rpx;
  border-radius: 20rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 52rpx;
  border: none;
  background-color: $uni-color-primary;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(26, 74, 142, 0.25);

  &[disabled] {
    opacity: 0.7;
  }
}

// 底部装饰
.footer-decoration {
  position: absolute;
  bottom: 80rpx;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 80rpx;

  .footer-line {
    flex: 1;
    height: 1rpx;
    background: linear-gradient(90deg, transparent, $gray-200, transparent);
  }

  .footer-text {
    font-size: 22rpx;
    color: $gray-400;
    padding: 0 24rpx;
  }
}

.cursor-pointer {
  cursor: pointer;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
