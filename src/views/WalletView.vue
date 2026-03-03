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
      <div class="balance">{{ money(balance) }}</div>
      <n-grid :cols="isMobile ? 1 : 2" :x-gap="12" :y-gap="12">
        <n-grid-item>
          <div class="action-card">
            <div class="title">充值</div>
            <n-input-number v-model:value="rechargeAmount" :min="0.01" style="width: 100%" />
            <n-button type="primary" block style="margin-top: 10px" @click="recharge">立即充值</n-button>
          </div>
        </n-grid-item>
        <n-grid-item>
          <div class="action-card">
            <div class="title">提现</div>
            <n-input-number v-model:value="withdrawAmount" :min="0.01" style="width: 100%" />
            <n-button type="warning" block style="margin-top: 10px" @click="withdraw">立即提现</n-button>
          </div>
        </n-grid-item>
      </n-grid>
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
import { computed, onMounted, reactive, ref } from 'vue';
import { NButton, NDataTable, NGrid, NGridItem, NInputNumber, NPagination, useMessage } from 'naive-ui';
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
const rechargeAmount = ref<number | null>(100);
const withdrawAmount = ref<number | null>(50);
const logs = ref<WalletLog[]>([]);
const total = ref(0);
const query = reactive({ pageNum: 1, pageSize: 10 });

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
  if (!rechargeAmount.value) return;
  try {
    await walletApi.recharge(rechargeAmount.value);
    message.success('充值成功');
    await Promise.all([loadBalance(), loadStats(), loadLogs()]);
  } catch (error: any) {
    message.error(error.message || '充值失败');
  }
};

const withdraw = async () => {
  if (!withdrawAmount.value) return;
  try {
    await walletApi.withdraw(withdrawAmount.value);
    message.success('提现成功');
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
  margin-bottom: 14px;
  color: #0f766e;
}

.action-card {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  padding: 14px;
}

.title {
  margin-bottom: 8px;
  font-weight: 600;
}
</style>

