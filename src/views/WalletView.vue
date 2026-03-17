<template>
  <div class="wallet-page">
    <!-- 账户概览 -->
    <GlassPanel>
      <h2 class="section-title">账户概览</h2>
      <div class="stat-grid">
        <StatCard label="账户余额" :value="money(balance)" />
        <StatCard label="库存总量" :value="stats?.totalCount ?? 0" />
        <StatCard label="在售数量" :value="stats?.onSaleCount ?? 0" />
        <StatCard label="估算总值" :value="money(stats?.totalValue)" />
      </div>
    </GlassPanel>

    <!-- 钱包余额 -->
    <GlassPanel>
      <h2 class="section-title">钱包余额</h2>
      <div class="balance">￥{{ formatNumber(balance) }}</div>
      
      <div class="wallet-actions">
        <!-- 充值卡片 -->
        <div class="action-card">
          <div class="card-header">
            <span class="card-title">充值</span>
          </div>
          
          <div class="amount-options">
            <div
              v-for="amount in presetAmounts"
              :key="amount"
              class="amount-item"
              :class="{ active: rechargeAmount === amount }"
              @click="rechargeAmount = amount"
            >
              <span class="amount-value">￥{{ amount }}</span>
              <span class="amount-pay">实付 ￥{{ amount.toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="custom-amount">
            <span class="input-prefix">￥</span>
            <input
              type="number"
              v-model.number="customRechargeAmount"
              placeholder="输入自定义金额"
              class="custom-input"
              @focus="rechargeAmount = null"
            />
          </div>
          
          <div class="payment-methods">
            <div class="payment-label">支付方式</div>
            <div class="payment-options">
              <div
                class="payment-item"
                :class="{ active: paymentMethod === 'alipay' }"
                @click="paymentMethod = 'alipay'"
              >
                <div class="payment-icon alipay">
                  <svg viewBox="0 0 1024 1024" width="22" height="22">
                    <path fill="#06B4FD" d="M230.771014 576.556522c-12.614493 9.646377-25.228986 23.744928-28.93913 42.295652-5.194203 24.486957-0.742029 55.652174 22.26087 80.13913 28.93913 28.93913 72.718841 37.101449 92.011594 38.585508 51.2 3.710145 106.110145-22.26087 147.663768-50.457971 16.324638-11.130435 43.77971-34.133333 70.492754-69.750725-59.362319-30.423188-133.565217-64.556522-212.22029-61.588406-41.553623 1.484058-70.492754 9.646377-91.269566 20.776812zM983.188406 712.347826c25.971014-61.588406 40.811594-129.113043 40.811594-200.347826 0-281.971014-230.028986-512-512-512S0 230.028986 0 512s230.028986 512 512 512c170.666667 0 321.298551-83.849275 414.794203-212.22029C838.492754 768.742029 693.797101 696.023188 604.011594 652.985507c-42.295652 48.973913-105.368116 97.205797-176.602898 117.982609-44.521739 13.356522-85.333333 18.550725-126.886957 9.646377-42.295652-8.904348-72.718841-28.197101-90.527536-47.489855-8.904348-10.388406-19.292754-22.26087-27.455073-37.843479 0.742029 0.742029 0.742029 2.226087 0.742029 2.968116 0 0-4.452174-7.42029-7.420289-19.292753-1.484058-5.936232-2.968116-11.872464-3.710145-17.808696-0.742029-4.452174-0.742029-8.904348 0-12.614493-0.742029-7.42029 0-15.582609 1.484058-23.744927 4.452174-20.776812 12.614493-43.77971 35.617391-65.298551 48.973913-48.231884 115.014493-50.457971 149.147826-50.457971 50.457971 0.742029 138.017391 22.26087 212.22029 48.973913 20.776812-43.77971 34.133333-89.785507 42.295652-121.692754H304.973913v-33.391304h158.052174v-66.782609H272.324638v-34.133333h190.701449v-66.782609c0-8.904348 2.226087-16.324638 16.324638-16.324637h74.944927v83.107246h207.026087v33.391304H554.295652v66.782609H719.768116S702.701449 494.933333 651.501449 586.202899c115.014493 40.811594 277.518841 104.626087 331.686957 126.144927z m0 0"/>
                  </svg>
                </div>
                <span>支付宝</span>
              </div>
              <div
                class="payment-item"
                :class="{ active: paymentMethod === 'wechat' }"
                @click="paymentMethod = 'wechat'"
              >
                <div class="payment-icon wechat">
                  <svg viewBox="0 0 1024 1024" width="22" height="22">
                    <path fill="#4CBF00" d="M1024 619.52c0-143.36-138.24-256-307.2-256s-307.2 112.64-307.2 256 138.24 256 307.2 256c30.72 0 61.44-5.12 92.16-10.24l97.28 51.2-25.6-76.8c87.04-51.2 143.36-128 143.36-220.16z m-414.72-40.96c-30.72 0-51.2-20.48-51.2-51.2s20.48-51.2 51.2-51.2 51.2 20.48 51.2 51.2c0 25.6-25.6 51.2-51.2 51.2z m209.92 0c-30.72 0-51.2-20.48-51.2-51.2s20.48-51.2 51.2-51.2 51.2 20.48 51.2 51.2c0 25.6-25.6 51.2-51.2 51.2z"/>
                    <path fill="#4CBF00" d="M358.4 609.28c0-158.72 153.6-286.72 348.16-286.72h15.36c-40.96-133.12-179.2-235.52-353.28-235.52-204.8 0-368.64 138.24-368.64 307.2 0 107.52 66.56 204.8 168.96 256l-30.72 92.16L256 686.08c35.84 10.24 71.68 15.36 112.64 15.36h10.24c-15.36-30.72-20.48-61.44-20.48-92.16z m138.24-414.72c35.84 0 66.56 30.72 66.56 66.56s-30.72 66.56-66.56 66.56C460.8 322.56 430.08 291.84 430.08 256S460.8 194.56 496.64 194.56zM245.76 322.56c-35.84 0-61.44-30.72-61.44-66.56s30.72-66.56 66.56-66.56 61.44 30.72 61.44 66.56-30.72 66.56-66.56 66.56z"/>
                  </svg>
                </div>
                <span>微信</span>
              </div>
            </div>
          </div>
          
          <n-button type="primary" block size="large" class="action-btn" @click="recharge">
            立即充值
          </n-button>
          
          <div class="action-tip">充值后余额立即到账，支持多种支付方式</div>
        </div>
        
        <!-- 提现卡片 -->
        <div class="action-card">
          <div class="card-header">
            <span class="card-title">提现</span>
            <span class="current-balance">可提现 ￥{{ formatNumber(balance) }}</span>
          </div>
          
          <div class="amount-options">
            <div
              v-for="amount in presetAmounts"
              :key="amount"
              class="amount-item"
              :class="{ active: withdrawAmount === amount, disabled: amount > balance }"
              @click="amount <= balance && (withdrawAmount = amount)"
            >
              <span class="amount-value">￥{{ amount }}</span>
            </div>
          </div>
          
          <div class="custom-amount">
            <span class="input-prefix">￥</span>
            <input
              type="number"
              v-model.number="customWithdrawAmount"
              placeholder="输入提现金额"
              class="custom-input"
              :max="balance"
              @focus="withdrawAmount = null"
            />
          </div>
          
          <div class="withdraw-account">
            <div class="account-label">提现账户</div>
            <n-input
              v-model:value="withdrawAccount"
              placeholder="请输入支付宝账号或银行卡号"
              clearable
            />
          </div>
          
          <n-button type="warning" block size="large" class="action-btn" @click="withdraw">
            立即提现
          </n-button>
          
          <div class="action-tip">提现申请将在1-3个工作日内到账</div>
        </div>
      </div>
    </GlassPanel>

    <!-- 资金流水 -->
    <GlassPanel>
      <h2 class="section-title">资金流水</h2>
      <n-data-table :columns="columns" :data="logs" :pagination="false" :scroll-x="950" />
      <n-pagination
        style="margin-top: 12px"
        v-model:page="query.pageNum"
        v-model:page-size="query.pageSize"
        :item-count="total"
        show-size-picker
        @update:page="loadLogs"
        @update:page-size="loadLogs"
      />
    </GlassPanel>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { NButton, NDataTable, NInput, NPagination, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import StatCard from '@/components/StatCard.vue';
import { inventoryApi, walletApi } from '@/api/modules';
import type { InventoryStatistics, WalletLog } from '@/types/api';
import { formatDateTime, money } from '@/types/format';

const message = useMessage();
const isMobile = computed(() => window.innerWidth < 900);
const balance = ref(0);
const stats = ref<InventoryStatistics>();
const logs = ref<WalletLog[]>([]);
const total = ref(0);
const query = reactive({ pageNum: 1, pageSize: 10 });

// 充值相关
const presetAmounts = [20, 50, 100, 200, 500];
const rechargeAmount = ref<number | null>(null);
const customRechargeAmount = ref<number | null>(null);
const paymentMethod = ref<'alipay' | 'wechat'>('alipay');

// 提现相关
const withdrawAmount = ref<number | null>(null);
const customWithdrawAmount = ref<number | null>(null);
const withdrawAccount = ref('');

// 监听自定义金额输入
watch(customRechargeAmount, (val) => {
  if (val !== null && val > 0) {
    rechargeAmount.value = null;
  }
});

watch(customWithdrawAmount, (val) => {
  if (val !== null && val > 0) {
    withdrawAmount.value = null;
  }
});

// 获取实际充值金额
const getRechargeAmount = () => {
  return customRechargeAmount.value || rechargeAmount.value;
};

// 获取实际提现金额
const getWithdrawAmount = () => {
  return customWithdrawAmount.value || withdrawAmount.value;
};

const formatNumber = (value: number) => {
  return value.toFixed(2);
};

const columns: DataTableColumns<WalletLog> = [
  { title: '类型', key: 'typeName', width: 120 },
  { title: '金额', key: 'amount', render: (row) => money(row.amount) },
  { title: '变更后余额', key: 'balanceAfter', render: (row) => money(row.balanceAfter) },
  { title: '关联订单', key: 'orderNo', render: (row) => row.orderNo || '-' },
  { title: '备注', key: 'remark', minWidth: 180, render: (row) => row.remark || '-' },
  { title: '时间', key: 'createTime', minWidth: 160, render: (row) => formatDateTime(row.createTime) }
];

const loadBalance = async () => {
  const value = await walletApi.balance();
  balance.value = Number(value || 0);
};

const loadStats = async () => {
  stats.value = await inventoryApi.statistics();
};

const loadLogs = async () => {
  const data = await walletApi.logs({ ...query });
  logs.value = data.list;
  total.value = data.total;
};

const recharge = async () => {
  const amount = getRechargeAmount();
  if (!amount || amount <= 0) {
    message.warning('请选择或输入充值金额');
    return;
  }
  try {
    await walletApi.recharge(amount);
    message.success(`充值成功，通过${paymentMethod.value === 'alipay' ? '支付宝' : '微信'}支付 ￥${amount}`);
    customRechargeAmount.value = null;
    await Promise.all([loadBalance(), loadStats(), loadLogs()]);
  } catch (error: any) {
    message.error(error.message || '充值失败');
  }
};

const withdraw = async () => {
  const amount = getWithdrawAmount();
  if (!amount || amount <= 0) {
    message.warning('请选择或输入提现金额');
    return;
  }
  if (amount > balance.value) {
    message.warning('提现金额不能超过可用余额');
    return;
  }
  if (!withdrawAccount.value.trim()) {
    message.warning('请输入提现账户');
    return;
  }
  try {
    await walletApi.withdraw(amount);
    message.success(`提现申请已提交，￥${amount} 将在1-3个工作日内到账`);
    customWithdrawAmount.value = null;
    withdrawAccount.value = '';
    await Promise.all([loadBalance(), loadStats(), loadLogs()]);
  } catch (error: any) {
    message.error(error.message || '提现失败');
  }
};

onMounted(async () => {
  try {
    await Promise.all([loadBalance(), loadStats(), loadLogs()]);
  } catch (error: any) {
    message.error(error.message || '加载数据失败');
  }
});
</script>

<style scoped>
.wallet-page {
  display: grid;
  gap: 14px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.balance {
  font-size: clamp(34px, 7vw, 54px);
  font-weight: 700;
  margin-bottom: 20px;
  color: #0f766e;
}

/* 钱包操作区域 */
.wallet-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.action-card {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.current-balance {
  font-size: 13px;
  color: #0f766e;
  font-weight: 500;
}

/* 金额选项 */
.amount-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.amount-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.amount-item:hover {
  border-color: #0f766e;
  background: #f0fdfa;
}

.amount-item.active {
  border-color: #0f766e;
  background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
}

.amount-item.active .amount-value,
.amount-item.active .amount-pay {
  color: white;
}

.amount-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.amount-item.disabled:hover {
  border-color: #e2e8f0;
  background: #f8fafc;
}

.amount-value {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.amount-pay {
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
}

/* 自定义金额输入 */
.custom-amount {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 14px;
  margin-bottom: 16px;
  transition: border-color 0.2s ease;
}

.custom-amount:focus-within {
  border-color: #0f766e;
}

.input-prefix {
  font-size: 18px;
  font-weight: 600;
  color: #0f766e;
  margin-right: 8px;
}

.custom-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  padding: 14px 0;
  outline: none;
  color: #1a1a1a;
}

.custom-input::placeholder {
  color: #94a3b8;
}

/* 支付方式 */
.payment-methods {
  margin-bottom: 16px;
}

.payment-label,
.account-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 10px;
}

.payment-options {
  display: flex;
  gap: 12px;
}

.payment-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #475569;
}

.payment-item:hover {
  border-color: #cbd5e1;
}

.payment-item.active {
  border-color: #0f766e;
  background: #f0fdfa;
  color: #0f766e;
}

.payment-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-icon.alipay {
  color: #1677ff;
}

.payment-icon.wechat {
  color: #07c160;
}

/* 提现账户 */
.withdraw-account {
  margin-bottom: 16px;
}

/* 操作按钮 */
.action-btn {
  margin-top: 4px;
  font-weight: 600;
}

/* 提示文字 */
.action-tip {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 12px;
}

/* 响应式 */
@media (max-width: 900px) {
  .wallet-actions {
    grid-template-columns: 1fr;
  }
  
  .amount-options {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

