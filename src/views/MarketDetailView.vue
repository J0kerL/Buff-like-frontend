<template>
  <div class="detail-page">
    <GlassPanel>
      <div class="detail-header">
        <n-button quaternary @click="goBack" class="back-btn">← 返回市场</n-button>
        <h2 class="section-title">{{ itemName }}（{{ wearLabel }}）</h2>
      </div>

      <div class="detail-list">
        <div class="detail-card" v-for="item in filteredListings" :key="item.id">
          <div class="detail-image">
            <n-image :src="item.iconUrl" object-fit="contain" width="120" height="100" fallback-src="https://dummyimage.com/420x170/e2e8f0/64748b" preview-disabled />
          </div>
          <div class="detail-info">
            <h3 class="detail-name">{{ item.itemName }}</h3>
            <div class="detail-meta">
              <span class="meta-item"><span class="meta-label">磨损度</span> {{ Number(item.wearValue).toFixed(6) }}</span>
              <span class="meta-item"><span class="meta-label">卖家</span> {{ item.sellerName }}</span>
            </div>
          </div>
          <div class="detail-action">
            <div class="detail-price">{{ money(item.price) }}</div>
            <n-button type="primary" class="buy-btn" @click="buy(item.id)">立即购买</n-button>
          </div>
        </div>

        <div v-if="filteredListings.length === 0" class="empty-state">
          暂无该类饰品在售
        </div>
      </div>
    </GlassPanel>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NButton, NImage, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import { marketApi, orderApi } from '@/api/modules';
import { money, wearText, wearRangeBounds } from '@/types/format';
import type { MarketListing } from '@/types/api';

const message = useMessage();
const route = useRoute();
const router = useRouter();

const itemName = computed(() => (route.query.name as string) || '');
const wearLabel = computed(() => (route.query.wear as string) || '');

const allListings = ref<MarketListing[]>([]);

const filteredListings = computed(() => {
  const [minWear, maxWear] = wearRangeBounds(wearLabel.value);
  return allListings.value.filter(item => {
    const w = Number(item.wearValue);
    return item.itemName === itemName.value && w >= minWear && w < maxWear;
  });
});

const loadListings = async () => {
  try {
    const data = await marketApi.listings({ keyword: itemName.value, pageNum: 1, pageSize: 9999 });
    allListings.value = data.list;
  } catch (error: any) {
    message.error(error.message || '加载失败');
  }
};

const buy = async (id: number) => {
  try {
    const orderNo = await orderApi.create(id);
    message.success(
      () => h('span', { style: 'display: inline-flex; align-items: center; gap: 8px;' }, [
        h('span', null, `创建订单成功：${orderNo}`),
        h(NButton, {
          text: true,
          type: 'primary',
          size: 'small',
          style: 'font-size: 13px;',
          onClick: () => router.push({ name: 'orders' }),
        }, { default: () => '去付款' }),
      ]),
      { duration: 5000 }
    );
    await loadListings();
  } catch (error: any) {
    message.error(error.message || '购买失败');
  }
};

const goBack = () => {
  router.push({ name: 'market' });
};

onMounted(() => {
  loadListings();
});
</script>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header {
  margin-bottom: 24px;
}

.back-btn {
  margin-bottom: 12px;
  font-weight: 600;
  color: #0f766e;
}

.section-title {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 16px 24px;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.detail-card:hover {
  box-shadow: 0 8px 24px rgba(15, 118, 110, 0.1);
  border-color: rgba(15, 118, 110, 0.15);
}

.detail-image {
  flex-shrink: 0;
  background: radial-gradient(circle at center, #fff 0%, #f1f5f9 100%);
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-name {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.detail-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #64748b;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-label {
  color: #94a3b8;
  font-weight: 500;
}

.detail-action {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.detail-price {
  font-size: 22px;
  font-weight: 800;
  color: #059669;
  letter-spacing: -0.5px;
  white-space: nowrap;
}

.buy-btn {
  border-radius: 8px;
  font-weight: 600;
  padding: 0 20px;
  transition: transform 0.2s;
}

.buy-btn:active {
  transform: scale(0.95);
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #94a3b8;
  font-size: 16px;
}

@media (max-width: 768px) {
  .detail-card {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 16px;
  }

  .detail-action {
    justify-content: space-between;
  }
}
</style>
