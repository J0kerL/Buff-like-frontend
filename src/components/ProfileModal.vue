<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    title="个人中心"
    :style="{ width: '420px' }"
    :bordered="false"
    :mask-closable="true"
  >
    <div class="profile-content">
      <div class="profile-header">
        <n-avatar
          round
          :size="80"
          :src="user?.avatar"
          :fallback-src="defaultAvatar"
        />
        <div class="profile-name">{{ user?.username || '用户' }}</div>
      </div>

      <n-divider />

      <div class="profile-info">
        <div class="info-item">
          <span class="info-label">用户ID</span>
          <span class="info-value">{{ user?.id }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">手机号</span>
          <span class="info-value">{{ user?.mobile || '未绑定' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">钱包余额</span>
          <span class="info-value balance">¥{{ formatMoney(user?.balance) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Steam账号</span>
          <div class="steam-status">
            <template v-if="user?.steamId">
              <span class="steam-id">{{ user.steamId }}</span>
              <n-tag type="success" size="small" round>已绑定</n-tag>
            </template>
            <template v-else>
              <span class="unbound-text">未绑定Steam账号</span>
              <n-button type="primary" size="small" text @click="showBindDialog = true">
                去绑定
              </n-button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <n-button @click="handleClose">关闭</n-button>
      </div>
    </template>
  </n-modal>

  <!-- Steam绑定弹窗 -->
  <n-modal
    v-model:show="showBindDialog"
    preset="dialog"
    title="绑定Steam账号"
    positive-text="确认绑定"
    negative-text="取消"
    :positive-button-props="{ disabled: !steamIdInput.trim() || binding }"
    @positive-click="handleBindSteam"
  >
    <n-form>
      <n-form-item label="Steam ID">
        <n-input
          v-model:value="steamIdInput"
          placeholder="请输入您的Steam ID，例如：76561198000000001"
          :disabled="binding"
        />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NModal, NAvatar, NDivider, NTag, NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui';
import type { User } from '@/types/api';
import { userApi } from '@/api/modules';
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{
  show: boolean;
  user: User | null;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
}>();

const message = useMessage();
const authStore = useAuthStore();

const visible = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
});

const defaultAvatar = 'https://07ec-86-36-80-22.ngrok-free.app/buff/default-avatar.png';
const showBindDialog = ref(false);
const steamIdInput = ref('');
const binding = ref(false);

const formatMoney = (value?: number) => {
  if (value === undefined || value === null) return '0.00';
  return value.toFixed(2);
};

const handleClose = () => {
  emit('update:show', false);
};

const handleBindSteam = async () => {
  if (!steamIdInput.value.trim()) {
    message.warning('请输入Steam ID');
    return;
  }

  binding.value = true;
  try {
    await userApi.bindSteam(steamIdInput.value.trim());
    message.success('Steam账号绑定成功');
    showBindDialog.value = false;
    steamIdInput.value = '';
    // 重新加载用户信息
    await authStore.loadCurrentUser();
  } catch (error: any) {
    message.error(error?.message || '绑定失败，请重试');
  } finally {
    binding.value = false;
  }
};
</script>

<script lang="ts">
import { computed } from 'vue';
export default {
  name: 'ProfileModal'
};
</script>

<style scoped>
.profile-content {
  padding: 8px 0;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.info-label {
  color: #666;
  font-size: 14px;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.info-value.balance {
  color: #18a058;
  font-weight: 600;
}

.steam-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.steam-id {
  font-size: 13px;
  color: #333;
  font-family: monospace;
}

.unbound-text {
  font-size: 13px;
  color: #999;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
