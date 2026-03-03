import { h, onMounted, reactive, ref, watch } from 'vue';
import { NButton, NDataTable, NPagination, NSelect, NTabPane, NTabs, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import { orderApi } from '@/api/modules';
import { formatDateTime, money } from '@/types/format';
const message = useMessage();
const status = ref(null);
const currentTab = ref('buy');
const statusOptions = [
    { label: '待支付', value: 0 },
    { label: '待发货', value: 1 },
    { label: '已发货', value: 2 },
    { label: '交易成功', value: 3 },
    { label: '已取消', value: 4 }
];
const statusText = (value) => {
    if (value === 0)
        return '待支付';
    if (value === 1)
        return '待发货';
    if (value === 2)
        return '已发货';
    if (value === 3)
        return '交易成功';
    return '已取消';
};
const buyOrders = ref([]);
const sellOrders = ref([]);
const buyTotal = ref(0);
const sellTotal = ref(0);
const buyPage = reactive({ pageNum: 1, pageSize: 10 });
const sellPage = reactive({ pageNum: 1, pageSize: 10 });
const actionButton = (label, action, type = 'primary') => h(NButton, {
    size: 'small',
    type,
    onClick: async () => {
        await action();
    }
}, { default: () => label });
const buyColumns = [
    { title: '订单号', key: 'orderNo', minWidth: 160 },
    { title: '物品', key: 'itemName', minWidth: 140 },
    { title: '金额', key: 'totalAmount', render: (row) => money(row.totalAmount) },
    { title: '状态', key: 'status', render: (row) => statusText(row.status) },
    { title: '下单时间', key: 'createTime', minWidth: 160, render: (row) => formatDateTime(row.createTime) },
    {
        title: '操作',
        key: 'actions',
        width: 180,
        render: (row) => {
            if (row.status === 0) {
                return h('div', { style: 'display:flex;gap:8px;' }, [
                    actionButton('支付', () => runAction(() => orderApi.pay(row.id))),
                    actionButton('取消', () => runAction(() => orderApi.cancel(row.id)), 'error')
                ]);
            }
            if (row.status === 2) {
                return actionButton('确认收货', () => runAction(() => orderApi.confirm(row.id)), 'warning');
            }
            return '-';
        }
    }
];
const sellColumns = [
    { title: '订单号', key: 'orderNo', minWidth: 160 },
    { title: '物品', key: 'itemName', minWidth: 140 },
    { title: '金额', key: 'totalAmount', render: (row) => money(row.totalAmount) },
    { title: '状态', key: 'status', render: (row) => statusText(row.status) },
    { title: '下单时间', key: 'createTime', minWidth: 160, render: (row) => formatDateTime(row.createTime) },
    {
        title: '操作',
        key: 'actions',
        width: 120,
        render: (row) => {
            if (row.status === 1) {
                return actionButton('发货', () => runAction(() => orderApi.deliver(row.id)), 'primary');
            }
            return '-';
        }
    }
];
const runAction = async (fn) => {
    try {
        await fn();
        message.success('操作成功');
        await Promise.all([loadBuy(), loadSell()]);
    }
    catch (error) {
        message.error(error.message || '操作失败');
    }
};
const loadBuy = async () => {
    const data = await orderApi.myBuy({ ...buyPage, status: status.value ?? undefined });
    buyOrders.value = data.list;
    buyTotal.value = data.total;
};
const loadSell = async () => {
    const data = await orderApi.mySell({ ...sellPage, status: status.value ?? undefined });
    sellOrders.value = data.list;
    sellTotal.value = data.total;
};
const onTabChange = (name) => {
    currentTab.value = name;
    if (currentTab.value === 'buy') {
        loadBuy().catch((error) => message.error(error.message || '加载订单失败'));
    }
    else {
        loadSell().catch((error) => message.error(error.message || '加载订单失败'));
    }
};
watch(status, () => {
    if (currentTab.value === 'buy') {
        loadBuy().catch((error) => message.error(error.message || '加载订单失败'));
    }
    else {
        loadSell().catch((error) => message.error(error.message || '加载订单失败'));
    }
});
onMounted(async () => {
    try {
        await Promise.all([loadBuy(), loadSell()]);
    }
    catch (error) {
        message.error(error.message || '加载订单失败');
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "orders-page" },
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
const __VLS_3 = {}.NSelect;
/** @type {[typeof __VLS_components.NSelect, typeof __VLS_components.nSelect, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    value: (__VLS_ctx.status),
    options: (__VLS_ctx.statusOptions),
    clearable: true,
    placeholder: "筛选状态",
    ...{ style: {} },
}));
const __VLS_5 = __VLS_4({
    value: (__VLS_ctx.status),
    options: (__VLS_ctx.statusOptions),
    clearable: true,
    placeholder: "筛选状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
const __VLS_7 = {}.NTabs;
/** @type {[typeof __VLS_components.NTabs, typeof __VLS_components.nTabs, typeof __VLS_components.NTabs, typeof __VLS_components.nTabs, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    ...{ 'onUpdate:value': {} },
    type: "segment",
    animated: true,
}));
const __VLS_9 = __VLS_8({
    ...{ 'onUpdate:value': {} },
    type: "segment",
    animated: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_11;
let __VLS_12;
let __VLS_13;
const __VLS_14 = {
    'onUpdate:value': (__VLS_ctx.onTabChange)
};
__VLS_10.slots.default;
const __VLS_15 = {}.NTabPane;
/** @type {[typeof __VLS_components.NTabPane, typeof __VLS_components.nTabPane, typeof __VLS_components.NTabPane, typeof __VLS_components.nTabPane, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    name: "buy",
    tab: "我买到的",
}));
const __VLS_17 = __VLS_16({
    name: "buy",
    tab: "我买到的",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.NDataTable;
/** @type {[typeof __VLS_components.NDataTable, typeof __VLS_components.nDataTable, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    columns: (__VLS_ctx.buyColumns),
    data: (__VLS_ctx.buyOrders),
    pagination: (false),
    scrollX: (980),
}));
const __VLS_21 = __VLS_20({
    columns: (__VLS_ctx.buyColumns),
    data: (__VLS_ctx.buyOrders),
    pagination: (false),
    scrollX: (980),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const __VLS_23 = {}.NPagination;
/** @type {[typeof __VLS_components.NPagination, typeof __VLS_components.nPagination, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.buyPage.pageNum),
    pageSize: (__VLS_ctx.buyPage.pageSize),
    itemCount: (__VLS_ctx.buyTotal),
}));
const __VLS_25 = __VLS_24({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.buyPage.pageNum),
    pageSize: (__VLS_ctx.buyPage.pageSize),
    itemCount: (__VLS_ctx.buyTotal),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_27;
let __VLS_28;
let __VLS_29;
const __VLS_30 = {
    'onUpdate:page': (__VLS_ctx.loadBuy)
};
const __VLS_31 = {
    'onUpdate:pageSize': (__VLS_ctx.loadBuy)
};
var __VLS_26;
var __VLS_18;
const __VLS_32 = {}.NTabPane;
/** @type {[typeof __VLS_components.NTabPane, typeof __VLS_components.nTabPane, typeof __VLS_components.NTabPane, typeof __VLS_components.nTabPane, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    name: "sell",
    tab: "我卖出的",
}));
const __VLS_34 = __VLS_33({
    name: "sell",
    tab: "我卖出的",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.NDataTable;
/** @type {[typeof __VLS_components.NDataTable, typeof __VLS_components.nDataTable, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    columns: (__VLS_ctx.sellColumns),
    data: (__VLS_ctx.sellOrders),
    pagination: (false),
    scrollX: (980),
}));
const __VLS_38 = __VLS_37({
    columns: (__VLS_ctx.sellColumns),
    data: (__VLS_ctx.sellOrders),
    pagination: (false),
    scrollX: (980),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.NPagination;
/** @type {[typeof __VLS_components.NPagination, typeof __VLS_components.nPagination, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.sellPage.pageNum),
    pageSize: (__VLS_ctx.sellPage.pageSize),
    itemCount: (__VLS_ctx.sellTotal),
}));
const __VLS_42 = __VLS_41({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.sellPage.pageNum),
    pageSize: (__VLS_ctx.sellPage.pageSize),
    itemCount: (__VLS_ctx.sellTotal),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
    'onUpdate:page': (__VLS_ctx.loadSell)
};
const __VLS_48 = {
    'onUpdate:pageSize': (__VLS_ctx.loadSell)
};
var __VLS_43;
var __VLS_35;
var __VLS_10;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['orders-page']} */ ;
/** @type {__VLS_StyleScopedClasses['row-head']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NDataTable: NDataTable,
            NPagination: NPagination,
            NSelect: NSelect,
            NTabPane: NTabPane,
            NTabs: NTabs,
            GlassPanel: GlassPanel,
            status: status,
            statusOptions: statusOptions,
            buyOrders: buyOrders,
            sellOrders: sellOrders,
            buyTotal: buyTotal,
            sellTotal: sellTotal,
            buyPage: buyPage,
            sellPage: sellPage,
            buyColumns: buyColumns,
            sellColumns: sellColumns,
            loadBuy: loadBuy,
            loadSell: loadSell,
            onTabChange: onTabChange,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
