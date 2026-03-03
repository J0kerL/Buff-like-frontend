<template>
  <div class="inventory-page">
    <GlassPanel>
      <h2 class="section-title">库存筛选</h2>
      <n-grid :cols="isMobile ? 1 : 5" :x-gap="10" :y-gap="10">
        <n-grid-item>
          <n-input v-model:value="query.keyword" placeholder="名称关键词" clearable />
        </n-grid-item>
        <n-grid-item>
          <n-select v-model:value="query.status" :options="statusOptions" clearable placeholder="状态" />
        </n-grid-item>
        <n-grid-item>
          <n-input v-model:value="query.type" placeholder="类型" clearable />
        </n-grid-item>
        <n-grid-item>
          <n-input v-model:value="query.rarity" placeholder="稀有度" clearable />
        </n-grid-item>
        <n-grid-item>
          <n-space>
            <n-button @click="load">查询</n-button>
            <n-button quaternary @click="reset">重置</n-button>
          </n-space>
        </n-grid-item>
      </n-grid>
    </GlassPanel>

    <GlassPanel>
      <h2 class="section-title">我的库存</h2>
      <n-data-table :columns="columns" :data="items" :pagination="false" :scroll-x="920" />
      <n-pagination
        style="margin-top: 12px"
        v-model:page="query.pageNum"
        v-model:page-size="query.pageSize"
        :item-count="total"
        show-size-picker
        @update:page="load"
        @update:page-size="load"
      />
    </GlassPanel>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue';
import { NButton, NDataTable, NGrid, NGridItem, NImage, NInput, NPagination, NSelect, NSpace, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import { inventoryApi } from '@/api/modules';
import type { InventoryItem } from '@/types/api';
import { formatDateTime, wearText } from '@/types/format';

const message = useMessage();
const isMobile = computed(() => window.innerWidth < 900);
const items = ref<InventoryItem[]>([]);
const total = ref(0);

const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status: null as number | null,
  type: '',
  rarity: '',
  keyword: ''
});

const statusText = (status: number) => {
  if (status === 0) return '在库';
  if (status === 1) return '出售中';
  return '交易锁定';
};

const statusOptions = [
  { label: '在库', value: 0 },
  { label: '出售中', value: 1 },
  { label: '交易锁定', value: 2 }
];

const columns: DataTableColumns<InventoryItem> = [
  { title: 'ID', key: 'id', width: 70 },
  {
    title: '图标',
    key: 'iconUrl',
    width: 84,
    render: (row) =>
      h(NImage, {
        src: row.iconUrl,
        width: 42,
        height: 42,
        fallbackSrc: 'https://dummyimage.com/42x42/e2e8f0/64748b'
      })
  },
  { title: '名称', key: 'itemName', minWidth: 180 },
  { title: '磨损', key: 'wearValue', render: (row) => wearText(row.wearValue) },
  { title: '图案', key: 'patternIndex' },
  { title: '状态', key: 'status', render: (row) => statusText(row.status) },
  { title: '获得时间', key: 'getTime', minWidth: 180, render: (row) => formatDateTime(row.getTime) }
];

async function load() {
  try {
    const data = await inventoryApi.list({ ...query });
    items.value = data.list;
    total.value = data.total;
  } catch (error: any) {
    message.error(error.message || '加载库存失败');
  }
}

function reset() {
  query.pageNum = 1;
  query.pageSize = 10;
  query.status = null;
  query.type = '';
  query.rarity = '';
  query.keyword = '';
  load();
}

onMounted(load);
</script>

<style scoped>
.inventory-page {
  display: grid;
  gap: 14px;
}

</style>

