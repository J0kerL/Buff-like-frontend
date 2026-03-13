<template>
  <div class="inventory-page">
    <!-- 筛选栏 -->
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
          <n-cascader
            v-model:value="typeSelect"
            :options="typeOptions"
            clearable
            multiple
            :cascade="false"
            :show-path="false"
            :max-tag-count="3"
            expand-trigger="hover"
            placeholder="武器类型"
            @update:value="handleTypeChange"
          />
        </n-grid-item>
        <n-grid-item>
          <n-select
            v-model:value="wearSelect"
            :options="wearOptions"
            clearable
            multiple
            max-tag-count="responsive"
            placeholder="外观"
            @update:value="handleWearChange"
          />
        </n-grid-item>
        <n-grid-item>
          <n-space>
            <n-button @click="load">查询</n-button>
            <n-button quaternary @click="reset">重置</n-button>
          </n-space>
        </n-grid-item>
      </n-grid>
    </GlassPanel>

    <!-- 卡片列表 -->
    <GlassPanel>
      <div class="list-header">
        <h2 class="section-title" style="margin: 0">我的库存</h2>
        <!-- 批量操作栏 -->
        <transition name="fade">
          <div v-if="selectedIds.size > 0" class="action-bar">
            <span class="selected-hint">已选 {{ selectedIds.size }} 件</span>
            <n-button
              v-if="hasSelectedInStock"
              type="primary"
              size="small"
              @click="openListModal"
            >上架</n-button>
            <n-button
              v-if="hasSelectedOnSale"
              type="warning"
              size="small"
              :loading="delistLoading"
              @click="handleDelist"
            >下架</n-button>
            <span v-if="hasSelectedLocked" class="lock-hint">
              🔒 {{ selectedLockedCount }} 件锁定中不可操作
            </span>
            <n-button size="small" quaternary @click="clearSelection">取消选择</n-button>
          </div>
        </transition>
      </div>

      <n-spin :show="loading">
        <n-empty v-if="!loading && items.length === 0" description="暂无库存饰品" style="padding: 40px 0" />

        <div v-else class="inventory-grid">
          <div
            v-for="item in items"
            :key="item.id"
            class="item-card"
            :class="{ selected: selectedIds.has(item.id) }"
            @click="toggleSelect(item)"
          >
            <!-- 选中勾 -->
            <div v-if="selectedIds.has(item.id)" class="check-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <!-- 状态标签 -->
            <div class="status-badge" :class="statusClass(item.status)">
              {{ statusText(item.status) }}
            </div>

            <!-- 图片 -->
            <div class="item-image">
              <n-image
                :src="item.iconUrl"
                object-fit="contain"
                fallback-src="https://dummyimage.com/200x150/e2e8f0/64748b&text=No+Image"
                :previewed="false"
                @click.stop
              />
            </div>

            <!-- 信息 -->
            <div class="item-info">
              <div
                class="item-name"
                @click.stop="goToMarket(item)"
              >{{ item.itemName }}</div>
              <div class="item-meta">
                <span class="wear-tag">{{ wearText(item.wearValue) }}</span>
                <span class="pattern-tag">图案 #{{ item.patternIndex }}</span>
              </div>
              <!-- 锁定提示 -->
              <div v-if="item.status === 2" class="lock-tip">
                🔒 {{ item.lockExpireTime ? '解锁于 ' + formatDateTime(item.lockExpireTime) : '交易锁定中' }}
              </div>
            </div>
          </div>
        </div>
      </n-spin>

      <n-pagination
        v-if="total > 0"
        style="margin-top: 16px; justify-content: flex-end"
        v-model:page="query.pageNum"
        v-model:page-size="query.pageSize"
        :item-count="total"
        show-size-picker
        :page-sizes="[10, 20, 30]"
        @update:page="load"
        @update:page-size="load"
      />
    </GlassPanel>
  </div>

  <!-- 上架弹窗 -->
  <n-modal v-model:show="listModal" preset="card" title="上架饰品" style="width: 360px">
    <p style="color:#64748b; margin-bottom: 12px">已选择 {{ selectedInStockItems.length }} 件饰品，请设置统一售价：</p>
    <n-input-number
      v-model:value="listPrice"
      :min="0.01"
      :precision="2"
      placeholder="请输入价格"
      style="width: 100%"
    >
      <template #prefix>￥</template>
    </n-input-number>
    <template #footer>
      <n-space justify="end">
        <n-button @click="listModal = false">取消</n-button>
        <n-button type="primary" :loading="listLoading" @click="handleList">确认上架</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NCascader, NEmpty, NGrid, NGridItem, NImage, NInput, NInputNumber, NModal, NPagination, NSelect, NSpace, NSpin, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import { inventoryApi, marketApi } from '@/api/modules';
