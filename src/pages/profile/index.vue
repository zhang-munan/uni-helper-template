<script setup lang="ts">
definePage({
  navigationBarTitleText: '我的',
  navigationStyle: 'custom',
})

const userStore = useUserStore()

// 点击头像区域跳转登录页
function handleProfileClick() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
  }
}

// 退出登录
function handleLogout() {
  userStore.logout()
  uni.showToast({ title: '已退出登录', icon: 'success' })
  uni.switchTab({ url: '/pages/home/index' })
}
</script>

<template>
  <view class="min-h-screen flex flex-col bg-slate-50">
    <!-- #ifdef MP-WEIXIN -->
    <uni-nav-bar :fixed="true" :status-bar="true" title="我的" />
    <!-- #endif -->

    <!-- 顶部个人信息 -->
    <view class="profile-section" @click="handleProfileClick">
      <view class="avatar">
        <image
          v-if="userStore?.userInfo?.avatarUrl"
          class="avatar-img"
          :src="userStore.userInfo.avatarUrl"
        />
        <text v-else class="avatar-placeholder">
          U
        </text>
      </view>
      <view class="user-info">
        <view class="username">
          {{ userStore.displayName }}
        </view>
        <view class="phone">
          {{ userStore.maskedPhone || '未绑定手机号' }}
        </view>
      </view>
      <view class="arrow">
        <text class="i-carbon-chevron-right" />
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view v-if="userStore.isLoggedIn" class="menu-item" @click="handleLogout">
        <view class="menu-icon">
          <text class="i-carbon-logout" />
        </view>
        <view class="menu-name">
          退出登录
        </view>
        <view class="menu-arrow">
          <text class="i-carbon-chevron-right" />
        </view>
      </view>
    </view>

    <!-- 登录提示 -->
    <view v-if="!userStore.isLoggedIn" class="login-tip">
      <text>登录后可查看更多功能</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.profile-section {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  margin: 10px;
  border-radius: 12px;

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-right: 15px;

    .avatar-img {
      width: 100%;
      height: 100%;
    }

    .avatar-placeholder {
      font-size: 24px;
      color: #999;
    }
  }

  .user-info {
    flex: 1;

    .username {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .phone {
      font-size: 14px;
      color: #999;
    }
  }

  .arrow {
    color: #ccc;
    font-size: 20px;
  }
}

.menu-section {
  background: #fff;
  margin: 10px;
  border-radius: 12px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .menu-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    font-size: 20px;
    color: #666;
  }

  .menu-name {
    flex: 1;
    font-size: 15px;
    color: #333;
  }

  .menu-arrow {
    color: #ccc;
    font-size: 16px;
  }
}

.login-tip {
  text-align: center;
  padding: 30px;
  color: #999;
  font-size: 14px;
}
</style>
