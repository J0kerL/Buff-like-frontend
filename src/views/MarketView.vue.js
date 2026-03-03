import { computed, h, onMounted, reactive, ref } from 'vue';
import { NButton, NDataTable, NForm, NFormItem, NGrid, NGridItem, NImage, NInput, NInputNumber, NModal, NPagination, NSelect, NSpace, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import { inventoryApi, marketApi, orderApi } from '@/api/modules';
import { money, wearText } from '@/types/format';
const message = useMessage();
const isMobile = computed(() => window.innerWidth < 900);
const query = reactive({
    keyword: '',
    minPrice: null,
    maxPrice: null,
    sortField: 'price',
    sortOrder: 'asc',
    pageNum: 1,
    pageSize: 12
});
const sortOptions = [
    { label: '按价格', value: 'price' },
    { label: '按发布时间', value: 'createTime' }
];
const listings = ref([]);
const total = ref(0);
const myPage = reactive({ pageNum: 1, pageSize: 10 });
const myListings = ref([]);
const myTotal = ref(0);
const createModal = ref(false);
const createForm = reactive({
    inventoryId: null,
    price: 0.01
});
const inventoryOptions = ref([]);
const myColumns = [
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
    }
    catch (error) {
        message.error(error.message || '加载失败');
    }
};
const loadMyListings = async () => {
    try {
        const data = await marketApi.myListings({ ...myPage });
        myListings.value = data.list;
        myTotal.value = data.total;
    }
    catch (error) {
        message.error(error.message || '加载我的挂单失败');
    }
};
const loadInventoryOptions = async () => {
    const data = await inventoryApi.list({ pageNum: 1, pageSize: 100, status: 0 });
    inventoryOptions.value = data.list.map((item) => ({
        label: `${item.itemName} #${item.id}`,
        value: item.id
    }));
};
const buy = async (id) => {
    try {
        const orderNo = await orderApi.create(id);
        message.success(`创建订单成功：${orderNo}`);
        await loadListings();
    }
    catch (error) {
        message.error(error.message || '购买失败');
    }
};
const openCreate = async () => {
    try {
        await loadInventoryOptions();
        createModal.value = true;
    }
    catch (error) {
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
    }
    catch (error) {
        message.error(error.message || '上架失败');
    }
};
const cancelListing = async (id) => {
    try {
        await marketApi.cancelListing(id);
        message.success('下架成功');
        await Promise.all([loadListings(), loadMyListings()]);
    }
    catch (error) {
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['listing-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "market-page" },
});
/** @type {[typeof GlassPanel, typeof GlassPanel, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(GlassPanel, new GlassPanel({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "row-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
const __VLS_3 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_5 = __VLS_4({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
let __VLS_7;
let __VLS_8;
let __VLS_9;
const __VLS_10 = {
    onClick: (__VLS_ctx.openCreate)
};
__VLS_6.slots.default;
var __VLS_6;
const __VLS_11 = {}.NGrid;
/** @type {[typeof __VLS_components.NGrid, typeof __VLS_components.nGrid, typeof __VLS_components.NGrid, typeof __VLS_components.nGrid, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    cols: (__VLS_ctx.isMobile ? 1 : 4),
    xGap: (10),
    yGap: (10),
    ...{ style: {} },
}));
const __VLS_13 = __VLS_12({
    cols: (__VLS_ctx.isMobile ? 1 : 4),
    xGap: (10),
    yGap: (10),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
const __VLS_15 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.NInput;
/** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    value: (__VLS_ctx.query.keyword),
    placeholder: "关键词搜索",
    clearable: true,
}));
const __VLS_21 = __VLS_20({
    value: (__VLS_ctx.query.keyword),
    placeholder: "关键词搜索",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_18;
const __VLS_23 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({}));
const __VLS_25 = __VLS_24({}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.NInputNumber;
/** @type {[typeof __VLS_components.NInputNumber, typeof __VLS_components.nInputNumber, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    value: (__VLS_ctx.query.minPrice),
    min: (0),
    placeholder: "最低价",
    ...{ style: {} },
}));
const __VLS_29 = __VLS_28({
    value: (__VLS_ctx.query.minPrice),
    min: (0),
    placeholder: "最低价",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
var __VLS_26;
const __VLS_31 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
const __VLS_35 = {}.NInputNumber;
/** @type {[typeof __VLS_components.NInputNumber, typeof __VLS_components.nInputNumber, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    value: (__VLS_ctx.query.maxPrice),
    min: (0),
    placeholder: "最高价",
    ...{ style: {} },
}));
const __VLS_37 = __VLS_36({
    value: (__VLS_ctx.query.maxPrice),
    min: (0),
    placeholder: "最高价",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
var __VLS_34;
const __VLS_39 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
const __VLS_43 = {}.NSelect;
/** @type {[typeof __VLS_components.NSelect, typeof __VLS_components.nSelect, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    value: (__VLS_ctx.query.sortField),
    options: (__VLS_ctx.sortOptions),
}));
const __VLS_45 = __VLS_44({
    value: (__VLS_ctx.query.sortField),
    options: (__VLS_ctx.sortOptions),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
var __VLS_42;
var __VLS_14;
const __VLS_47 = {}.NSpace;
/** @type {[typeof __VLS_components.NSpace, typeof __VLS_components.nSpace, typeof __VLS_components.NSpace, typeof __VLS_components.nSpace, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({}));
const __VLS_49 = __VLS_48({}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
const __VLS_51 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    ...{ 'onClick': {} },
}));
const __VLS_53 = __VLS_52({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_55;
let __VLS_56;
let __VLS_57;
const __VLS_58 = {
    onClick: (__VLS_ctx.loadListings)
};
__VLS_54.slots.default;
var __VLS_54;
const __VLS_59 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    ...{ 'onClick': {} },
    quaternary: true,
}));
const __VLS_61 = __VLS_60({
    ...{ 'onClick': {} },
    quaternary: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
let __VLS_63;
let __VLS_64;
let __VLS_65;
const __VLS_66 = {
    onClick: (__VLS_ctx.reset)
};
__VLS_62.slots.default;
var __VLS_62;
var __VLS_50;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "listing-grid" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.listings))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "listing-card" },
        key: (item.id),
    });
    const __VLS_67 = {}.NImage;
    /** @type {[typeof __VLS_components.NImage, typeof __VLS_components.nImage, ]} */ ;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
        src: (item.iconUrl),
        objectFit: "cover",
        width: "100%",
        height: "170",
        fallbackSrc: "https://dummyimage.com/420x170/e2e8f0/64748b",
    }));
    const __VLS_69 = __VLS_68({
        src: (item.iconUrl),
        objectFit: "cover",
        width: "100%",
        height: "170",
        fallbackSrc: "https://dummyimage.com/420x170/e2e8f0/64748b",
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    (item.itemName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (item.sellerName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.wearText(item.wearValue));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "price" },
    });
    (__VLS_ctx.money(item.price));
    const __VLS_71 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
        ...{ 'onClick': {} },
        type: "primary",
        block: true,
    }));
    const __VLS_73 = __VLS_72({
        ...{ 'onClick': {} },
        type: "primary",
        block: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    let __VLS_75;
    let __VLS_76;
    let __VLS_77;
    const __VLS_78 = {
        onClick: (...[$event]) => {
            __VLS_ctx.buy(item.id);
        }
    };
    __VLS_74.slots.default;
    var __VLS_74;
}
const __VLS_79 = {}.NPagination;
/** @type {[typeof __VLS_components.NPagination, typeof __VLS_components.nPagination, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    page: (__VLS_ctx.query.pageNum),
    pageSize: (__VLS_ctx.query.pageSize),
    itemCount: (__VLS_ctx.total),
    pageSizes: ([12, 20, 40]),
    showSizePicker: true,
}));
const __VLS_81 = __VLS_80({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    page: (__VLS_ctx.query.pageNum),
    pageSize: (__VLS_ctx.query.pageSize),
    itemCount: (__VLS_ctx.total),
    pageSizes: ([12, 20, 40]),
    showSizePicker: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
let __VLS_83;
let __VLS_84;
let __VLS_85;
const __VLS_86 = {
    'onUpdate:page': (__VLS_ctx.loadListings)
};
const __VLS_87 = {
    'onUpdate:pageSize': (__VLS_ctx.loadListings)
};
var __VLS_82;
var __VLS_2;
/** @type {[typeof GlassPanel, typeof GlassPanel, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(GlassPanel, new GlassPanel({}));
const __VLS_89 = __VLS_88({}, ...__VLS_functionalComponentArgsRest(__VLS_88));
__VLS_90.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
const __VLS_91 = {}.NDataTable;
/** @type {[typeof __VLS_components.NDataTable, typeof __VLS_components.nDataTable, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    columns: (__VLS_ctx.myColumns),
    data: (__VLS_ctx.myListings),
    pagination: (false),
    scrollX: (780),
}));
const __VLS_93 = __VLS_92({
    columns: (__VLS_ctx.myColumns),
    data: (__VLS_ctx.myListings),
    pagination: (false),
    scrollX: (780),
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
const __VLS_95 = {}.NPagination;
/** @type {[typeof __VLS_components.NPagination, typeof __VLS_components.nPagination, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.myPage.pageNum),
    pageSize: (__VLS_ctx.myPage.pageSize),
    itemCount: (__VLS_ctx.myTotal),
}));
const __VLS_97 = __VLS_96({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.myPage.pageNum),
    pageSize: (__VLS_ctx.myPage.pageSize),
    itemCount: (__VLS_ctx.myTotal),
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
let __VLS_99;
let __VLS_100;
let __VLS_101;
const __VLS_102 = {
    'onUpdate:page': (__VLS_ctx.loadMyListings)
};
const __VLS_103 = {
    'onUpdate:pageSize': (__VLS_ctx.loadMyListings)
};
var __VLS_98;
var __VLS_90;
const __VLS_104 = {}.NModal;
/** @type {[typeof __VLS_components.NModal, typeof __VLS_components.nModal, typeof __VLS_components.NModal, typeof __VLS_components.nModal, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    show: (__VLS_ctx.createModal),
    preset: "card",
    title: "上架库存",
    ...{ style: {} },
}));
const __VLS_106 = __VLS_105({
    show: (__VLS_ctx.createModal),
    preset: "card",
    title: "上架库存",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.NForm;
/** @type {[typeof __VLS_components.NForm, typeof __VLS_components.nForm, typeof __VLS_components.NForm, typeof __VLS_components.nForm, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    labelPlacement: "top",
}));
const __VLS_110 = __VLS_109({
    labelPlacement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.NFormItem;
/** @type {[typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "库存物品",
}));
const __VLS_114 = __VLS_113({
    label: "库存物品",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.NSelect;
/** @type {[typeof __VLS_components.NSelect, typeof __VLS_components.nSelect, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    value: (__VLS_ctx.createForm.inventoryId),
    options: (__VLS_ctx.inventoryOptions),
    placeholder: "选择库存物品",
}));
const __VLS_118 = __VLS_117({
    value: (__VLS_ctx.createForm.inventoryId),
    options: (__VLS_ctx.inventoryOptions),
    placeholder: "选择库存物品",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
var __VLS_115;
const __VLS_120 = {}.NFormItem;
/** @type {[typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "售价",
}));
const __VLS_122 = __VLS_121({
    label: "售价",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
const __VLS_124 = {}.NInputNumber;
/** @type {[typeof __VLS_components.NInputNumber, typeof __VLS_components.nInputNumber, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    value: (__VLS_ctx.createForm.price),
    min: (0.01),
    ...{ style: {} },
}));
const __VLS_126 = __VLS_125({
    value: (__VLS_ctx.createForm.price),
    min: (0.01),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
var __VLS_123;
var __VLS_111;
const __VLS_128 = {}.NSpace;
/** @type {[typeof __VLS_components.NSpace, typeof __VLS_components.nSpace, typeof __VLS_components.NSpace, typeof __VLS_components.nSpace, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    justify: "end",
}));
const __VLS_130 = __VLS_129({
    justify: "end",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ...{ 'onClick': {} },
}));
const __VLS_134 = __VLS_133({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
let __VLS_136;
let __VLS_137;
let __VLS_138;
const __VLS_139 = {
    onClick: (...[$event]) => {
        __VLS_ctx.createModal = false;
    }
};
__VLS_135.slots.default;
var __VLS_135;
const __VLS_140 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_142 = __VLS_141({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
let __VLS_144;
let __VLS_145;
let __VLS_146;
const __VLS_147 = {
    onClick: (__VLS_ctx.createListing)
};
__VLS_143.slots.default;
var __VLS_143;
var __VLS_131;
var __VLS_107;
/** @type {__VLS_StyleScopedClasses['market-page']} */ ;
/** @type {__VLS_StyleScopedClasses['row-head']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['listing-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['listing-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NDataTable: NDataTable,
            NForm: NForm,
            NFormItem: NFormItem,
            NGrid: NGrid,
            NGridItem: NGridItem,
            NImage: NImage,
            NInput: NInput,
            NInputNumber: NInputNumber,
            NModal: NModal,
            NPagination: NPagination,
            NSelect: NSelect,
            NSpace: NSpace,
            GlassPanel: GlassPanel,
            money: money,
            wearText: wearText,
            isMobile: isMobile,
            query: query,
            sortOptions: sortOptions,
            listings: listings,
            total: total,
            myPage: myPage,
            myListings: myListings,
            myTotal: myTotal,
            createModal: createModal,
            createForm: createForm,
            inventoryOptions: inventoryOptions,
            myColumns: myColumns,
            loadListings: loadListings,
            loadMyListings: loadMyListings,
            buy: buy,
            openCreate: openCreate,
            createListing: createListing,
            reset: reset,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
