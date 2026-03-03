import { computed, h, onMounted, reactive, ref } from 'vue';
import { NButton, NDataTable, NGrid, NGridItem, NImage, NInput, NPagination, NSelect, NSpace, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import { inventoryApi } from '@/api/modules';
import { formatDateTime, wearText } from '@/types/format';
const message = useMessage();
const isMobile = computed(() => window.innerWidth < 900);
const items = ref([]);
const total = ref(0);
const query = reactive({
    pageNum: 1,
    pageSize: 10,
    status: null,
    type: '',
    rarity: '',
    keyword: ''
});
const statusText = (status) => {
    if (status === 0)
        return '在库';
    if (status === 1)
        return '出售中';
    return '交易锁定';
};
const statusOptions = [
    { label: '在库', value: 0 },
    { label: '出售中', value: 1 },
    { label: '交易锁定', value: 2 }
];
const columns = [
    { title: 'ID', key: 'id', width: 70 },
    {
        title: '图标',
        key: 'iconUrl',
        width: 84,
        render: (row) => h(NImage, {
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
    }
    catch (error) {
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "inventory-page" },
});
/** @type {[typeof GlassPanel, typeof GlassPanel, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(GlassPanel, new GlassPanel({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
const __VLS_3 = {}.NGrid;
/** @type {[typeof __VLS_components.NGrid, typeof __VLS_components.nGrid, typeof __VLS_components.NGrid, typeof __VLS_components.nGrid, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    cols: (__VLS_ctx.isMobile ? 1 : 5),
    xGap: (10),
    yGap: (10),
}));
const __VLS_5 = __VLS_4({
    cols: (__VLS_ctx.isMobile ? 1 : 5),
    xGap: (10),
    yGap: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
const __VLS_7 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_10.slots.default;
const __VLS_11 = {}.NInput;
/** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    value: (__VLS_ctx.query.keyword),
    placeholder: "名称关键词",
    clearable: true,
}));
const __VLS_13 = __VLS_12({
    value: (__VLS_ctx.query.keyword),
    placeholder: "名称关键词",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
var __VLS_10;
const __VLS_15 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.NSelect;
/** @type {[typeof __VLS_components.NSelect, typeof __VLS_components.nSelect, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    value: (__VLS_ctx.query.status),
    options: (__VLS_ctx.statusOptions),
    clearable: true,
    placeholder: "状态",
}));
const __VLS_21 = __VLS_20({
    value: (__VLS_ctx.query.status),
    options: (__VLS_ctx.statusOptions),
    clearable: true,
    placeholder: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_18;
const __VLS_23 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({}));
const __VLS_25 = __VLS_24({}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.NInput;
/** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    value: (__VLS_ctx.query.type),
    placeholder: "类型",
    clearable: true,
}));
const __VLS_29 = __VLS_28({
    value: (__VLS_ctx.query.type),
    placeholder: "类型",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
var __VLS_26;
const __VLS_31 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
const __VLS_35 = {}.NInput;
/** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    value: (__VLS_ctx.query.rarity),
    placeholder: "稀有度",
    clearable: true,
}));
const __VLS_37 = __VLS_36({
    value: (__VLS_ctx.query.rarity),
    placeholder: "稀有度",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
var __VLS_34;
const __VLS_39 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
const __VLS_43 = {}.NSpace;
/** @type {[typeof __VLS_components.NSpace, typeof __VLS_components.nSpace, typeof __VLS_components.NSpace, typeof __VLS_components.nSpace, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({}));
const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
const __VLS_47 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    ...{ 'onClick': {} },
}));
const __VLS_49 = __VLS_48({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_51;
let __VLS_52;
let __VLS_53;
const __VLS_54 = {
    onClick: (__VLS_ctx.load)
};
__VLS_50.slots.default;
var __VLS_50;
const __VLS_55 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    ...{ 'onClick': {} },
    quaternary: true,
}));
const __VLS_57 = __VLS_56({
    ...{ 'onClick': {} },
    quaternary: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_59;
let __VLS_60;
let __VLS_61;
const __VLS_62 = {
    onClick: (__VLS_ctx.reset)
};
__VLS_58.slots.default;
var __VLS_58;
var __VLS_46;
var __VLS_42;
var __VLS_6;
var __VLS_2;
/** @type {[typeof GlassPanel, typeof GlassPanel, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(GlassPanel, new GlassPanel({}));
const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_65.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
const __VLS_66 = {}.NDataTable;
/** @type {[typeof __VLS_components.NDataTable, typeof __VLS_components.nDataTable, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    columns: (__VLS_ctx.columns),
    data: (__VLS_ctx.items),
    pagination: (false),
    scrollX: (920),
}));
const __VLS_68 = __VLS_67({
    columns: (__VLS_ctx.columns),
    data: (__VLS_ctx.items),
    pagination: (false),
    scrollX: (920),
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
const __VLS_70 = {}.NPagination;
/** @type {[typeof __VLS_components.NPagination, typeof __VLS_components.nPagination, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.query.pageNum),
    pageSize: (__VLS_ctx.query.pageSize),
    itemCount: (__VLS_ctx.total),
    showSizePicker: true,
}));
const __VLS_72 = __VLS_71({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.query.pageNum),
    pageSize: (__VLS_ctx.query.pageSize),
    itemCount: (__VLS_ctx.total),
    showSizePicker: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_74;
let __VLS_75;
let __VLS_76;
const __VLS_77 = {
    'onUpdate:page': (__VLS_ctx.load)
};
const __VLS_78 = {
    'onUpdate:pageSize': (__VLS_ctx.load)
};
var __VLS_73;
var __VLS_65;
/** @type {__VLS_StyleScopedClasses['inventory-page']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NDataTable: NDataTable,
            NGrid: NGrid,
            NGridItem: NGridItem,
            NInput: NInput,
            NPagination: NPagination,
            NSelect: NSelect,
            NSpace: NSpace,
            GlassPanel: GlassPanel,
            isMobile: isMobile,
            items: items,
            total: total,
            query: query,
            statusOptions: statusOptions,
            columns: columns,
            load: load,
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
