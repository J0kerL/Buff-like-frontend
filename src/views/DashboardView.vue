<template>
  <div class="dashboard">
    <GlassPanel>
      <h2 class="section-title">账户概览</h2>
      <div class="stat-grid">
        <StatCard label="账户余额" :value="money(balance)" />
        <StatCard label="库存总量" :value="stats?.totalCount ?? 0" />
        <StatCard label="在售数量" :value="stats?.onSaleCount ?? 0" />
        <StatCard label="估算总值" :value="money(stats?.totalValue)" />
      </div>
    </GlassPanel>

    <GlassPanel>
      <div class="row-head">
        <h2 class="section-title">市场热卖</h2>
        <n-button text type="primary" @click="router.push('/market')">查看全部</n-button>
      </div>

      <n-grid :cols="isMobile ? 1 : 3" :x-gap="12" :y-gap="12">
        <n-grid-item v-for="item in listings" :key="item.id">
          <div class="mini-item">
            <n-image :src="item.iconUrl" width="60" height="60" object-fit="cover" fallback-src="https://dummyimage.com/60x60/e2e8f0/64748b" />
            <div class="meta">
              <div class="name">{{ item.itemName }}</div>
              <div class="sub">卖家 {{ item.sellerName }} · 磨损 {{ wearText(item.wearValue) }}</div>
            </div>
            <div class="price">{{ money(item.price) }}</div>
          </div>
        </n-grid-item>
      </n-grid>
    </GlassPanel>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NGrid, NGridItem, NImage, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import StatCard from '@/components/StatCard.vue';
import { inventoryApi, marketApi, walletApi } from '@/api/modules';
import type { InventoryStatistics, MarketListing } from '@/types/api';
import { money, wearText } from '@/types/format';

const router = useRouter();
const message = useMessage();
const stats = ref<InventoryStatistics>();
const listings = ref<MarketListing[]>([]);
const balance = ref(0);

const isMobile = computed(() => window.innerWidth < 900);

const load = async () => {
  try {
    const [inventoryStats, marketList, currentBalance] = await Promise.all([
      inventoryApi.statistics(),
      marketApi.listings({ pageNum: 1, pageSize: 6, sortField: 'createTime', sortOrder: 'desc' }),
      walletApi.balance()
    ]);
    stats.value = inventoryStats;
    listings.value = marketList.list;
    balance.value = Number(currentBalance || 0);
  } catch (error: any) {
    message.error(error.message || '加载失败');
  }
};

onMounted(load);
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 14px;
}

.row-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mini-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.64);
}

.name {
  font-weight: 600;
}

.sub {
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
}

.price {
  color: #0f766e;
  font-weight: 700;
}
</style>
