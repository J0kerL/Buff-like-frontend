<template>
  <div class="orders-page">
    <GlassPanel>
      <div class="row-head">
        <h2 class="section-title">订单中心</h2>
        <n-select v-model:value="status" :options="statusOptions" clearable placeholder="筛选状态" style="width: 180px" />
      </div>
      <n-tabs type="segment" animated @update:value="onTabChange">
        <n-tab-pane name="buy" tab="我买到的">
          <n-data-table :columns="buyColumns" :data="buyOrders" :pagination="false" :scroll-x="980" :row-class-name="getRowClass" />
          <n-pagination
            style="margin-top: 12px"
            v-model:page="buyPage.pageNum"
            v-model:page-size="buyPage.pageSize"
            :item-count="buyTotal"
            @update:page="loadBuy"
            @update:page-size="loadBuy"
          />
        </n-tab-pane>
        <n-tab-pane name="sell" tab="我卖出的">
          <n-data-table :columns="sellColumns" :data="sellOrders" :pagination="false" :scroll-x="980" :row-class-name="getRowClass" />
          <n-pagination
            style="margin-top: 12px"
            v-model:page="sellPage.pageNum"
            v-model:page-size="sellPage.pageSize"
            :item-count="sellTotal"
            @update:page="loadSell"
            @update:page-size="loadSell"
          />
        </n-tab-pane>
      </n-tabs>
    </GlassPanel>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { NButton, NDataTable, NPagination, NSelect, NTabPane, NTabs, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import { orderApi } from '@/api/modules';
import type { OrderItem } from '@/types/api';
import { formatDateTime, money } from '@/types/format';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';

const route = useRoute();
const message = useMessage();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const status = ref<number | null>(null);
const currentTab = ref<'buy' | 'sell'>('buy');
const highlightOrderId = ref<number | null>(null);

const statusOptions = [
  { label: '待支付', value: 0 },
  { label: '待发货', value: 1 },
  { label: '已发货', value: 2 },
  { label: '交易成功', value: 3 },
  { label: '已取消', value: 4 }
];

const statusText = (value: number) => {
  if (value === 0) return '待支付';
  if (value === 1) return '待发货';
  if (value === 2) return '已发货';
  if (value === 3) return '交易成功';
  return '已取消';
};

const buyOrders = ref<OrderItem[]>([]);
const sellOrders = ref<OrderItem[]>([]);
const buyTotal = ref(0);
const sellTotal = ref(0);
const buyPage = reactive({ pageNum: 1, pageSize: 10 });
const sellPage = reactive({ pageNum: 1, pageSize: 10 });

const actionButton = (label: string, action: () => Promise<void>, type: 'primary' | 'warning' | 'error' = 'primary') =>
  h(
    NButton,
    {
      size: 'small',
      type,
      onClick: async () => {
        await action();
      }
    },
    { default: () => label }
  );

const wearLabel = (v?: number) => {
  if (v == null) return null;
  if (v <= 0.07) return '崭新出厂';
  if (v <= 0.15) return '略有磨损';
  if (v <= 0.38) return '久经沙场';
  if (v <= 0.45) return '破损不堪';
  return '战痕累累';
};

const buyColumns: DataTableColumns<OrderItem> = [
  { title: '订单号', key: 'orderNo', minWidth: 160 },
  { title: '物品', key: 'itemName', minWidth: 140 },
  { title: '金额', key: 'totalAmount', render: (row) => money(row.totalAmount) },
  { title: '状态', key: 'status', render: (row) => statusText(row.status) },
  { title: '下单时间', key: 'createTime', minWidth: 160, render: (row) => formatDateTime(row.createTime) },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    render: (row) => {
      if (row.status === 0) {
        return h('div', { style: 'display:flex;gap:8px;' }, [
          actionButton('支付', () => runAction(() => orderApi.pay(row.id), '支付成功')),
          actionButton('取消', () => runAction(() => orderApi.cancel(row.id)), 'error')
        ]);
      }
      if (row.status === 2) {
        return actionButton('确认收货', () => runAction(() => orderApi.confirm(row.id)), 'warning');
      }
      return '-';
    }
  }
];

const sellColumns: DataTableColumns<OrderItem> = [
  { title: '订单号', key: 'orderNo', minWidth: 160 },
  { title: '物品', key: 'itemName', minWidth: 160, render: (row) =>
      h('div', null, [
        h('div', null, row.itemName),
        row.wearValue != null
          ? h('div', { style: 'font-size:12px;color:#999;margin-top:2px;' },
              `${wearLabel(row.wearValue)}  ${row.wearValue.toFixed(4)}`)
          : null
      ])
  },
  { title: '金额', key: 'totalAmount', render: (row) => money(row.totalAmount) },
  { title: '状态', key: 'status', render: (row) => statusText(row.status) },
  { title: '下单时间', key: 'createTime', minWidth: 160, render: (row) => formatDateTime(row.createTime) },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    render: (row) => {
      if (row.status === 1) {
        return h('div', { style: 'display:flex;gap:8px;' }, [
          actionButton('发货', () => runAction(() => orderApi.deliver(row.id), '发货成功'), 'primary'),
          actionButton('拒绝发货', () => runAction(() => orderApi.reject(row.id), '已拒绝发货，款项已退还买家'), 'error')
        ]);
      }
      return '-';
    }
  }
];

const getRowClass = (row: OrderItem) => {
  return row.id === highlightOrderId.value ? 'highlight-row' : '';
};

const runAction = async (fn: () => Promise<void>, successMsg = '操作成功') => {
  try {
    await fn();
    message.success(successMsg);
    await Promise.all([loadBuy(), loadSell(), authStore.loadCurrentUser()]);
  } catch (error: any) {
    message.error(error.message || '操作失败');
  }
};

const loadBuy = async () => {
  const data = await orderApi.myBuy({ ...buyPage, status: status.value ?? undefined });
  buyOrders.value = data.list;
  buyTotal.value = data.total;
};

const loadSell = async () => {
  const data = await orderApi.mySell({ ...sellPage, status: status.value ?? undefined });
  sellOrders.value = data.list;
  sellTotal.value = data.total;
};

const onTabChange = (name: string) => {
  currentTab.value = name as 'buy' | 'sell';
  if (currentTab.value === 'buy') {
    loadBuy().catch((error: any) => message.error(error.message || '加载订单失败'));
  } else {
    loadSell().catch((error: any) => message.error(error.message || '加载订单失败'));
  }
};

watch(status, () => {
  if (currentTab.value === 'buy') {
    loadBuy().catch((error: any) => message.error(error.message || '加载订单失败'));
  } else {
    loadSell().catch((error: any) => message.error(error.message || '加载订单失败'));
  }
});

// 处理从通知跳转过来的情况
const handleOrderFromNotification = async () => {
  const orderId = route.query.orderId;
  if (orderId) {
    const id = Number(orderId);
    highlightOrderId.value = id;
    // 标记该订单相关的通知为已读
    await notificationStore.markAsReadByOrderId(id);
  }
};

onMounted(async () => {
  try {
    await Promise.all([loadBuy(), loadSell(), authStore.loadCurrentUser()]);
    await handleOrderFromNotification();
  } catch (error: any) {
    message.error(error.message || '加载订单失败');
  }
});
</script>

<style scoped>
.orders-page {
  display: grid;
  gap: 14px;
}

.row-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
</style>

<style>
.highlight-row {
  background-color: #fef3c7 !important;
  animation: fade-highlight 3s ease-out forwards;
}

@keyframes fade-highlight {
  0% {
    background-color: #fef3c7;
  }
  100% {
    background-color: transparent;
  }
}
</style>

