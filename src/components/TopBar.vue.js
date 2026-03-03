import { MenuOutline } from '@vicons/ionicons5';
import { NButton, NIcon, NMenu, NTag } from 'naive-ui';
const __VLS_props = defineProps();
const emit = defineEmits();
const onSelect = (path) => {
    emit('select', path);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['n-menu-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "topbar glass-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left" },
});
if (__VLS_ctx.isMobile) {
    const __VLS_0 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        quaternary: true,
        circle: true,
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        quaternary: true,
        circle: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isMobile))
                return;
            __VLS_ctx.$emit('menu');
        }
    };
    __VLS_3.slots.default;
    {
        const { icon: __VLS_thisSlot } = __VLS_3.slots;
        const __VLS_8 = {}.NIcon;
        /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
        const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
        __VLS_11.slots.default;
        const __VLS_12 = {}.MenuOutline;
        /** @type {[typeof __VLS_components.MenuOutline, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
        const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
        var __VLS_11;
    }
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "brand" },
});
if (!__VLS_ctx.isMobile) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
        ...{ class: "nav-menu" },
    });
    const __VLS_16 = {}.NMenu;
    /** @type {[typeof __VLS_components.NMenu, typeof __VLS_components.nMenu, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ 'onUpdate:value': {} },
        mode: "horizontal",
        options: (__VLS_ctx.menuOptions),
        value: (__VLS_ctx.currentPath),
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onUpdate:value': {} },
        mode: "horizontal",
        options: (__VLS_ctx.menuOptions),
        value: (__VLS_ctx.currentPath),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_20;
    let __VLS_21;
    let __VLS_22;
    const __VLS_23 = {
        'onUpdate:value': (__VLS_ctx.onSelect)
    };
    var __VLS_19;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hello" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user" },
});
(__VLS_ctx.username || '用户');
const __VLS_24 = {}.NTag;
/** @type {[typeof __VLS_components.NTag, typeof __VLS_components.nTag, typeof __VLS_components.NTag, typeof __VLS_components.nTag, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    type: "success",
    round: true,
}));
const __VLS_26 = __VLS_25({
    type: "success",
    round: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
(__VLS_ctx.balance);
var __VLS_27;
if (!__VLS_ctx.isMobile) {
    const __VLS_28 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        tertiary: true,
        type: "error",
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        tertiary: true,
        type: "error",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (...[$event]) => {
            if (!(!__VLS_ctx.isMobile))
                return;
            __VLS_ctx.$emit('logout');
        }
    };
    __VLS_31.slots.default;
    var __VLS_31;
}
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['hello']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MenuOutline: MenuOutline,
            NButton: NButton,
            NIcon: NIcon,
            NMenu: NMenu,
            NTag: NTag,
            onSelect: onSelect,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
