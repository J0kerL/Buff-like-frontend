<template>
  <div class="dashboard">
    <!-- 新闻资讯轮播 -->
    <GlassPanel class="news-section">
      <n-carousel ref="newsCarouselRef" autoplay :interval="4000" :show-dots="false">
        <div 
          v-for="(news, index) in newsList" 
          :key="index"
          class="news-item"
        >
          <a
            class="news-content news-content-link"
            :href="news.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 class="news-title">{{ news.title }}</h3>
            <p class="news-desc">{{ news.description }}</p>
          </a>
          <div
            class="news-image"
            role="button"
            tabindex="0"
            @click="openPreview(news.image)"
            @keydown.enter.prevent="openPreview(news.image)"
            @keydown.space.prevent="openPreview(news.image)"
          >
            <n-image :src="news.image" object-fit="cover" preview-disabled />
          </div>
        </div>
      </n-carousel>

      <button class="carousel-nav carousel-nav--prev" type="button" aria-label="Previous news" @click="prevNews">
        <span class="carousel-nav__icon carousel-nav__icon--prev" aria-hidden="true"></span>
      </button>
      <button class="carousel-nav carousel-nav--next" type="button" aria-label="Next news" @click="nextNews">
        <span class="carousel-nav__icon carousel-nav__icon--next" aria-hidden="true"></span>
      </button>

      <n-modal v-model:show="previewVisible" :mask-closable="true">
        <div class="news-preview" @click.stop>
          <button class="news-preview__close" type="button" aria-label="关闭预览" @click="previewVisible = false">X</button>
          <img :src="previewImage" alt="新闻图片预览" class="news-preview__img" />
        </div>
      </n-modal>
    </GlassPanel>

    <!-- 热门饰品 -->
    <GlassPanel>
      <div class="row-head">
        <h2 class="section-title">热门饰品</h2>
        <n-button text type="primary" @click="router.push('/market')">查看更多</n-button>
      </div>

      <div v-if="loading" class="loading-state">
        <n-spin size="large" />
      </div>

      <div v-else-if="hotItems.length === 0" class="empty-state">
        <n-empty description="暂无热门饰品" />
      </div>

      <div v-else class="hot-items-grid">
        <div v-for="item in hotItems" :key="item.id" class="item-card">
          <div class="item-image">
            <n-image 
              :src="item.iconUrl" 
              object-fit="contain" 
              fallback-src="https://dummyimage.com/200x150/e2e8f0/64748b&text=No+Image"
            />
          </div>
          <div class="item-info">
            <div class="item-name">{{ item.itemName }}</div>
            <div class="item-meta">
              <span class="wear-tag">{{ wearText(item.wearValue) }}</span>
            </div>
            <div class="item-footer">
              <div class="item-price">{{ money(item.price) }}</div>
              <n-button size="small" type="primary" @click="goToMarket(item.id)">
                查看详情
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NCarousel, NEmpty, NImage, NModal, NSpin, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import { marketApi } from '@/api/modules';
import type { MarketListing } from '@/types/api';
import { money, wearText } from '@/types/format';

const router = useRouter();
const message = useMessage();
const hotItems = ref<MarketListing[]>([]);
const loading = ref(true);
const newsCarouselRef = ref<any>(null);
const previewVisible = ref(false);
const previewImage = ref('');

// Mock news data
const newsList = [
  {
    title: 'CS2赛季新皮肤',
    description: '全新收藏品现已开放交易，热门新品抢先看。',
    date: '2024-03-15',
    image: 'https://market.fp.ps.netease.com/file/6971c8c418c0d5c5d9e4a9aa4EIh9Xw307',
    link: 'https://buff.163.com/market/csgo#game=csgo&page_num=1&itemset=set_timed_drops_exuberant,set_timed_drops_achroma'
  },
  {
    title: 'BUFF移动端APP',
    description: '随时随地便捷交易，行情与报价一手掌握。',
    date: '2024-03-14',
    image: 'https://g.fp.ps.netease.com/market/file/6247f63543d792abefab0c1cQMtLcCks04',
    link: 'https://buff.163.com/app/'
  },
  {
    title: 'UU加速器',
    description: '免费加速，解决交易访问与加载缓慢问题。',
    date: '2024-03-13',
    image: 'https://market.fp.ps.netease.com/file/68c235d1947e1a385d17caf8vjeKxeKR06',
    link: 'https://uu.163.com/?from=buff'
  },
  {
    title: '交易防骗指南',
    description: '务必阅读',
    date: '2024-03-12',
    image: 'https://g.fp.ps.netease.com/market/file/5bc5a9f7a7f252bce7d74e26yrA5Zmyd',
    link: 'https://buff.163.com/news/12027?from=banner'
  }
];