import type { InventoryItem } from '@/types/api';
import { formatDateTime, wearRangeBounds, wearText } from '@/types/format';

const message = useMessage();
const router = useRouter();
const isMobile = computed(() => window.innerWidth < 900);
const items = ref<InventoryItem[]>([]);
const total = ref(0);
const loading = ref(false);

// 多选
const selectedIds = ref<Set<number>>(new Set());
const selectedItems = computed(() => items.value.filter(i => selectedIds.value.has(i.id)));
const selectedInStockItems = computed(() => selectedItems.value.filter(i => i.status === 0));
const hasSelectedInStock = computed(() => selectedInStockItems.value.length > 0);
const hasSelectedOnSale = computed(() => selectedItems.value.some(i => i.status === 1));
const hasSelectedLocked = computed(() => selectedItems.value.some(i => i.status === 2));
const selectedLockedCount = computed(() => selectedItems.value.filter(i => i.status === 2).length);

// 上架弹窗
const listModal = ref(false);
const listPrice = ref<number | null>(null);
const listLoading = ref(false);

// 下架
const delistLoading = ref(false);

const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status: null as number | null,
  typeSelects: '',
  wears: '',
  keyword: ''
});

// 类型级联选择选中值（多选）
const typeSelect = ref<string[]>([]);
// 外观多选选中值
const wearSelect = ref<string[]>([]);

