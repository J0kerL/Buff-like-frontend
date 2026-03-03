<template>
  <div class="market-page">
    <GlassPanel>
      <div class="row-head">
        <h2 class="section-title">市场挂单</h2>
        <n-button type="primary" @click="openCreate">上架库存物品</n-button>
      </div>

      <n-grid :cols="isMobile ? 1 : 4" :x-gap="10" :y-gap="10" style="margin-bottom: 10px">
        <n-grid-item>
          <n-input v-model:value="query.keyword" placeholder="关键词搜索" clearable />
        </n-grid-item>
        <n-grid-item>
          <n-input-number v-model:value="query.minPrice" :min="0" placeholder="最低价" style="width: 100%" />
        </n-grid-item>
        <n-grid-item>
          <n-input-number v-model:value="query.maxPrice" :min="0" placeholder="最高价" style="width: 100%" />
        </n-grid-item>
        <n-grid-item>
          <n-select v-model:value="query.sortField" :options="sortOptions" />
        </n-grid-item>
      </n-grid>

      <n-space>
        <n-button @click="loadListings">查询</n-button>
        <n-button quaternary @click="reset">重置</n-button>
      </n-space>

      <div class="listing-grid">
        <div class="listing-card" v-for="item in listings" :key="item.id">
          <n-image :src="item.iconUrl" object-fit="cover" width="100%" height="170" fallback-src="https://dummyimage.com/420x170/e2e8f0/64748b" />
          <div class="info">
            <h3>{{ item.itemName }}</h3>
            <div>卖家：{{ item.sellerName }}</div>
            <div>磨损：{{ wearText(item.wearValue) }}</div>
            <div class="price">{{ money(item.price) }}</div>
            <n-button type="primary" block @click="buy(item.id)">立即购买</n-button>
          </div>
        </div>
      </div>

      <n-pagination
        v-model:page="query.pageNum"
        v-model:page-size="query.pageSize"
        :item-count="total"
        :page-sizes="[12, 20, 40]"
        show-size-picker
        @update:page="loadListings"
        @update:page-size="loadListings"
      />
    </GlassPanel>

    <GlassPanel>
      <h2 class="section-title">我的挂单</h2>
      <n-data-table :columns="myColumns" :data="myListings" :pagination="false" :scroll-x="780" />
      <n-pagination
        style="margin-top: 12px"
        v-model:page="myPage.pageNum"
        v-model:page-size="myPage.pageSize"
        :item-count="myTotal"
        @update:page="loadMyListings"
        @update:page-size="loadMyListings"
      />
    </GlassPanel>

    <n-modal v-model:show="createModal" preset="card" title="上架库存" style="max-width: 460px">
      <n-form label-placement="top">
        <n-form-item label="库存物品">
          <n-select
            v-model:value="createForm.inventoryId"
            :options="inventoryOptions"
            placeholder="选择库存物品"
          />
        </n-form-item>
        <n-form-item label="售价">
          <n-input-number v-model:value="createForm.price" :min="0.01" style="width: 100%" />
        </n-form-item>
      </n-form>
      <n-space justify="end">
        <n-button @click="createModal = false">取消</n-button>
        <n-button type="primary" @click="createListing">确认上架</n-button>
      </n-space>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue';
