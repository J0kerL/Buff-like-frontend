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
        <div class="avatar-container">
          <n-image
            :src="user?.avatar || defaultAvatar"
            :fallback-src="defaultAvatar"
            object-fit="cover"
            preview-disabled
            class="avatar-image"
            @click="showAvatarPreview = true"
          />
          <div class="avatar-edit-btn" @click="triggerFileInput">
            <n-icon size="16"><CameraOutline /></n-icon>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
        </div>
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
          <span class="info-value balance">￥{{ formatMoney(user?.balance) }}</span>
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

  <!-- 头像预览弹窗 -->
  <n-modal v-model:show="showAvatarPreview" preset="card" title="我的头像" :style="{ width: '500px', maxWidth: '90vw' }">
    <div class="avatar-preview">
      <n-image
        :src="user?.avatar || defaultAvatar"
        :fallback-src="defaultAvatar"
        object-fit="contain"
        style="width: 100%; max-height: 60vh;"
      />
    </div>
    <template #footer>
      <div class="preview-footer">
        <n-button @click="showAvatarPreview = false">关闭</n-button>
        <n-button type="primary" @click="triggerFileInputFromPreview">
          <template #icon>
            <n-icon><CameraOutline /></n-icon>
          </template>
          更换头像
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NModal, NAvatar, NDivider, NTag, NButton, NForm, NFormItem, NInput, NIcon, NImage, useMessage } from 'naive-ui';
import { CameraOutline } from '@vicons/ionicons5';
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
const fileInput = ref<HTMLInputElement | null>(null);

const visible = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
});

const defaultAvatar = 'https://07ec-86-36-80-22.ngrok-free.app/buff/default-avatar.png';
const showBindDialog = ref(false);
const showAvatarPreview = ref(false);
const steamIdInput = ref('');
const binding = ref(false);
const uploading = ref(false);

const formatMoney = (value?: number) => {
  if (value === undefined || value === null) return '0.00';
  return value.toFixed(2);
};

const handleClose = () => {
  emit('update:show', false);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const triggerFileInputFromPreview = () => {
  showAvatarPreview.value = false;
  triggerFileInput();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    message.error('请选择图片文件');
    return;
  }

  // 验证文件大小（最大2MB）
  if (file.size > 2 * 1024 * 1024) {
    message.error('图片大小不能超过2MB');
    return;
  }

  uploading.value = true;
  try {
    await userApi.uploadAvatar(file);
    message.success('头像更新成功');
    // 重新加载用户信息
    await authStore.loadCurrentUser();
  } catch (error: any) {
    message.error(error?.message || '上传失败，请重试');
  } finally {
    uploading.value = false;
    // 清空input，允许重复选择同一文件
    target.value = '';
  }
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

.avatar-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar-image:hover {
  transform: scale(1.05);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #0f766e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid white;
}

.avatar-edit-btn:hover {
  background: #0d9488;
  transform: scale(1.1);
}

.avatar-preview {
  display: flex;
  justify-content: center;
}

.preview-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