// 类型级联选项（类型为父节点、具体武器为叶节点）
const typeOptions = [
  {
    label: '匕首', value: 'grp_knife',
    children: [
      { label: '全部匕首', value: 'TYPE:匕首' },
      { label: '蝴蝶刀', value: 'SUB:蝴蝶刀:匕首' },
      { label: 'M9 刺刀', value: 'SUB:M9 刺刀:匕首' },
      { label: '爪子刀', value: 'SUB:爪子刀:匕首' },
      { label: '廓尔喀刀', value: 'SUB:廓尔喀刀:匕首' },
      { label: '骷髅匕首', value: 'SUB:骷髅匕首:匕首' },
      { label: '刺刀', value: 'SUB:刺刀:匕首' },
      { label: '锯齿爪刀', value: 'SUB:锯齿爪刀:匕首' },
      { label: '流浪者匕首', value: 'SUB:流浪者匕首:匕首' },
      { label: '折叠刀', value: 'SUB:折叠刀:匕首' },
      { label: '短剑', value: 'SUB:短剑:匕首' },
      { label: '海豹短刀', value: 'SUB:海豹短刀:匕首' },
      { label: '熊刀', value: 'SUB:熊刀:匕首' },
      { label: '猎杀者匕首', value: 'SUB:猎杀者匕首:匕首' },
      { label: '系绳匕首', value: 'SUB:系绳匕首:匕首' },
      { label: '求生匕首', value: 'SUB:求生匕首:匕首' },
      { label: '弯刀', value: 'SUB:弯刀:匕首' },
      { label: '暗影双匕', value: 'SUB:暗影双匕:匕首' },
      { label: '鲍伊猎刀', value: 'SUB:鲍伊猎刀:匕首' },
      { label: '穿肠刀', value: 'SUB:穿肠刀:匕首' },
      { label: '折刀', value: 'SUB:折刀:匕首' },
    ]
  },
  {
    label: '手套', value: 'grp_gloves',
    children: [
      { label: '全部手套', value: 'TYPE:手套' },
      { label: '运动手套', value: 'SUB:运动手套:手套' },
      { label: '专业手套', value: 'SUB:专业手套:手套' },
      { label: '摩托手套', value: 'SUB:摩托手套:手套' },
      { label: '驾驶手套', value: 'SUB:驾驶手套:手套' },
      { label: '手部束带', value: 'SUB:手部束带:手套' },
      { label: '狂牙手套', value: 'SUB:狂牙手套:手套' },
      { label: '九头蛇手套', value: 'SUB:九头蛇手套:手套' },
      { label: '血猎手套', value: 'SUB:血猎手套:手套' },
    ]
  },
  {
    label: '步枪', value: 'grp_rifle',
    children: [
      { label: '全部步枪', value: 'TYPE:步枪' },
      { label: 'AK-47', value: 'SUB:AK-47:步枪' },
      { label: 'AWP', value: 'SUB:AWP:步枪' },
      { label: 'M4A1 消音版', value: 'SUB:M4A1 消音版:步枪' },
      { label: 'M4A4', value: 'SUB:M4A4:步枪' },
      { label: 'AUG', value: 'SUB:AUG:步枪' },
      { label: 'SG 553', value: 'SUB:SG 553:步枪' },
      { label: '法玛斯', value: 'SUB:法玛斯:步枪' },
      { label: '加利尔 AR', value: 'SUB:加利尔 AR:步枪' },
      { label: 'SSG 08', value: 'SUB:SSG 08:步枪' },
      { label: 'SCAR-20', value: 'SUB:SCAR-20:步枪' },
      { label: 'G3SG1', value: 'SUB:G3SG1:步枪' },
    ]
  },
  {
    label: '手枪', value: 'grp_pistol',
    children: [
      { label: '全部手枪', value: 'TYPE:手枪' },
      { label: '沙漠之鹰', value: 'SUB:沙漠之鹰:手枪' },
      { label: 'USP 消音版', value: 'SUB:USP 消音版:手枪' },
      { label: '格洛克 18 型', value: 'SUB:格洛克 18 型:手枪' },
      { label: 'P2000', value: 'SUB:P2000:手枪' },
      { label: 'P250', value: 'SUB:P250:手枪' },
      { label: 'FN57', value: 'SUB:FN57:手枪' },
      { label: 'R8 左轮手枪', value: 'SUB:R8 左轮手枪:手枪' },
      { label: 'Tec-9', value: 'SUB:Tec-9:手枪' },
      { label: '双持贝瑞塔', value: 'SUB:双持贝瑞塔:手枪' },
      { label: 'CZ75 自动手枪', value: 'SUB:CZ75 自动手枪:手枪' },
      { label: '电击枪', value: 'SUB:电击枪:手枪' },
    ]
  },
  {
    label: '微型冲锋枪', value: 'grp_smg',
    children: [
      { label: '全部微型冲锋枪', value: 'TYPE:微型冲锋枪' },
      { label: 'MP9', value: 'SUB:MP9:微型冲锋枪' },
      { label: 'MAC-10', value: 'SUB:MAC-10:微型冲锋枪' },
      { label: 'UMP-45', value: 'SUB:UMP-45:微型冲锋枪' },
      { label: 'P90', value: 'SUB:P90:微型冲锋枪' },
      { label: 'MP7', value: 'SUB:MP7:微型冲锋枪' },
      { label: 'PP-野牛', value: 'SUB:PP-野牛:微型冲锋枪' },
      { label: 'MP5-SD', value: 'SUB:MP5-SD:微型冲锋枪' },
    ]
  },
  {
    label: '霰弹枪', value: 'grp_shotgun',
    children: [
      { label: '全部霰弹枪', value: 'TYPE:霰弹枪' },
      { label: 'XM1014', value: 'SUB:XM1014:霰弹枪' },
      { label: 'MAG-7', value: 'SUB:MAG-7:霰弹枪' },
      { label: '截短霰弹枪', value: 'SUB:截短霰弹枪:霰弹枪' },
      { label: '新星', value: 'SUB:新星:霰弹枪' },
    ]
  },
  {
    label: '机枪', value: 'grp_machinegun',
    children: [
      { label: '全部机枪', value: 'TYPE:机枪' },
      { label: 'M249', value: 'SUB:M249:机枪' },
      { label: '内格夫', value: 'SUB:内格夫:机枪' },
    ]
  },
  {
    label: '印花', value: 'grp_sticker',
    children: [
      { label: '全部印花', value: 'TYPE:印花' },
      { label: '25布达佩斯', value: 'SUB:25布达佩斯:印花' },
      { label: '25年社区印花', value: 'SUB:25年社区印花:印花' },
      { label: '糖果脸谱2', value: 'SUB:糖果脸谱2:印花' },
      { label: '25奥斯汀', value: 'SUB:25奥斯汀:印花' },
      { label: '25年战锤40K', value: 'SUB:25年战锤40K:印花' },
      { label: '24上海', value: 'SUB:24上海:印花' },
      { label: '元素手作', value: 'SUB:元素手作:印花' },
      { label: '角色手作', value: 'SUB:角色手作:印花' },
      { label: '24哥本哈根', value: 'SUB:24哥本哈根:印花' },
      { label: '伏击', value: 'SUB:伏击:印花' },
      { label: '23巴黎', value: 'SUB:23巴黎:印花' },
      { label: '间谍', value: 'SUB:间谍:印花' },
      { label: '22里约', value: 'SUB:22里约:印花' },
      { label: '十周年', value: 'SUB:十周年:印花' },
      { label: '22安特卫普', value: 'SUB:22安特卫普:印花' },
      { label: '作战室', value: 'SUB:作战室:印花' },
      { label: '战地2042', value: 'SUB:战地2042:印花' },
      { label: '21斯德哥尔摩', value: 'SUB:21斯德哥尔摩:印花' },
      { label: '激流冲浪店', value: 'SUB:激流冲浪店:印花' },
      { label: '激流大行动', value: 'SUB:激流大行动:印花' },
      { label: '2021社区', value: 'SUB:2021社区:印花' },
      { label: 'Poorly Drawn', value: 'SUB:Poorly Drawn:印花' },
      { label: '2020RMR', value: 'SUB:2020RMR:印花' },
      { label: '狂牙大行动', value: 'SUB:狂牙大行动:印花' },
      { label: '压枪', value: 'SUB:压枪:印花' },
      { label: '20年战锤40K', value: 'SUB:20年战锤40K:印花' },
      { label: '半衰期: Alyx', value: 'SUB:半衰期: Alyx:印花' },
      { label: '光环', value: 'SUB:光环:印花' },
      { label: '裂网大行动', value: 'SUB:裂网大行动:印花' },
      { label: 'CS20', value: 'SUB:CS20:印花' },
      { label: '19年柏林', value: 'SUB:19年柏林:印花' },
      { label: '小鸡', value: 'SUB:小鸡:印花' },
      { label: '猛兽', value: 'SUB:猛兽:印花' },
      { label: '19年卡托', value: 'SUB:19年卡托:印花' },
      { label: '段位印花', value: 'SUB:段位印花:印花' },
      { label: '18年伦敦', value: 'SUB:18年伦敦:印花' },
      { label: '18年波士顿', value: 'SUB:18年波士顿:印花' },
      { label: '17年克拉科夫', value: 'SUB:17年克拉科夫:印花' },
      { label: '17年亚特兰大', value: 'SUB:17年亚特兰大:印花' },
      { label: '16年科隆', value: 'SUB:16年科隆:印花' },
      { label: '16年哥伦布', value: 'SUB:16年哥伦布:印花' },
      { label: '15年DH', value: 'SUB:15年DH:印花' },
      { label: '15年科隆', value: 'SUB:15年科隆:印花' },
      { label: '15年卡托维兹', value: 'SUB:15年卡托维兹:印花' },
      { label: '14年DH', value: 'SUB:14年DH:印花' },
      { label: '14年科隆', value: 'SUB:14年科隆:印花' },
      { label: '14年卡托维兹', value: 'SUB:14年卡托维兹:印花' },
      { label: '18年社区印花', value: 'SUB:18年社区印花:印花' },
      { label: '1号印花', value: 'SUB:1号印花:印花' },
      { label: '2号印花', value: 'SUB:2号印花:印花' },
      { label: 'Enfu印花', value: 'SUB:Enfu印花:印花' },
      { label: '点亮中国1号', value: 'SUB:点亮中国1号:印花' },
      { label: '点亮中国2号', value: 'SUB:点亮中国2号:印花' },
      { label: '1号社区印花', value: 'SUB:1号社区印花:印花' },
      { label: '动物寓言印花', value: 'SUB:动物寓言印花:印花' },
      { label: 'Slid3印花', value: 'SUB:Slid3印花:印花' },
      { label: '糖果脸谱印花', value: 'SUB:糖果脸谱印花:印花' },
      { label: '海报女郎印花', value: 'SUB:海报女郎印花:印花' },
      { label: '团队定位印花', value: 'SUB:团队定位印花:印花' },
      { label: '其他印花', value: 'SUB:其他印花:印花' },
    ]
  },
  {
    label: '挂件', value: 'grp_charm',
    children: [
      { label: '全部挂件', value: 'TYPE:挂件' },
      { label: '25布达佩斯', value: 'SUB:25布达佩斯:挂件' },
      { label: '迷链社区', value: 'SUB:迷链社区:挂件' },
      { label: '爆炸博士', value: 'SUB:爆炸博士:挂件' },
      { label: '25奥斯汀', value: 'SUB:25奥斯汀:挂件' },
      { label: '袖珍武器挂件', value: 'SUB:袖珍武器挂件:挂件' },
      { label: '迷链挂件', value: 'SUB:迷链挂件:挂件' },
      { label: '印花板', value: 'SUB:印花板:挂件' },
    ]
  },
  {
    label: '探员', value: 'grp_agent',
    children: [
      { label: '全部探员', value: 'TYPE:探员' },
      { label: '反恐精英', value: 'SUB:反恐精英:探员' },
      { label: '恐怖分子', value: 'SUB:恐怖分子:探员' },
    ]
  },
  {
    label: '其他', value: 'grp_other',
    children: [
      { label: '全部其他', value: 'TYPE:其他' },
      { label: '武器箱', value: 'SUB:武器箱:其他' },
      { label: '音乐盒', value: 'SUB:音乐盒:其他' },
      { label: '工具', value: 'SUB:工具:其他' },
      { label: '涂鸦', value: 'SUB:涂鸦:其他' },
      { label: '通行证', value: 'SUB:通行证:其他' },
      { label: '收藏品', value: 'SUB:收藏品:其他' },
      { label: '布章', value: 'SUB:布章:其他' },
      { label: '礼物', value: 'SUB:礼物:其他' },
    ]
  },
];

