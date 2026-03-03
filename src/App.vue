<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-global-style />
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <router-view />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NGlobalStyle, NLoadingBarProvider, NMessageProvider, NNotificationProvider, type GlobalThemeOverrides } from 'naive-ui';

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#0f766e',
    primaryColorHover: '#0d9488',
    primaryColorPressed: '#115e59',
    borderRadius: '14px'
  }
};
</script>

