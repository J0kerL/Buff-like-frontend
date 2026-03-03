import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NCarousel, NEmpty, NImage, NModal, NSpin, useMessage } from 'naive-ui';
import GlassPanel from '@/components/GlassPanel.vue';
import { marketApi } from '@/api/modules';
import { money, wearText } from '@/types/format';
const router = useRouter();
const message = useMessage();
const hotItems = ref([]);
const loading = ref(true);
const newsCarouselRef = ref(null);
const previewVisible = ref(false);
const previewImage = ref('');
// Mock news data
const newsList = [
    {
        title: 'CS2赛季新皮肤',
        description: '全新收藏品现已开放交易，热门新品抢先看。',
        date: '2024-03-15',
        image: 'https://market.fp.ps.netease.com/file/6971c8c418c0d5c5d9e4a9aa4EIh9Xw307',
        link: 'https://buff.163.com/market/csgo#game=csgo&page_num=1&itemset=set_timed_drops_exuberant,set_timed_drops_achroma'
    },
    {
        title: 'BUFF移动端APP',
        description: '随时随地便捷交易，行情与报价一手掌握。',
        date: '2024-03-14',
        image: 'https://g.fp.ps.netease.com/market/file/6247f63543d792abefab0c1cQMtLcCks04',
        link: 'https://buff.163.com/app/'
    },
    {
        title: 'UU加速器',
        description: '免费加速，解决交易访问与加载缓慢问题。',
        date: '2024-03-13',
        image: 'https://market.fp.ps.netease.com/file/68c235d1947e1a385d17caf8vjeKxeKR06',
        link: 'https://uu.163.com/?from=buff'
    },
    {
        title: '交易防骗指南',
        description: '务必阅读',
        date: '2024-03-12',
        image: 'https://g.fp.ps.netease.com/market/file/5bc5a9f7a7f252bce7d74e26yrA5Zmyd',
        link: 'https://buff.163.com/news/12027?from=banner'
    }
];
const loadHotItems = async () => {
    loading.value = true;
    try {
        const result = await marketApi.hotItems({ pageNum: 1, pageSize: 10 });
        hotItems.value = result.list;
    }
    catch (error) {
        message.error(error.message || '加载热门饰品失败');
    }
    finally {
        loading.value = false;
    }
};
const goToMarket = (id) => {
    router.push(`/market?id=${id}`);
};
const prevNews = () => {
    newsCarouselRef.value?.prev();
};
const nextNews = () => {
    newsCarouselRef.value?.next();
};
const openPreview = (image) => {
    previewImage.value = image;
    previewVisible.value = true;
};
onMounted(loadHotItems);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['news-item']} */ ;
/** @type {__VLS_StyleScopedClasses['news-content-link']} */ ;
/** @type {__VLS_StyleScopedClasses['news-title']} */ ;
/** @type {__VLS_StyleScopedClasses['news-item']} */ ;
/** @type {__VLS_StyleScopedClasses['news-image']} */ ;
/** @type {__VLS_StyleScopedClasses['news-image']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['item-card']} */ ;
/** @type {__VLS_StyleScopedClasses['item-image']} */ ;
/** @type {__VLS_StyleScopedClasses['hot-items-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['hot-items-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['news-item']} */ ;
/** @type {__VLS_StyleScopedClasses['news-image']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['news-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hot-items-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['news-item']} */ ;
/** @type {__VLS_StyleScopedClasses['news-title']} */ ;
/** @type {__VLS_StyleScopedClasses['news-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['news-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hot-items-grid']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dashboard" },
});
/** @type {[typeof GlassPanel, typeof GlassPanel, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(GlassPanel, new GlassPanel({
    ...{ class: "news-section" },
}));
const __VLS_1 = __VLS_0({
    ...{ class: "news-section" },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
const __VLS_3 = {}.NCarousel;
/** @type {[typeof __VLS_components.NCarousel, typeof __VLS_components.nCarousel, typeof __VLS_components.NCarousel, typeof __VLS_components.nCarousel, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    ref: "newsCarouselRef",
    autoplay: true,
    interval: (4000),
    showDots: (false),
}));
const __VLS_5 = __VLS_4({
    ref: "newsCarouselRef",
    autoplay: true,
    interval: (4000),
    showDots: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
/** @type {typeof __VLS_ctx.newsCarouselRef} */ ;
var __VLS_7 = {};
__VLS_6.slots.default;
for (const [news, index] of __VLS_getVForSourceType((__VLS_ctx.newsList))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: "news-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
        ...{ class: "news-content news-content-link" },
        href: (news.link),
        target: "_blank",
        rel: "noopener noreferrer",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "news-title" },
    });
    (news.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "news-desc" },
    });
    (news.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openPreview(news.image);
            } },
        ...{ onKeydown: (...[$event]) => {
                __VLS_ctx.openPreview(news.image);
            } },
        ...{ onKeydown: (...[$event]) => {
                __VLS_ctx.openPreview(news.image);
            } },
        ...{ class: "news-image" },
        role: "button",
        tabindex: "0",
    });
    const __VLS_9 = {}.NImage;
    /** @type {[typeof __VLS_components.NImage, typeof __VLS_components.nImage, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        src: (news.image),
        objectFit: "cover",
        previewDisabled: true,
    }));
    const __VLS_11 = __VLS_10({
        src: (news.image),
        objectFit: "cover",
        previewDisabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
}
var __VLS_6;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.prevNews) },
    ...{ class: "carousel-nav carousel-nav--prev" },
    type: "button",
    'aria-label': "Previous news",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "carousel-nav__icon carousel-nav__icon--prev" },
    'aria-hidden': "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.nextNews) },
    ...{ class: "carousel-nav carousel-nav--next" },
    type: "button",
    'aria-label': "Next news",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "carousel-nav__icon carousel-nav__icon--next" },
    'aria-hidden': "true",
});
const __VLS_13 = {}.NModal;
/** @type {[typeof __VLS_components.NModal, typeof __VLS_components.nModal, typeof __VLS_components.NModal, typeof __VLS_components.nModal, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    show: (__VLS_ctx.previewVisible),
    maskClosable: (true),
}));
const __VLS_15 = __VLS_14({
    show: (__VLS_ctx.previewVisible),
    maskClosable: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: () => { } },
    ...{ class: "news-preview" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.previewVisible = false;
        } },
    ...{ class: "news-preview__close" },
    type: "button",
    'aria-label': "关闭预览",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.previewImage),
    alt: "新闻图片预览",
    ...{ class: "news-preview__img" },
});
var __VLS_16;
var __VLS_2;
/** @type {[typeof GlassPanel, typeof GlassPanel, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(GlassPanel, new GlassPanel({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "row-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
const __VLS_20 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onClick': {} },
    text: true,
    type: "primary",
}));
const __VLS_22 = __VLS_21({
    ...{ 'onClick': {} },
    text: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onClick: (...[$event]) => {
        __VLS_ctx.router.push('/market');
    }
};
__VLS_23.slots.default;
var __VLS_23;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-state" },
    });
    const __VLS_28 = {}.NSpin;
    /** @type {[typeof __VLS_components.NSpin, typeof __VLS_components.nSpin, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        size: "large",
    }));
    const __VLS_30 = __VLS_29({
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
else if (__VLS_ctx.hotItems.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-state" },
    });
    const __VLS_32 = {}.NEmpty;
    /** @type {[typeof __VLS_components.NEmpty, typeof __VLS_components.nEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        description: "暂无热门饰品",
    }));
    const __VLS_34 = __VLS_33({
        description: "暂无热门饰品",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "hot-items-grid" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.hotItems))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (item.id),
            ...{ class: "item-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item-image" },
        });
        const __VLS_36 = {}.NImage;
        /** @type {[typeof __VLS_components.NImage, typeof __VLS_components.nImage, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            src: (item.iconUrl),
            objectFit: "contain",
            fallbackSrc: "https://dummyimage.com/200x150/e2e8f0/64748b&text=No+Image",
        }));
        const __VLS_38 = __VLS_37({
            src: (item.iconUrl),
            objectFit: "contain",
            fallbackSrc: "https://dummyimage.com/200x150/e2e8f0/64748b&text=No+Image",
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item-name" },
        });
        (item.itemName);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item-meta" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "wear-tag" },
        });
        (__VLS_ctx.wearText(item.wearValue));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item-footer" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item-price" },
        });
        (__VLS_ctx.money(item.price));
        const __VLS_40 = {}.NButton;
        /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
            ...{ 'onClick': {} },
            size: "small",
            type: "primary",
        }));
        const __VLS_42 = __VLS_41({
            ...{ 'onClick': {} },
            size: "small",
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        let __VLS_44;
        let __VLS_45;
        let __VLS_46;
        const __VLS_47 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.hotItems.length === 0))
                    return;
                __VLS_ctx.goToMarket(item.id);
            }
        };
        __VLS_43.slots.default;
        var __VLS_43;
    }
}
var __VLS_19;
/** @type {__VLS_StyleScopedClasses['dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['news-section']} */ ;
/** @type {__VLS_StyleScopedClasses['news-item']} */ ;
/** @type {__VLS_StyleScopedClasses['news-content']} */ ;
/** @type {__VLS_StyleScopedClasses['news-content-link']} */ ;
/** @type {__VLS_StyleScopedClasses['news-title']} */ ;
/** @type {__VLS_StyleScopedClasses['news-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['news-image']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-nav--prev']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-nav__icon']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-nav__icon--prev']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-nav--next']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-nav__icon']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-nav__icon--next']} */ ;
/** @type {__VLS_StyleScopedClasses['news-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['news-preview__close']} */ ;
/** @type {__VLS_StyleScopedClasses['news-preview__img']} */ ;
/** @type {__VLS_StyleScopedClasses['row-head']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['hot-items-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['item-card']} */ ;
/** @type {__VLS_StyleScopedClasses['item-image']} */ ;
/** @type {__VLS_StyleScopedClasses['item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['item-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['wear-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['item-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['item-price']} */ ;
// @ts-ignore
var __VLS_8 = __VLS_7;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NCarousel: NCarousel,
            NEmpty: NEmpty,
            NImage: NImage,
            NModal: NModal,
            NSpin: NSpin,
            GlassPanel: GlassPanel,
            money: money,
            wearText: wearText,
            router: router,
            hotItems: hotItems,
            loading: loading,
            newsCarouselRef: newsCarouselRef,
            previewVisible: previewVisible,
            previewImage: previewImage,
            newsList: newsList,
            goToMarket: goToMarket,
            prevNews: prevNews,
            nextNews: nextNews,
            openPreview: openPreview,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