// 外观多选选项
const wearOptions = [
  { label: '崭新出厂', value: '崭新出厂' },
  { label: '略有磨损', value: '略有磨损' },
  { label: '久经沙场', value: '久经沙场' },
  { label: '破损不堪', value: '破损不堪' },
  { label: '战痕累累', value: '战痕累累' },
];

// 处理类型级联多选变化：过滤掉父节点 grp_，剩余值以逗号拼接传给后端
const handleTypeChange = (vals: string[] | null) => {
  const valid = (vals || []).filter(v => !v.startsWith('grp_'));
  query.typeSelects = valid.join(',');
};

// 处理外观多选变化
const handleWearChange = (vals: string[]) => {
  query.wears = (vals || []).join(',');
};

const statusText = (status: number) => {
  if (status === 0) return '在库';
  if (status === 1) return '出售中';
  return '交易锁定';
};

const statusClass = (status: number) => {
  if (status === 0) return 'badge-in-stock';
  if (status === 1) return 'badge-on-sale';
  return 'badge-locked';
};

const statusOptions = [
  { label: '在库', value: 0 },
  { label: '出售中', value: 1 },
  { label: '交易锁定', value: 2 }
];

// 跳转饰品市场
const goToMarket = (item: InventoryItem) => {
  router.push({
    path: '/market/detail',
    query: { name: item.itemName, wear: wearText(item.wearValue) }
  });
};

