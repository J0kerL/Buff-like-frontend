import { computed, onMounted, reactive, ref } from 'vue';
import { NButton, NDataTable, NGrid, NGridItem, NInputNumber, NPagination, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import { walletApi } from '@/api/modules';
import { formatDateTime, money } from '@/types/format';
const message = useMessage();
const isMobile = computed(() => window.innerWidth < 900);
const balance = ref(0);
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
        await Promise.all([loadBalance(), loadLogs()]);
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
        await Promise.all([loadBalance(), loadLogs()]);
    }
    catch (error) {
        message.error(error.message || '提现失败');
    }
};
onMounted(async () => {
    try {
        await Promise.all([loadBalance(), loadLogs()]);
    }
    catch (error) {
        message.error(error.message || '加载钱包失败');
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
    ...{ class: "balance" },
});
(__VLS_ctx.money(__VLS_ctx.balance));
const __VLS_3 = {}.NGrid;
/** @type {[typeof __VLS_components.NGrid, typeof __VLS_components.nGrid, typeof __VLS_components.NGrid, typeof __VLS_components.nGrid, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    cols: (__VLS_ctx.isMobile ? 1 : 2),
    xGap: (12),
    yGap: (12),
}));
const __VLS_5 = __VLS_4({
    cols: (__VLS_ctx.isMobile ? 1 : 2),
    xGap: (12),
    yGap: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
const __VLS_7 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_10.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "title" },
});
const __VLS_11 = {}.NInputNumber;
/** @type {[typeof __VLS_components.NInputNumber, typeof __VLS_components.nInputNumber, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    value: (__VLS_ctx.rechargeAmount),
    min: (0.01),
    ...{ style: {} },
}));
const __VLS_13 = __VLS_12({
    value: (__VLS_ctx.rechargeAmount),
    min: (0.01),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const __VLS_15 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    ...{ 'onClick': {} },
    type: "primary",
    block: true,
    ...{ style: {} },
}));
const __VLS_17 = __VLS_16({
    ...{ 'onClick': {} },
    type: "primary",
    block: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_19;
let __VLS_20;
let __VLS_21;
const __VLS_22 = {
    onClick: (__VLS_ctx.recharge)
};
__VLS_18.slots.default;
var __VLS_18;
var __VLS_10;
const __VLS_23 = {}.NGridItem;
/** @type {[typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, typeof __VLS_components.NGridItem, typeof __VLS_components.nGridItem, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({}));
const __VLS_25 = __VLS_24({}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "title" },
});
const __VLS_27 = {}.NInputNumber;
/** @type {[typeof __VLS_components.NInputNumber, typeof __VLS_components.nInputNumber, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    value: (__VLS_ctx.withdrawAmount),
    min: (0.01),
    ...{ style: {} },
}));
const __VLS_29 = __VLS_28({
    value: (__VLS_ctx.withdrawAmount),
    min: (0.01),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const __VLS_31 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    ...{ 'onClick': {} },
    type: "warning",
    block: true,
    ...{ style: {} },
}));
const __VLS_33 = __VLS_32({
    ...{ 'onClick': {} },
    type: "warning",
    block: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
let __VLS_35;
let __VLS_36;
let __VLS_37;
const __VLS_38 = {
    onClick: (__VLS_ctx.withdraw)
};
__VLS_34.slots.default;
var __VLS_34;
var __VLS_26;
var __VLS_6;
var __VLS_2;
/** @type {[typeof GlassPanel, typeof GlassPanel, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(GlassPanel, new GlassPanel({}));
const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
const __VLS_42 = {}.NDataTable;
/** @type {[typeof __VLS_components.NDataTable, typeof __VLS_components.nDataTable, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
    columns: (__VLS_ctx.columns),
    data: (__VLS_ctx.logs),
    pagination: (false),
    scrollX: (950),
}));
const __VLS_44 = __VLS_43({
    columns: (__VLS_ctx.columns),
    data: (__VLS_ctx.logs),
    pagination: (false),
    scrollX: (950),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
const __VLS_46 = {}.NPagination;
/** @type {[typeof __VLS_components.NPagination, typeof __VLS_components.nPagination, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.query.pageNum),
    pageSize: (__VLS_ctx.query.pageSize),
    itemCount: (__VLS_ctx.total),
    showSizePicker: true,
}));
const __VLS_48 = __VLS_47({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ style: {} },
    page: (__VLS_ctx.query.pageNum),
    pageSize: (__VLS_ctx.query.pageSize),
    itemCount: (__VLS_ctx.total),
    showSizePicker: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_50;
let __VLS_51;
let __VLS_52;
const __VLS_53 = {
    'onUpdate:page': (__VLS_ctx.loadLogs)
};
const __VLS_54 = {
    'onUpdate:pageSize': (__VLS_ctx.loadLogs)
};
var __VLS_49;
var __VLS_41;
/** @type {__VLS_StyleScopedClasses['wallet-page']} */ ;
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
            money: money,
            isMobile: isMobile,
            balance: balance,
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