import { NButton, NDataTable, NForm, NFormItem, NGrid, NGridItem, NImage, NInput, NInputNumber, NModal, NPagination, NSelect, NSpace, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import { inventoryApi, marketApi, orderApi } from '@/api/modules';
import { money, wearText } from '@/types/format';
import type { DataTableColumns } from 'naive-ui';
import type { InventoryItem, MarketListing } from '@/types/api';

const message = useMessage();
const isMobile = computed(() => window.innerWidth < 900);

const query = reactive({
  keyword: '',
  minPrice: null as number | null,
  maxPrice: null as number | null,
  sortField: 'price',
  sortOrder: 'asc',
  pageNum: 1,
  pageSize: 12
});

const sortOptions = [
  { label: '按价格', value: 'price' },
  { label: '按发布时间', value: 'createTime' }
];

const listings = ref<MarketListing[]>([]);
const total = ref(0);

const myPage = reactive({ pageNum: 1, pageSize: 10 });
const myListings = ref<MarketListing[]>([]);
const myTotal = ref(0);

const createModal = ref(false);
const createForm = reactive({
  inventoryId: null as number | null,
  price: 0.01
});
const inventoryOptions = ref<{ label: string; value: number }[]>([]);

const myColumns: DataTableColumns<MarketListing> = [
  { title: 'ID', key: 'id', width: 70 },
  { title: '名称', key: 'itemName' },
  { title: '价格', key: 'price', render: (row) => money(row.price) },
  { title: '状态', key: 'status', render: () => '在售中' },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render: (row) => h(NButton, { size: 'small', type: 'error', ghost: true, onClick: () => cancelListing(row.id) }, { default: () => '下架' })
  }
];

const loadListings = async () => {
  try {
    const data = await marketApi.listings({ ...query });
    listings.value = data.list;
    total.value = data.total;
  } catch (error: any) {
    message.error(error.message || '加载失败');
  }
};

const loadMyListings = async () => {
  try {
    const data = await marketApi.myListings({ ...myPage });
    myListings.value = data.list;
    myTotal.value = data.total;
  } catch (error: any) {
    message.error(error.message || '加载我的挂单失败');
  }
};

const loadInventoryOptions = async () => {
  const data = await inventoryApi.list({ pageNum: 1, pageSize: 100, status: 0 });
  inventoryOptions.value = data.list.map((item: InventoryItem) => ({
    label: `${item.itemName} #${item.id}`,
    value: item.id
  }));
};

const buy = async (id: number) => {
  try {
    const orderNo = await orderApi.create(id);
    message.success(`创建订单成功：${orderNo}`);
    await loadListings();
  } catch (error: any) {
    message.error(error.message || '购买失败');
  }
};

const openCreate = async () => {
  try {
    await loadInventoryOptions();
    createModal.value = true;
  } catch (error: any) {
    message.error(error.message || '加载库存失败');
  }
};

const createListing = async () => {
  if (!createForm.inventoryId || !createForm.price) {
    message.warning('请选择库存并填写价格');
    return;
  }
  try {
    await marketApi.createListing({
      inventoryId: createForm.inventoryId,
      price: createForm.price
    });
    message.success('上架成功');
    createModal.value = false;
    await Promise.all([loadListings(), loadMyListings()]);
  } catch (error: any) {
    message.error(error.message || '上架失败');
  }
};

const cancelListing = async (id: number) => {
  try {
    await marketApi.cancelListing(id);
    message.success('下架成功');
    await Promise.all([loadListings(), loadMyListings()]);
  } catch (error: any) {
    message.error(error.message || '下架失败');
  }
};

const reset = () => {
  query.keyword = '';
  query.minPrice = null;
  query.maxPrice = null;
  query.sortField = 'price';
  query.pageNum = 1;
  query.pageSize = 12;
  loadListings();
};

onMounted(async () => {
  await Promise.all([loadListings(), loadMyListings()]);
});
</script>

<style scoped>
.market-page {
  display: grid;
  gap: 14px;
}

.row-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.listing-grid {
  margin: 14px 0;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.listing-card {
  background: rgba(255, 255, 255, 0.72);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  overflow: hidden;
  transition: transform 0.24s ease;
}

.listing-card:hover {
  transform: translateY(-4px);
}

.info {
  padding: 12px;
  display: grid;
  gap: 6px;
}

.info h3 {
  margin: 0;
  font-size: 16px;
}

.price {
  font-size: 22px;
  color: #0f766e;
  font-weight: 700;
}
</style>