// 选择/取消选择
const toggleSelect = (item: InventoryItem) => {
  const next = new Set(selectedIds.value);
  if (next.has(item.id)) {
    next.delete(item.id);
  } else {
    next.add(item.id);
  }
  selectedIds.value = next;
};

const clearSelection = () => {
  selectedIds.value = new Set();
};

// 上架
const openListModal = () => {
  listPrice.value = null;
  listModal.value = true;
};

const handleList = async () => {
  if (!listPrice.value || listPrice.value <= 0) {
    message.warning('请输入有效价格');
    return;
  }
  listLoading.value = true;
  try {
    for (const item of selectedInStockItems.value) {
      await marketApi.createListing({ inventoryId: item.id, price: listPrice.value });
    }
    message.success(`成功上架 ${selectedInStockItems.value.length} 件饰品`);
    listModal.value = false;
    clearSelection();
    load();
  } catch (error: any) {
    message.error(error.message || '上架失败');
  } finally {
    listLoading.value = false;
  }
};

// 下架
const handleDelist = async () => {
  delistLoading.value = true;
  try {
    const onSaleItems = selectedItems.value.filter(i => i.status === 1);
    // 查询我的在售列表，找到对应的 listingId
    const result = await marketApi.myListings({ pageNum: 1, pageSize: 9999 });
    const myListings = result.list;
    let successCount = 0;
    for (const item of onSaleItems) {
      const listing = myListings.find(l => l.inventoryId === item.id);
      if (listing) {
        await marketApi.cancelListing(listing.id);
        successCount++;
      }
    }
    message.success(`成功下架 ${successCount} 件饰品`);
    clearSelection();
    load();
  } catch (error: any) {
    message.error(error.message || '下架失败');
  } finally {
    delistLoading.value = false;
  }
};

