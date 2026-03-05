<template>
  <div class="auth-wrap">
    <div class="auth-hero">
      <h1>Buff-like Trade Platform</h1>
      <p>仿BUFF的简约现代化饰品交易平台，诚信真实可靠</p>
    </div>

    <div class="auth-card glass-panel">
      <div class="form-header">
        <h2>{{ isLoginMode ? '欢迎回来' : '创建账号' }}</h2>
        <p>{{ isLoginMode ? '输入账号密码进入交易平台' : '填写信息完成注册并自动登录' }}</p>
      </div>

      <div class="form-body">
        <n-form v-if="isLoginMode" label-placement="top" class="custom-form">
          <n-form-item label="用户名" :validation-status="loginErrors.username ? 'error' : undefined" :feedback="loginErrors.username">
            <n-input 
              v-model:value="loginForm.username" 
              placeholder="请输入用户名" 
              @blur="validateLoginField('username')"
            />
          </n-form-item>

          <n-form-item label="密码" :validation-status="loginErrors.password ? 'error' : undefined" :feedback="loginErrors.password">
            <n-input 
              v-model:value="loginForm.password" 
              :type="showLoginPassword ? 'text' : 'password'" 
              placeholder="请输入密码" 
              @blur="validateLoginField('password')"
            >
              <template #suffix>
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showLoginPassword = !showLoginPassword"
                  :title="showLoginPassword ? '隐藏密码' : '显示密码'"
                >
                  <svg v-if="showLoginPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item label="图形验证码" :validation-status="loginErrors.captchaInput ? 'error' : undefined" :feedback="loginErrors.captchaInput">
            <div class="captcha-row">
              <n-input
                v-model:value="loginForm.captchaInput"
                placeholder="请输入验证码"
                @blur="validateLoginField('captchaInput')"
              />
              <button class="captcha-box" type="button" @click="refreshCaptcha" title="点击刷新验证码">
                {{ captchaCode }}
              </button>
            </div>
          </n-form-item>

          <n-button type="primary" block :loading="loading" @click="onLogin">登录</n-button>
        </n-form>

        <n-form v-else label-placement="top" class="custom-form">
          <n-form-item label="用户名" :validation-status="registerErrors.username ? 'error' : undefined" :feedback="registerErrors.username">
            <n-input 
              v-model:value="registerForm.username" 
              placeholder="请输入用户名" 
              @blur="validateRegisterField('username')"
            />
          </n-form-item>

          <n-form-item label="密码" :validation-status="registerErrors.password ? 'error' : undefined" :feedback="registerErrors.password">
            <n-input 
              v-model:value="registerForm.password" 
              :type="showRegisterPassword ? 'text' : 'password'" 
              placeholder="请输入密码" 
              @blur="validateRegisterField('password')"
            >
              <template #suffix>
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showRegisterPassword = !showRegisterPassword"
                  :title="showRegisterPassword ? '隐藏密码' : '显示密码'"
                >
                  <svg v-if="showRegisterPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item label="手机号" :validation-status="registerErrors.mobile ? 'error' : undefined" :feedback="registerErrors.mobile">
            <n-input 
              v-model:value="registerForm.mobile" 
              placeholder="请输入手机号" 
              @blur="validateRegisterField('mobile')"
            />
          </n-form-item>

          <n-form-item label="验证码" :validation-status="registerErrors.code ? 'error' : undefined" :feedback="registerErrors.code">
            <div class="code-row">
              <n-input 
                v-model:value="registerForm.code" 
                placeholder="请输入短信验证码" 
                @blur="validateRegisterField('code')"
              />
              <n-button :disabled="countdown > 0" @click="sendCode">
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </n-button>
            </div>
          </n-form-item>

          <n-button type="primary" block :loading="loading" @click="onRegister">注册并登录</n-button>
        </n-form>
      </div>

      <div class="switch-row">
        <span>{{ isLoginMode ? '没有账号？' : '已有账号？' }}</span>
        <button type="button" class="switch-btn" @click="toggleMode">
          {{ isLoginMode ? '去注册' : '去登录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui';
import { authApi } from '@/api/modules';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const loading = ref(false);
const countdown = ref(0);
const mode = ref<'login' | 'register'>('login');
const captchaCode = ref('');
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
let timer: number | null = null;

const isLoginMode = computed(() => mode.value === 'login');

const loginForm = reactive({
  username: '',
  password: '',
  captchaInput: ''
});

const registerForm = reactive({
  username: '',
  password: '',
  mobile: '',
  code: ''
});

const loginErrors = reactive({
  username: '',
  password: '',
  captchaInput: ''
});

const registerErrors = reactive({
  username: '',
  password: '',
  mobile: '',
  code: ''
});

const createCaptcha = () => {
  const source = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  captchaCode.value = Array.from({ length: 4 })
    .map(() => source[Math.floor(Math.random() * source.length)])
    .join('');
};

const refreshCaptcha = () => {
  createCaptcha();
  loginForm.captchaInput = '';
  loginErrors.captchaInput = '';
};

const validateLoginField = (field: keyof typeof loginForm) => {
  if (field === 'username') {
    loginErrors.username = loginForm.username.trim() ? '' : '请输入用户名';
  }
  if (field === 'password') {
    if (!loginForm.password) {
      loginErrors.password = '请输入密码';
    } else if (loginForm.password.length < 6 || loginForm.password.length > 20) {
      loginErrors.password = '密码长度需为 6-20 位';
    } else {
      loginErrors.password = '';
    }
  }
  if (field === 'captchaInput') {
    if (!loginForm.captchaInput.trim()) {
      loginErrors.captchaInput = '请输入图形验证码';
    } else if (loginForm.captchaInput.trim().toUpperCase() !== captchaCode.value) {
      loginErrors.captchaInput = '图形验证码错误';
    } else {
      loginErrors.captchaInput = '';
    }
  }
};

const validateRegisterField = (field: keyof typeof registerForm) => {
  if (field === 'username') {
    const value = registerForm.username.trim();
    if (!value) {
      registerErrors.username = '请输入用户名';
    } else if (value.length < 3 || value.length > 20) {
      registerErrors.username = '用户名长度需为 3-20 位';
    } else {
      registerErrors.username = '';
    }
  }

  if (field === 'password') {
    const value = registerForm.password;
    if (!value) {
      registerErrors.password = '请输入密码';
    } else if (value.length < 6 || value.length > 20) {
      registerErrors.password = '密码长度需为 6-20 位';
    } else {
      registerErrors.password = '';
    }
  }

  if (field === 'mobile') {
    const mobileReg = /^1[3-9]\d{9}$/;
    if (!registerForm.mobile.trim()) {
      registerErrors.mobile = '请输入手机号';
    } else if (!mobileReg.test(registerForm.mobile.trim())) {
      registerErrors.mobile = '手机号格式不正确';
    } else {
      registerErrors.mobile = '';
    }
  }

  if (field === 'code') {
    if (!registerForm.code.trim()) {
      registerErrors.code = '请输入短信验证码';
    } else {
      registerErrors.code = '';
    }
  }
};

const validateLogin = () => {
  validateLoginField('username');
  validateLoginField('password');
  validateLoginField('captchaInput');
  return !loginErrors.username && !loginErrors.password && !loginErrors.captchaInput;
};

const validateRegister = () => {
  validateRegisterField('username');
  validateRegisterField('password');
  validateRegisterField('mobile');
  validateRegisterField('code');
  return !registerErrors.username && !registerErrors.password && !registerErrors.mobile && !registerErrors.code;
};

const onLogin = async () => {
  if (!validateLogin()) {
    message.warning('请先修正表单错误');
    return;
  }
  loading.value = true;
  try {
    await authStore.login(loginForm.username.trim(), loginForm.password);
    message.success('登录成功');
    router.replace('/dashboard');
  } catch (error: any) {
    message.error(error.message || '登录失败');
    refreshCaptcha();
  } finally {
    loading.value = false;
  }
};

const onRegister = async () => {
  if (!validateRegister()) {
    message.warning('请先修正表单错误');
    return;
  }
  loading.value = true;
  try {
    await authStore.register({
      username: registerForm.username.trim(),
      password: registerForm.password,
      mobile: registerForm.mobile.trim(),
      code: registerForm.code.trim()
    });
    message.success('注册成功');
    router.replace('/dashboard');
  } catch (error: any) {
    message.error(error.message || '注册失败');
  } finally {
    loading.value = false;
  }
};

const sendCode = async () => {
  validateRegisterField('mobile');
  if (registerErrors.mobile) {
    message.warning(registerErrors.mobile);
    return;
  }
  try {
    const code = await authApi.sendCode(registerForm.mobile.trim());
    message.success(`验证码已发送（验证码：${code}）`);
    countdown.value = 60;
    timer = window.setInterval(() => {
      countdown.value -= 1;
      if (countdown.value <= 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  } catch (error: any) {
    message.error(error.message || '发送失败');
  }
};

const toggleMode = () => {
  mode.value = isLoginMode.value ? 'register' : 'login';
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

createCaptcha();
</script>

<style scoped>
.auth-wrap {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 20px;
  align-items: center;
  width: min(1050px, calc(100% - 26px));
  margin: 0 auto;
}

.auth-hero h1 {
  margin: 0;
  font-size: clamp(36px, 7vw, 62px);
  line-height: 1.05;
}

.auth-hero p {
  margin-top: 14px;
  font-size: 18px;
  color: #334155;
}

.auth-card {
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  animation: rise 0.55s ease;
}

.form-header h2 {
  margin: 0;
  font-size: 28px;
}

.form-header p {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 14px;
}

.form-body {
  margin-top: 24px;
}

.custom-form {
  width: 100%;
}

.custom-form :deep(.n-form-item-feedback-wrapper) {
  min-height: 18px;
}

.custom-form :deep(.n-form-item-feedback) {
  font-size: 12px;
  color: #dc2626;
}

.captcha-row,
.code-row {
  display: grid;
  grid-template-columns: 1fr 140px;
  gap: 10px;
  width: 100%;
  align-items: center;
}

.captcha-box {
  position: relative;
  height: 34px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.3em;
  color: #fff;
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(15, 118, 110, 0.25);
}

.captcha-box::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 6px,
    rgba(255, 255, 255, 0.06) 6px,
    rgba(255, 255, 255, 0.06) 12px
  );
  pointer-events: none;
}

.captcha-box:hover {
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 118, 110, 0.3);
}

.captcha-box:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(15, 118, 110, 0.2);
}

.code-row :deep(.n-button) {
  height: 34px;
  border-radius: 6px;
  border: 1px solid #0f766e;
  color: #0f766e;
  font-weight: 600;
  font-size: 13px;
  background: transparent;
  transition: all 0.25s ease;
}

.code-row :deep(.n-button:hover) {
  background: #0f766e;
  color: #fff;
  box-shadow: 0 2px 8px rgba(15, 118, 110, 0.25);
}

.code-row :deep(.n-button:disabled),
.code-row :deep(.n-button[disabled]) {
  border-color: #cbd5e1;
  color: #94a3b8;
  background: #f1f5f9;
}

.switch-row {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.switch-btn {
  border: none;
  background: transparent;
  color: #0f766e;
  cursor: pointer;
  font-weight: 700;
  padding: 0;
}

.switch-btn:hover {
  text-decoration: underline;
}

.password-toggle {
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  line-height: 1;
}

.password-toggle:hover {
  color: #0f766e;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .auth-wrap {
    grid-template-columns: 1fr;
    padding: 16px 0;
  }

  .auth-hero {
    text-align: center;
  }

  .auth-card {
    padding: 24px;
  }
}
</style>
