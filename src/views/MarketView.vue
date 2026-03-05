<template>
  <div class="market-page">
    <GlassPanel>
      <div class="page-header">
        <h1 class="page-title">市场挂单</h1>
      </div>

      <!-- Categories -->
      <div class="category-tabs">
        <div
            v-for="cat in categories"
            :key="cat"
            class="category-tab"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
        >
          {{ cat }}
        </div>
      </div>

      <div class="filter-bar" :class="{ 'is-mobile': isMobile }">
        <div class="filter-group">
          <n-input v-model:value="query.keyword" placeholder="搜索饰品名称..." clearable class="search-input">
            <template #prefix>
              <span style="opacity: 0.5">🔍</span>
            </template>
          </n-input>

          <div class="price-range">
            <n-input-number v-model:value="query.minPrice" :min="0" :show-button="false" placeholder="￥最低价"/>
            <span class="separator">-</span>
            <n-input-number v-model:value="query.maxPrice" :min="0" :show-button="false" placeholder="￥最高价"/>
          </div>

          <n-select v-model:value="query.sortRule" :options="sortOptions" placeholder="排序" class="sort-select"
                    style="width: 120px;"/>
          <n-select v-model:value="query.wearLabel" :options="wearOptions" placeholder="外观" class="wear-select"
                    style="width: 140px;"/>
        </div>

        <div class="action-group">
          <n-button type="primary" class="query-btn" @click="loadListings">查 询</n-button>
          <n-button quaternary class="reset-btn" @click="reset">重 置</n-button>
        </div>
      </div>

      <div class="listing-grid">
        <div class="listing-card" v-for="group in groupedListings" :key="group.key" @click="goToDetail(group)">
          <div class="image-wrapper">
            <n-image :src="group.iconUrl" object-fit="contain" width="100%" height="180"
                     fallback-src="https://dummyimage.com/420x170/e2e8f0/64748b" preview-disabled/>
            <div class="wear-badge">{{ group.wearLabel }}</div>
            <div class="count-badge" v-if="group.count > 1">{{ group.count }}件在售</div>
          </div>
          <div class="info">
            <h3 class="item-name" :title="group.itemName + '（' + group.wearLabel + '）'">{{
                group.itemName
              }}（{{ group.wearLabel }}）</h3>
            <div class="price-row">
              <div class="price">¥{{ money(group.minPrice) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination-wrapper">
        <n-pagination
            v-model:page="query.pageNum"
            v-model:page-size="query.pageSize"
            :item-count="groupedTotal"
            :page-sizes="[15, 30, 45]"
            show-size-picker
            @update:page="handlePageChange"
            @update:page-size="handlePageChange"
        />
      </div>
    </GlassPanel>

  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {NButton, NInput, NInputNumber, NPagination, NSelect, NSpace, NImage, useMessage} from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import {marketApi, orderApi} from '@/api/modules';
import {money, wearText, wearRangeBounds} from '@/types/format';
import type {MarketListing} from '@/types/api';

const message = useMessage();
const router = useRouter();
const isMobile = computed(() => window.innerWidth < 900);

interface GroupedItem {
  key: string;
  itemName: string;
  wearLabel: string;
  iconUrl: string;
  minPrice: number;
  count: number;
}

const query = reactive({
  keyword: '',
  minPrice: null as number | null,
  maxPrice: null as number | null,
  sortRule: 'price_asc',
  wearLabel: '',
  pageNum: 1,
  pageSize: 15
});

const sortOptions = [
  {label: '价格↑', value: 'price_asc'},
  {label: '价格↓', value: 'price_desc'}
];

const wearOptions = [
  {label: '不限外观', value: ''},
  {label: '崭新出厂', value: '崭新出厂'},
  {label: '略有磨损', value: '略有磨损'},
  {label: '久经沙场', value: '久经沙场'},
  {label: '破损不堪', value: '破损不堪'},
  {label: '战痕累累', value: '战痕累累'}
];

const allListings = ref<MarketListing[]>([]);
const total = ref(0);

// Category Filter
const categories = ['全部', '步枪', '手枪', '微型冲锋枪', '霰弹枪', '机枪', '匕首', '手套', '印花', '挂件', '探员', '其他'];
const activeCategory = ref('全部');

// Grouping logic
const allGrouped = computed(() => {
  const map = new Map<string, GroupedItem>();
  const filteredByCategory = activeCategory.value === '全部'
      ? allListings.value
      : allListings.value.filter(item => item.itemType === activeCategory.value);

  for (const item of filteredByCategory) {
    const wLabel = wearText(item.wearValue);
    const key = `${item.itemName}__${wLabel}`;
    const existing = map.get(key);
    if (existing) {
      existing.count++;
      if (item.price < existing.minPrice) {
        existing.minPrice = item.price;
      }
    } else {
      map.set(key, {
        key,
        itemName: item.itemName,
        wearLabel: wLabel,
        iconUrl: item.iconUrl,
        minPrice: item.price,
        count: 1
      });
    }
  }
  return Array.from(map.values());
});

const groupedTotal = computed(() => allGrouped.value.length);

const groupedListings = computed(() => {
  const start = (query.pageNum - 1) * query.pageSize;
  return allGrouped.value.slice(start, start + query.pageSize);
});

const handlePageChange = () => {
  // front-end pagination, no need to re-fetch
};

const goToDetail = (group: GroupedItem) => {
  router.push({name: 'marketDetail', query: {name: group.itemName, wear: group.wearLabel}});
};

const loadListings = async () => {
  try {
    const [minWear, maxWear] = query.wearLabel ? wearRangeBounds(query.wearLabel) : [null, null];
    const [sortField, sortOrder] = query.sortRule.split('_');

    // Load all listings for front-end grouping
    const data = await marketApi.listings({
      keyword: query.keyword,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      minWear,
      maxWear,
      sortField,
      sortOrder,
      pageNum: 1,
      pageSize: 9999
    });
    allListings.value = data.list;
    total.value = data.total;
    query.pageNum = 1; // Reset page number when filters change
  } catch (error: any) {
    message.error(error.message || '加载失败');
  }
};

const reset = () => {
  query.keyword = '';
  query.minPrice = null;
  query.maxPrice = null;
  query.sortRule = 'price_asc';
  query.wearLabel = '';
  query.pageNum = 1;
  query.pageSize = 15;
  activeCategory.value = '全部'; // Reset category
  loadListings();
};

// Watch for category changes to reset page and re-filter
watch(activeCategory, () => {
  query.pageNum = 1;
});

onMounted(() => {
  loadListings();
});
</script>

<style scoped>
.market-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 32px;
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  font-size: 16px;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  padding-bottom: 8px;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.category-tab:hover {
  color: #1e293b;
}

.category-tab.active {
  color: #0f766e;
}

.category-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #0f766e;
  border-radius: 3px 3px 0 0;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.4);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.filter-bar.is-mobile {
  flex-direction: column;
  align-items: stretch;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  flex-wrap: wrap;
}

.search-input {
  width: 260px;
  border-radius: 8px;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 240px;
}

.separator {
  color: #64748b;
  font-weight: 500;
}

.sort-select {
  width: 140px;
}

.action-group {
  display: flex;
  gap: 12px;
}

.query-btn {
  padding: 0 24px;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 1px;
}

.reset-btn {
  border-radius: 8px;
}

/* Grid & Cards */
.listing-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 24px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.listing-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.listing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(15, 118, 110, 0.12);
  border-color: rgba(15, 118, 110, 0.2);
}

.image-wrapper {
  position: relative;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 1) 0%, rgba(241, 245, 249, 1) 100%);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}

.wear-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(15, 118, 110, 0.1);
  color: #0f766e;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(15, 118, 110, 0.2);
}

.count-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.item-name {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 44px; /* for 2 lines */
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.seller-label {
  color: #94a3b8;
}

.seller-name {
  color: #475569;
  font-weight: 600;
}

.price-row {
  margin-top: auto;
  display: flex;
  align-items: center;
  padding-top: 8px;
  border-top: 1px dashed rgba(226, 232, 240, 0.8);
}

.price {
  font-size: 24px;
  color: #059669;
  font-weight: 800;
  letter-spacing: -0.5px;
}

@media (max-width: 1200px) {
  .listing-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (max-width: 900px) {
  .price-range {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .sort-select {
    width: 100%;
  }
}
</style>