async function load() {
  loading.value = true;
  try {
    const data = await inventoryApi.list({ ...query });
    items.value = data.list;
    total.value = data.total;
  } catch (error: any) {
    message.error(error.message || '加载库存失败');
  } finally {
    loading.value = false;
  }
}

function reset() {
  query.pageNum = 1;
  query.pageSize = 10;
  query.status = null;
  query.typeSelects = '';
  query.wears = '';
  query.keyword = '';
  typeSelect.value = [];
  wearSelect.value = [];
  load();
}

onMounted(load);
</script>

<style scoped>
.inventory-page {
  display: grid;
  gap: 14px;
}

/* 列表头部：标题 + 操作栏 */
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  margin-bottom: 16px;
}

/* 批量操作栏 */
.action-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 6px 14px;
}

.selected-hint {
  font-size: 13px;
  font-weight: 600;
  color: #15803d;
  margin-right: 4px;
}

.lock-hint {
  font-size: 12px;
  font-weight: 500;
  color: #e65100;
  background: #fff3e0;
  padding: 2px 10px;
  border-radius: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* 卡片网格 */
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.item-card {
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
  user-select: none;
}

.item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

/* 选中状态 */
.item-card.selected {
  border-color: #10b981;
  background: #f0fdf4;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

/* 选中勾 */
.check-mark {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 20px;
  height: 20px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.check-mark svg {
  width: 12px;
  height: 12px;
  color: #fff;
}

/* 状态标签 */
.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
}

.badge-in-stock {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge-on-sale {
  background: #e3f2fd;
  color: #1565c0;
}

.badge-locked {
  background: #fff3e0;
  color: #e65100;
}

/* 图片区 */
.item-image {
  width: 100%;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  margin-top: 4px;
}

.item-image :deep(img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* 信息区 */
.item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-name {
  font-size: 13px;
  font-weight: 600;
  color: #0d9488;
  line-height: 1.4;
  word-break: break-all;
  cursor: pointer;
}

.item-name:hover {
  text-decoration: underline;
}

.item-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.wear-tag,
.pattern-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  background: #f0fdf4;
  color: #15803d;
  font-weight: 500;
}

.pattern-tag {
  background: #f0f9ff;
  color: #0369a1;
}

.lock-tip {
  font-size: 11px;
  color: #e65100;
  background: #fff3e0;
  border-radius: 6px;
  padding: 3px 8px;
  font-weight: 500;
}

/* 响应式 */
@media (max-width: 1200px) {
  .inventory-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 900px) {
  .inventory-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .inventory-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>

