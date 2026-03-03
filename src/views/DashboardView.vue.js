import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NGrid, NGridItem, NImage, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import StatCard from '@/components/StatCard.vue';
import { inventoryApi, marketApi, walletApi } from '@/api/modules';
import { money, wearText } from '@/types/format';
const router = useRouter();
const message = useMessage();
const stats = ref();
const listings = ref([]);
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
    }
    catch (error) {
        message.error(error.message || '加载失败');
    }
};
onMounted(load);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dashboard" },
});
/** @type {[typeof GlassPanel, typeof GlassPanel, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(GlassPanel, new GlassPanel({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-grid" },
});
/** @type {[typeof StatCard, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(StatCard, new StatCard({
    label: "账户余额",
    value: (__VLS_ctx.money(__VLS_ctx.balance)),
}));
const __VLS_4 = __VLS_3({
    label: "账户余额",
    value: (__VLS_ctx.money(__VLS_ctx.balance)),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof StatCard, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(StatCard, new StatCard({
    label: "库存总量",
    value: (__VLS_ctx.stats?.totalCount ?? 0),
}));
const __VLS_7 = __VLS_6({
    label: "库存总量",
    value: (__VLS_ctx.stats?.totalCount ?? 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {[typeof StatCard, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(StatCard, new StatCard({
    label: "在售数量",
    value: (__VLS_ctx.stats?.onSaleCount ?? 0),
}));
const __VLS_10 = __VLS_9({
    label: "在售数量",
    value: (__VLS_ctx.stats?.onSaleCount ?? 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {[typeof StatCard, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(StatCard, new StatCard({
    label: "估算总值",
    value: (__VLS_ctx.money(__VLS_ctx.stats?.totalValue)),
}));
const __VLS_13 = __VLS_12({
    label: "估算总值",
    value: (__VLS_ctx.money(__VLS_ctx.stats?.totalValue)),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
var __VLS_2;
/** @type {[typeof GlassPanel, typeof GlassPanel, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(GlassPanel, new GlassPanel({}));
const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "row-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
const __VLS_18 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    ...{ 'onClick': {} },
    text: true,
    type: "primary",
}));
const __VLS_20 = __VLS_19({
    ...{ 'onClick': {} },
    text: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
let __VLS_22;
let __VLS_23;
let __VLS_24;
const __VLS_25 = {
    onClick: (...[$event]) => {
        __VLS_ctx.router.push('/market');
    }
};
__VLS_21.slots.default;
var __VLS_21;
const __VLS_26 = {}.NGrid;
/** @type {[typeof __VLS_components.NGrid, typeof __VLS_components.nGrid, typeof __VLS_components.NGrid, typeof __VLS_components.nGrid, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    cols: (__VLS_ctx.isMobile ? 1 : 3),
    xGap: (12),
    yGap: (12),
}));
const __VLS_28 = __VLS_27({
    cols: (__VLS_ctx.isMobile ? 1 : 3),
    xGap: (12),
    yGap: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.listings))) {
    const __VLS_30 = {}.NGridItem;
    /** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        key: (item.id),
    }));
    const __VLS_32 = __VLS_31({
        key: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_33.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mini-item" },
    });
    const __VLS_34 = {}.NImage;
    /** @type {[typeof __VLS_components.NImage, typeof __VLS_components.nImage, ]} */ ;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
        src: (item.iconUrl),
        width: "60",
        height: "60",
        objectFit: "cover",
        fallbackSrc: "https://dummyimage.com/60x60/e2e8f0/64748b",
    }));
    const __VLS_36 = __VLS_35({
        src: (item.iconUrl),
        width: "60",
        height: "60",
        objectFit: "cover",
        fallbackSrc: "https://dummyimage.com/60x60/e2e8f0/64748b",
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "meta" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "name" },
    });
    (item.itemName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sub" },
    });
    (item.sellerName);
    (__VLS_ctx.wearText(item.wearValue));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "price" },
    });
    (__VLS_ctx.money(item.price));
    var __VLS_33;
}
var __VLS_29;
var __VLS_17;
/** @type {__VLS_StyleScopedClasses['dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['row-head']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NGrid: NGrid,
            NGridItem: NGridItem,
            NImage: NImage,
            GlassPanel: GlassPanel,
            StatCard: StatCard,
            money: money,
            wearText: wearText,
            router: router,
            stats: stats,
            listings: listings,
            balance: balance,
            isMobile: isMobile,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
