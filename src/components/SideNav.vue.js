import { NButton, NMenu } from 'naive-ui';
const __VLS_props = withDefaults(defineProps(), {
    brand: 'Buff Trade'
});
const emit = defineEmits();
const onSelect = (path) => {
    emit('select', path);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    brand: 'Buff Trade'
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "sidebar glass-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "brand" },
});
(__VLS_ctx.brand);
const __VLS_0 = {}.NMenu;
/** @type {[typeof __VLS_components.NMenu, typeof __VLS_components.nMenu, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onUpdate:value': {} },
    options: (__VLS_ctx.menuOptions),
    value: (__VLS_ctx.currentPath),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onUpdate:value': {} },
    options: (__VLS_ctx.menuOptions),
    value: (__VLS_ctx.currentPath),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    'onUpdate:value': (__VLS_ctx.onSelect)
};
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sidebar-footer" },
});
const __VLS_8 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    tertiary: true,
    type: "error",
    block: true,
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    tertiary: true,
    type: "error",
    block: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('logout');
    }
};
__VLS_11.slots.default;
var __VLS_11;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-footer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NMenu: NMenu,
            onSelect: onSelect,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
