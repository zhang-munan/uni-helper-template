<script setup lang="ts">
definePage({
  navigationBarTitleText: 'uni-app 模板',
  navigationStyle: 'custom',
})

// 跳转到登录页
function goToLogin() {
  uni.navigateTo({ url: '/pages/login/index' })
}
</script>

<template>
  <view class="min-h-screen flex flex-col">
    <!-- #ifdef MP-WEIXIN -->
    <uni-nav-bar :fixed="true" :status-bar="true" title="uni-app 模板" />
    <!-- #endif -->

    <view class="header">
      <view class="logo">
        <image class="logo-image" mode="widthFix" src="@/static/images/logo.png" />
      </view>
      <view class="head-h1">
        uni-app 模板项目
      </view>
      <view class="head-h2">
        基于 Vue3 + TypeScript + UnoCSS
      </view>
    </view>

    <view class="intro-section">
      <view class="intro-title">
        <view class="intro-title-text">
          项目特性
        </view>
      </view>
      <view class="features">
        <view class="feature">
          <view class="feature-h3">
            Vue 3 + Vite
          </view>
          <view class="feature-h4">
            使用最新的 Vue 3 Composition API 和 Vite 构建
          </view>
        </view>
        <view class="feature">
          <view class="feature-h3">
            TypeScript
          </view>
          <view class="feature-h4">
            完整的类型支持，提升开发体验
          </view>
        </view>
        <view class="feature">
          <view class="feature-h3">
            UnoCSS
          </view>
          <view class="feature-h4">
            原子化 CSS 引擎，高效样式开发
          </view>
        </view>
        <view class="feature">
          <view class="feature-h3">
            跨平台
          </view>
          <view class="feature-h4">
            支持 H5、微信小程序、App 等多端
          </view>
        </view>
      </view>
    </view>

    <view class="intro-section">
      <view class="intro-title">
        <view class="intro-title-text">
          接口调用示例
        </view>
      </view>
      <view class="demo-buttons">
        <button class="main-button btn-primary" @click="goToLogin">
          登录接口示例
        </button>
      </view>
    </view>

    <view class="footer">
      <p>uni-app 模板 2024</p>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.header {
  text-align: center;
  padding-top: 40px;
  color: #000;

  .head-h1 {
    font-size: 24px;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 600;
  }

  .head-h2 {
    color: #7f8c8d;
    font-size: 15px;
  }
}

.logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  .logo-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 8px 20px rgba(106, 137, 204, 0.2);
  }
}

.intro-section {
  background-color: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f2f6;
  margin: 10px;
}

.intro-title {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-title-text {
  color: #2c3e50;
  font-weight: bold;
  font-size: 18px;
}

.features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feature {
  flex: 1 1 calc(50% - 10px);
  background-color: #f8fafc;
  padding: 10px;
  border-radius: 12px;
}

.feature-h3 {
  font-size: 15px;
  color: #2c3e50;
  margin-bottom: 5px;
}

.feature-h4 {
  font-size: 13px;
  color: #7b8a8b;
}

.demo-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-button {
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(106, 137, 204, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 14px;
  font-weight: bold;
  padding: 12px 0;

  &:after {
    box-shadow: 0 0 0 !important;
    border: none;
  }
}

.btn-primary {
  background-color: $uni-color-primary;
  color: #fff;
}

.footer {
  text-align: center;
  padding: 20px 0;
  color: #95a5a6;
  font-size: 13px;
  margin-top: 20px;
}
</style>
