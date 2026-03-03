import { computed, onMounted, reactive, ref } from 'vue';
import { NButton, NDataTable, NGrid, NGridItem, NInputNumber, NPagination, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import StatCard from '@/components/StatCard.vue';
import { inventoryApi, walletApi } from '@/api/modules';
import { formatDateTime, money } from '@/types/format';
const message = useMessage();
const isMobile = computed(() => window.innerWidth < 900);
const balance = ref(0);
const stats = ref();
const rechargeAmount = ref(100);
const withdrawAmount = ref(50);
const logs = ref([]);
const total = ref(0);
const query = reactive({ pageNum: 1, pageSize: 10 });
const columns = [
    { title: '类型', key: 'typeName', width: 120 },
    { title: '金额', key: 'amount', render: (row) => money(row.amount) },
    { title: '变更后余额', key: 'balanceAfter', render: (row) => money(row.balanceAfter) },
    { title: '关联订单', key: 'orderNo', render: (row) => row.orderNo || '-' },
    { title: '备注', key: 'remark', minWidth: 180, render: (row) => row.remark || '-' },
    { title: '时间', key: 'createTime', minWidth: 160, render: (row) => formatDateTime(row.createTime) }
];
const loadBalance = async () => {
    const value = await walletApi.balance();
    balance.value = Number(value || 0);
};
const loadStats = async () => {
    stats.value = await inventoryApi.statistics();
};
const loadLogs = async () => {
    const data = await walletApi.logs({ ...query });
    logs.value = data.list;
    total.value = data.total;
};
const recharge = async () => {
    if (!rechargeAmount.value)
        return;
    try {
        await walletApi.recharge(rechargeAmount.value);
        message.success('充值成功');
        await Promise.all([loadBalance(), loadStats(), loadLogs()]);
    }
    catch (error) {
        message.error(error.message || '充值失败');
    }
};
const withdraw = async () => {
    if (!withdrawAmount.value)
        return;
    try {
        await walletApi.withdraw(withdrawAmount.value);
        message.success('提现成功');
        await Promise.all([loadBalance(), loadStats(), loadLogs()]);
    }
    catch (error) {
        message.error(error.message || '提现失败');
    }
};
onMounted(async () => {
    try {
        await Promise.all([loadBalance(), loadStats(), loadLogs()]);
    }
    catch (error) {
        message.error(error.message || '加载数据失败');
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "wallet-page" },
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "balance" },
});
(__VLS_ctx.money(__VLS_ctx.balance));
const __VLS_18 = {}.NGrid;
/** @type {[typeof __VLS_components.NGrid, typeof __VLS_components.nGrid, typeof __VLS_components.NGrid, typeof __VLS_components.nGrid, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    cols: (__VLS_ctx.isMobile ? 1 : 2),
    xGap: (12),
    yGap: (12),
}));
const __VLS_20 = __VLS_19({
    cols: (__VLS_ctx.isMobile ? 1 : 2),
    xGap: (12),
    yGap: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_21.slots.default;
const __VLS_22 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({}));
const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_25.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "title" },
});
const __VLS_26 = {}.NInputNumber;
/** @type {[typeof __VLS_components.NInputNumber, typeof __VLS_components.nInputNumber, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    value: (__VLS_ctx.rechargeAmount),
    min: (0.01),
    ...{ style: {} },
}));
const __VLS_28 = __VLS_27({
    value: (__VLS_ctx.rechargeAmount),
    min: (0.01),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const __VLS_30 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    ...{ 'onClick': {} },
    type: "primary",
    block: true,
    ...{ style: {} },
}));
const __VLS_32 = __VLS_31({
    ...{ 'onClick': {} },
    type: "primary",
    block: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_34;
let __VLS_35;
let __VLS_36;
const __VLS_37 = {
    onClick: (__VLS_ctx.recharge)
};
__VLS_33.slots.default;
var __VLS_33;
var __VLS_25;
const __VLS_38 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({}));
const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "title" },
});
const __VLS_42 = {}.NInputNumber;
/** @type {[typeof __VLS_components.NInputNumber, typeof __VLS_components.nInputNumber, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
    value: (__VLS_ctx.withdrawAmount),
    min: (0.01),
    ...{ style: {} },
}));
const __VLS_44 = __VLS_43({
    value: (__VLS_ctx.withdrawAmount),
    min: (0.01),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
const __VLS_46 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    ...{ 'onClick': {} },
    type: "warning",
    block: true,
    ...{ style: {} },
}));
const __VLS_48 = __VLS_47({
    ...{ 'onClick': {} },
    type: "warning",
    block: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_50;
let __VLS_51;
let __VLS_52;
const __VLS_53 = {
    onClick: (__VLS_ctx.withdraw)
};
__VLS_49.slots.default;
var __VLS_49;
var __VLS_41;
var __VLS_21;
var __VLS_17;
/** @type {[typeof GlassPanel, typeof GlassPanel, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(GlassPanel, new GlassPanel({}));
const __VLS_55 = __VLS_54({}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
const __VLS_57 = {}.NDataTable;
/** @type {[typeof __VLS_components.NDataTable, typeof __VLS_components.nDataTable, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    columns: (__VLS_ctx.columns),
    data: (__VLS_ctx.logs),
    pagination: (false),
    scrollX: (950),
}));
const __VLS_59 = __VLS_58({
    columns: (__VLS_ctx.columns),
    data: (__VLS_ctx.logs),
    pagination: (false),
    scrollX: (950),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
const __VLS_61 = {}.NPagination;
/** @type {[typeof __VLS_components.NPagination, typeof __VLS_components.nPagination, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.query.pageNum),
    pageSize: (__VLS_ctx.query.pageSize),
    itemCount: (__VLS_ctx.total),
    showSizePicker: true,
}));
const __VLS_63 = __VLS_62({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.query.pageNum),
    pageSize: (__VLS_ctx.query.pageSize),
    itemCount: (__VLS_ctx.total),
    showSizePicker: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_65;
let __VLS_66;
let __VLS_67;
const __VLS_68 = {
    'onUpdate:page': (__VLS_ctx.loadLogs)
};
const __VLS_69 = {
    'onUpdate:pageSize': (__VLS_ctx.loadLogs)
};
var __VLS_64;
var __VLS_56;
/** @type {__VLS_StyleScopedClasses['wallet-page']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['balance']} */ ;
/** @type {__VLS_StyleScopedClasses['action-card']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['action-card']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NDataTable: NDataTable,
            NGrid: NGrid,
            NGridItem: NGridItem,
            NInputNumber: NInputNumber,
            NPagination: NPagination,
            GlassPanel: GlassPanel,
            StatCard: StatCard,
            money: money,
            isMobile: isMobile,
            balance: balance,
            stats: stats,
            rechargeAmount: rechargeAmount,
            withdrawAmount: withdrawAmount,
            logs: logs,
            total: total,
            query: query,
            columns: columns,
            loadLogs: loadLogs,
            recharge: recharge,
            withdraw: withdraw,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