const loadHotItems = async () => {
  loading.value = true;
  try {
    const result = await marketApi.hotItems({ pageNum: 1, pageSize: 10 });
    hotItems.value = result.list;
  } catch (error: any) {
    message.error(error.message || '加载热门饰品失败');
  } finally {
    loading.value = false;
  }
};

const goToMarket = (id: number) => {
  router.push(`/market?id=${id}`);
};

const prevNews = () => {
  newsCarouselRef.value?.prev();
};

const nextNews = () => {
  newsCarouselRef.value?.next();
};

const openPreview = (image: string) => {
  previewImage.value = image;
  previewVisible.value = true;
};

onMounted(loadHotItems);
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 20px;
}

.news-section {
  position: relative;
  overflow: hidden;
  padding-bottom: 16px;
}

.news-item {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 50px;
  align-items: center;
  padding: 50px 60px;
  min-height: 350px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.news-item:hover {
  transform: scale(1.005);
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-content-link {
  text-decoration: none;
  color: inherit;
}

.news-content-link:hover .news-title {
  color: #0f766e;
}



.news-title {
  margin: 0;
  font-size: 38px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.news-desc {
  margin: 0;
  font-size: 18px;
  color: #64748b;
  line-height: 1.7;
}



.news-image {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.news-item:hover .news-image {
  transform: scale(1.02);
}

.news-image :deep(img) {
  width: 100%;
  height: 320px;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.carousel-nav__icon {
  display: block;
  width: 11px;
  height: 11px;
  border-top: 2px solid #fff;
  border-right: 2px solid #fff;
}

.carousel-nav__icon--prev {
  transform: rotate(-135deg);
}

.carousel-nav__icon--next {
  transform: rotate(45deg);
}

.carousel-nav:hover {
  background: rgba(15, 23, 42, 0.55);
  transform: translateY(-50%) scale(1.04);
}

.carousel-nav--prev {
  left: 16px;
}

.carousel-nav--next {
  right: 16px;
}

.news-preview {
  position: relative;
  width: min(92vw, 1120px);
  max-height: 88vh;
  background: #0b1220;
  border-radius: 14px;
  padding: 14px 14px 10px;
}

.news-preview__img {
  display: block;
  width: 100%;
  max-height: calc(88vh - 54px);
  object-fit: contain;
  border-radius: 10px;
}

.news-preview__close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.7);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.row-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.loading-state,
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.hot-items-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.item-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(15, 118, 110, 0.15);
}

.item-image {
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.item-image :deep(img) {
  width: 100%;
  height: 100%;
}

.item-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  display: flex;
  gap: 6px;
}

.wear-tag {
  padding: 2px 8px;
  background: rgba(15, 118, 110, 0.1);
  color: #0f766e;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.item-price {
  color: #0f766e;
  font-weight: 700;
  font-size: 16px;
}

@media (max-width: 1400px) {
  .hot-items-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1100px) {
  .hot-items-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .news-item {
    grid-template-columns: 1fr;
    padding: 40px;
    gap: 30px;
  }
  
  .news-image {
    order: -1;
  }

  .carousel-nav {
    width: 36px;
    height: 36px;
  }
  
  .news-title {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .hot-items-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .news-item {
    padding: 30px 20px;
    min-height: 280px;
  }

  .news-title {
    font-size: 26px;
  }
  
  .news-desc {
    font-size: 16px;
  }
  
  .news-section {
    padding-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .hot-items-grid {
    grid-template-columns: 1fr;
  }
}
</style>
