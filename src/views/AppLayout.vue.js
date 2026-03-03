import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NButton, NDrawer, NDrawerContent, NIcon, NMenu, useMessage } from 'naive-ui';
import { GridOutline, CartOutline, CubeOutline, ReceiptOutline, WalletOutline } from '@vicons/ionicons5';
import TopBar from '@/components/TopBar.vue';
import { useAuthStore } from '@/stores/auth';
import { money } from '@/types/format';
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const message = useMessage();
const showDrawer = ref(false);
const isMobile = ref(window.innerWidth <= 900);
const icon = (iconComp) => () => h(NIcon, null, { default: () => h(iconComp) });
const menuOptions = [
    { label: '首页', key: '/dashboard', icon: icon(GridOutline) },
    { label: '饰品市场', key: '/market', icon: icon(CartOutline) },
    { label: '我的库存', key: '/inventory', icon: icon(CubeOutline) },
    { label: '我的出售', key: '/orders', icon: icon(ReceiptOutline) },
    { label: '我的', key: '/wallet', icon: icon(WalletOutline) }
];
const currentPath = computed(() => route.path);
const go = (path) => {
    router.push(path);
};
const onDrawerSelect = (path) => {
    go(path);
    showDrawer.value = false;
};
const onLogout = async () => {
    await authStore.logout();
    message.success('已退出');
    router.replace('/auth');
};
const handleResize = () => {
    isMobile.value = window.innerWidth <= 900;
};
onMounted(async () => {
    window.addEventListener('resize', handleResize);
    if (!authStore.user) {
        try {
            await authStore.loadCurrentUser();
        }
        catch {
            await authStore.logout();
            router.replace('/auth');
        }
    }
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "layout page-wrap" },
});
/** @type {[typeof TopBar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(TopBar, new TopBar({
    ...{ 'onMenu': {} },
    ...{ 'onSelect': {} },
    ...{ 'onLogout': {} },
    isMobile: (__VLS_ctx.isMobile),
    username: (__VLS_ctx.authStore.user?.username),
    balance: (__VLS_ctx.money(__VLS_ctx.authStore.user?.balance)),
    menuOptions: (__VLS_ctx.menuOptions),
    currentPath: (__VLS_ctx.currentPath),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onMenu': {} },
    ...{ 'onSelect': {} },
    ...{ 'onLogout': {} },
    isMobile: (__VLS_ctx.isMobile),
    username: (__VLS_ctx.authStore.user?.username),
    balance: (__VLS_ctx.money(__VLS_ctx.authStore.user?.balance)),
    menuOptions: (__VLS_ctx.menuOptions),
    currentPath: (__VLS_ctx.currentPath),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onMenu: (...[$event]) => {
        __VLS_ctx.showDrawer = true;
    }
};
const __VLS_7 = {
    onSelect: (__VLS_ctx.go)
};
const __VLS_8 = {
    onLogout: (__VLS_ctx.onLogout)
};
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "main-area" },
});
const __VLS_9 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const __VLS_13 = {}.NDrawer;
/** @type {[typeof __VLS_components.NDrawer, typeof __VLS_components.nDrawer, typeof __VLS_components.NDrawer, typeof __VLS_components.nDrawer, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    show: (__VLS_ctx.showDrawer),
    placement: "left",
    width: "260",
}));
const __VLS_15 = __VLS_14({
    show: (__VLS_ctx.showDrawer),
    placement: "left",
    width: "260",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.NDrawerContent;
/** @type {[typeof __VLS_components.NDrawerContent, typeof __VLS_components.nDrawerContent, typeof __VLS_components.NDrawerContent, typeof __VLS_components.nDrawerContent, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    title: "导航",
}));
const __VLS_19 = __VLS_18({
    title: "导航",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.NMenu;
/** @type {[typeof __VLS_components.NMenu, typeof __VLS_components.nMenu, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ 'onUpdate:value': {} },
    options: (__VLS_ctx.menuOptions),
    value: (__VLS_ctx.currentPath),
}));
const __VLS_23 = __VLS_22({
    ...{ 'onUpdate:value': {} },
    options: (__VLS_ctx.menuOptions),
    value: (__VLS_ctx.currentPath),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_25;
let __VLS_26;
let __VLS_27;
const __VLS_28 = {
    'onUpdate:value': (__VLS_ctx.onDrawerSelect)
};
var __VLS_24;
const __VLS_29 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ 'onClick': {} },
    ...{ class: "logout" },
    tertiary: true,
    type: "error",
    block: true,
}));
const __VLS_31 = __VLS_30({
    ...{ 'onClick': {} },
    ...{ class: "logout" },
    tertiary: true,
    type: "error",
    block: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onClick: (__VLS_ctx.onLogout)
};
__VLS_32.slots.default;
var __VLS_32;
var __VLS_20;
var __VLS_16;
/** @type {__VLS_StyleScopedClasses['layout']} */ ;
/** @type {__VLS_StyleScopedClasses['page-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['main-area']} */ ;
/** @type {__VLS_StyleScopedClasses['logout']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NDrawer: NDrawer,
            NDrawerContent: NDrawerContent,
            NMenu: NMenu,
            TopBar: TopBar,
            money: money,
            authStore: authStore,
            showDrawer: showDrawer,
            isMobile: isMobile,
            menuOptions: menuOptions,
            currentPath: currentPath,
            go: go,
            onDrawerSelect: onDrawerSelect,
            onLogout: onLogout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
