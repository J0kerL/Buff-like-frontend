import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui';
import { authApi } from '@/api/modules';
import { useAuthStore } from '@/stores/auth';
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const loading = ref(false);
const countdown = ref(0);
const mode = ref('login');
const captchaCode = ref('');
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
let timer = null;
const isLoginMode = computed(() => mode.value === 'login');
const loginForm = reactive({
    username: '',
    password: '',
    captchaInput: ''
});
const registerForm = reactive({
    username: '',
    password: '',
    mobile: '',
    code: ''
});
const loginErrors = reactive({
    username: '',
    password: '',
    captchaInput: ''
});
const registerErrors = reactive({
    username: '',
    password: '',
    mobile: '',
    code: ''
});
const createCaptcha = () => {
    const source = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    captchaCode.value = Array.from({ length: 4 })
        .map(() => source[Math.floor(Math.random() * source.length)])
        .join('');
};
const refreshCaptcha = () => {
    createCaptcha();
    loginForm.captchaInput = '';
    loginErrors.captchaInput = '';
};
const validateLoginField = (field) => {
    if (field === 'username') {
        loginErrors.username = loginForm.username.trim() ? '' : '请输入用户名';
    }
    if (field === 'password') {
        if (!loginForm.password) {
            loginErrors.password = '请输入密码';
        }
        else if (loginForm.password.length < 6 || loginForm.password.length > 20) {
            loginErrors.password = '密码长度需为 6-20 位';
        }
        else {
            loginErrors.password = '';
        }
    }
    if (field === 'captchaInput') {
        if (!loginForm.captchaInput.trim()) {
            loginErrors.captchaInput = '请输入图形验证码';
        }
        else if (loginForm.captchaInput.trim().toUpperCase() !== captchaCode.value) {
            loginErrors.captchaInput = '图形验证码错误';
        }
        else {
            loginErrors.captchaInput = '';
        }
    }
};
const validateRegisterField = (field) => {
    if (field === 'username') {
        const value = registerForm.username.trim();
        if (!value) {
            registerErrors.username = '请输入用户名';
        }
        else if (value.length < 3 || value.length > 20) {
            registerErrors.username = '用户名长度需为 3-20 位';
        }
        else {
            registerErrors.username = '';
        }
    }
    if (field === 'password') {
        const value = registerForm.password;
        if (!value) {
            registerErrors.password = '请输入密码';
        }
        else if (value.length < 6 || value.length > 20) {
            registerErrors.password = '密码长度需为 6-20 位';
        }
        else {
            registerErrors.password = '';
        }
    }
    if (field === 'mobile') {
        const mobileReg = /^1[3-9]\d{9}$/;
        if (!registerForm.mobile.trim()) {
            registerErrors.mobile = '请输入手机号';
        }
        else if (!mobileReg.test(registerForm.mobile.trim())) {
            registerErrors.mobile = '手机号格式不正确';
        }
        else {
            registerErrors.mobile = '';
        }
    }
    if (field === 'code') {
        if (!registerForm.code.trim()) {
            registerErrors.code = '请输入短信验证码';
        }
        else {
            registerErrors.code = '';
        }
    }
};
const validateLogin = () => {
    validateLoginField('username');
    validateLoginField('password');
    validateLoginField('captchaInput');
    return !loginErrors.username && !loginErrors.password && !loginErrors.captchaInput;
};
const validateRegister = () => {
    validateRegisterField('username');
    validateRegisterField('password');
    validateRegisterField('mobile');
    validateRegisterField('code');
    return !registerErrors.username && !registerErrors.password && !registerErrors.mobile && !registerErrors.code;
};
const onLogin = async () => {
    if (!validateLogin()) {
        message.warning('请先修正表单错误');
        return;
    }
    loading.value = true;
    try {
        await authStore.login(loginForm.username.trim(), loginForm.password);
        message.success('登录成功');
        router.replace('/dashboard');
    }
    catch (error) {
        message.error(error.message || '登录失败');
        refreshCaptcha();
    }
    finally {
        loading.value = false;
    }
};
const onRegister = async () => {
    if (!validateRegister()) {
        message.warning('请先修正表单错误');
        return;
    }
    loading.value = true;
    try {
        await authStore.register({
            username: registerForm.username.trim(),
            password: registerForm.password,
            mobile: registerForm.mobile.trim(),
            code: registerForm.code.trim()
        });
        message.success('注册成功');
        router.replace('/dashboard');
    }
    catch (error) {
        message.error(error.message || '注册失败');
    }
    finally {
        loading.value = false;
    }
};
const sendCode = async () => {
    validateRegisterField('mobile');
    if (registerErrors.mobile) {
        message.warning(registerErrors.mobile);
        return;
    }
    try {
        const code = await authApi.sendCode(registerForm.mobile.trim());
        message.success(`验证码已发送（验证码：${code}）`);
        countdown.value = 60;
        timer = window.setInterval(() => {
            countdown.value -= 1;
            if (countdown.value <= 0 && timer) {
                clearInterval(timer);
                timer = null;
            }
        }, 1000);
    }
    catch (error) {
        message.error(error.message || '发送失败');
    }
};
const toggleMode = () => {
    mode.value = isLoginMode.value ? 'register' : 'login';
};
onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
});
createCaptcha();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['auth-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['form-header']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-form']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-form']} */ ;
/** @type {__VLS_StyleScopedClasses['captcha-box']} */ ;
/** @type {__VLS_StyleScopedClasses['captcha-box']} */ ;
/** @type {__VLS_StyleScopedClasses['captcha-box']} */ ;
/** @type {__VLS_StyleScopedClasses['switch-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['password-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "auth-wrap" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "auth-hero" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "auth-card glass-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
(__VLS_ctx.isLoginMode ? '欢迎回来' : '创建账号');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.isLoginMode ? '输入账号密码进入交易平台' : '填写信息完成注册并自动登录');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-body" },
});
if (__VLS_ctx.isLoginMode) {
    const __VLS_0 = {}.NForm;
    /** @type {[typeof __VLS_components.NForm, typeof __VLS_components.nForm, typeof __VLS_components.NForm, typeof __VLS_components.nForm, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        labelPlacement: "top",
        ...{ class: "custom-form" },
    }));
    const __VLS_2 = __VLS_1({
        labelPlacement: "top",
        ...{ class: "custom-form" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    const __VLS_4 = {}.NFormItem;
    /** @type {[typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        label: "用户名",
        validationStatus: (__VLS_ctx.loginErrors.username ? 'error' : undefined),
        feedback: (__VLS_ctx.loginErrors.username),
    }));
    const __VLS_6 = __VLS_5({
        label: "用户名",
        validationStatus: (__VLS_ctx.loginErrors.username ? 'error' : undefined),
        feedback: (__VLS_ctx.loginErrors.username),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.NInput;
    /** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.loginForm.username),
        placeholder: "请输入用户名",
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.loginForm.username),
        placeholder: "请输入用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onBlur: (...[$event]) => {
            if (!(__VLS_ctx.isLoginMode))
                return;
            __VLS_ctx.validateLoginField('username');
        }
    };
    var __VLS_11;
    var __VLS_7;
    const __VLS_16 = {}.NFormItem;
    /** @type {[typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        label: "密码",
        validationStatus: (__VLS_ctx.loginErrors.password ? 'error' : undefined),
        feedback: (__VLS_ctx.loginErrors.password),
    }));
    const __VLS_18 = __VLS_17({
        label: "密码",
        validationStatus: (__VLS_ctx.loginErrors.password ? 'error' : undefined),
        feedback: (__VLS_ctx.loginErrors.password),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    const __VLS_20 = {}.NInput;
    /** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.loginForm.password),
        type: (__VLS_ctx.showLoginPassword ? 'text' : 'password'),
        placeholder: "请输入密码",
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.loginForm.password),
        type: (__VLS_ctx.showLoginPassword ? 'text' : 'password'),
        placeholder: "请输入密码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onBlur: (...[$event]) => {
            if (!(__VLS_ctx.isLoginMode))
                return;
            __VLS_ctx.validateLoginField('password');
        }
    };
    __VLS_23.slots.default;
    {
        const { suffix: __VLS_thisSlot } = __VLS_23.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isLoginMode))
                        return;
                    __VLS_ctx.showLoginPassword = !__VLS_ctx.showLoginPassword;
                } },
            type: "button",
            ...{ class: "password-toggle" },
            title: (__VLS_ctx.showLoginPassword ? '隐藏密码' : '显示密码'),
        });
        if (__VLS_ctx.showLoginPassword) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                'stroke-width': "2",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
                x1: "1",
                y1: "1",
                x2: "23",
                y2: "23",
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                'stroke-width': "2",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
                cx: "12",
                cy: "12",
                r: "3",
            });
        }
    }
    var __VLS_23;
    var __VLS_19;
    const __VLS_28 = {}.NFormItem;
    /** @type {[typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        label: "图形验证码",
        validationStatus: (__VLS_ctx.loginErrors.captchaInput ? 'error' : undefined),
        feedback: (__VLS_ctx.loginErrors.captchaInput),
    }));
    const __VLS_30 = __VLS_29({
        label: "图形验证码",
        validationStatus: (__VLS_ctx.loginErrors.captchaInput ? 'error' : undefined),
        feedback: (__VLS_ctx.loginErrors.captchaInput),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "captcha-row" },
    });
    const __VLS_32 = {}.NInput;
    /** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.loginForm.captchaInput),
        placeholder: "请输入验证码",
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.loginForm.captchaInput),
        placeholder: "请输入验证码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_36;
    let __VLS_37;
    let __VLS_38;
    const __VLS_39 = {
        onBlur: (...[$event]) => {
            if (!(__VLS_ctx.isLoginMode))
                return;
            __VLS_ctx.validateLoginField('captchaInput');
        }
    };
    var __VLS_35;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.refreshCaptcha) },
        ...{ class: "captcha-box" },
        type: "button",
        title: "点击刷新验证码",
    });
    (__VLS_ctx.captchaCode);
    var __VLS_31;
    const __VLS_40 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        ...{ 'onClick': {} },
        type: "primary",
        block: true,
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClick': {} },
        type: "primary",
        block: true,
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_44;
    let __VLS_45;
    let __VLS_46;
    const __VLS_47 = {
        onClick: (__VLS_ctx.onLogin)
    };
    __VLS_43.slots.default;
    var __VLS_43;
    var __VLS_3;
}
else {
    const __VLS_48 = {}.NForm;
    /** @type {[typeof __VLS_components.NForm, typeof __VLS_components.nForm, typeof __VLS_components.NForm, typeof __VLS_components.nForm, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        labelPlacement: "top",
        ...{ class: "custom-form" },
    }));
    const __VLS_50 = __VLS_49({
        labelPlacement: "top",
        ...{ class: "custom-form" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    const __VLS_52 = {}.NFormItem;
    /** @type {[typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        label: "用户名",
        validationStatus: (__VLS_ctx.registerErrors.username ? 'error' : undefined),
        feedback: (__VLS_ctx.registerErrors.username),
    }));
    const __VLS_54 = __VLS_53({
        label: "用户名",
        validationStatus: (__VLS_ctx.registerErrors.username ? 'error' : undefined),
        feedback: (__VLS_ctx.registerErrors.username),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    const __VLS_56 = {}.NInput;
    /** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.registerForm.username),
        placeholder: "请输入用户名",
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.registerForm.username),
        placeholder: "请输入用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_60;
    let __VLS_61;
    let __VLS_62;
    const __VLS_63 = {
        onBlur: (...[$event]) => {
            if (!!(__VLS_ctx.isLoginMode))
                return;
            __VLS_ctx.validateRegisterField('username');
        }
    };
    var __VLS_59;
    var __VLS_55;
    const __VLS_64 = {}.NFormItem;
    /** @type {[typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        label: "密码",
        validationStatus: (__VLS_ctx.registerErrors.password ? 'error' : undefined),
        feedback: (__VLS_ctx.registerErrors.password),
    }));
    const __VLS_66 = __VLS_65({
        label: "密码",
        validationStatus: (__VLS_ctx.registerErrors.password ? 'error' : undefined),
        feedback: (__VLS_ctx.registerErrors.password),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    const __VLS_68 = {}.NInput;
    /** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.registerForm.password),
        type: (__VLS_ctx.showRegisterPassword ? 'text' : 'password'),
        placeholder: "请输入密码",
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.registerForm.password),
        type: (__VLS_ctx.showRegisterPassword ? 'text' : 'password'),
        placeholder: "请输入密码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_72;
    let __VLS_73;
    let __VLS_74;
    const __VLS_75 = {
        onBlur: (...[$event]) => {
            if (!!(__VLS_ctx.isLoginMode))
                return;
            __VLS_ctx.validateRegisterField('password');
        }
    };
    __VLS_71.slots.default;
    {
        const { suffix: __VLS_thisSlot } = __VLS_71.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.isLoginMode))
                        return;
                    __VLS_ctx.showRegisterPassword = !__VLS_ctx.showRegisterPassword;
                } },
            type: "button",
            ...{ class: "password-toggle" },
            title: (__VLS_ctx.showRegisterPassword ? '隐藏密码' : '显示密码'),
        });
        if (__VLS_ctx.showRegisterPassword) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                'stroke-width': "2",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
                x1: "1",
                y1: "1",
                x2: "23",
                y2: "23",
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                'stroke-width': "2",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
                cx: "12",
                cy: "12",
                r: "3",
            });
        }
    }
    var __VLS_71;
    var __VLS_67;
    const __VLS_76 = {}.NFormItem;
    /** @type {[typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "手机号",
        validationStatus: (__VLS_ctx.registerErrors.mobile ? 'error' : undefined),
        feedback: (__VLS_ctx.registerErrors.mobile),
    }));
    const __VLS_78 = __VLS_77({
        label: "手机号",
        validationStatus: (__VLS_ctx.registerErrors.mobile ? 'error' : undefined),
        feedback: (__VLS_ctx.registerErrors.mobile),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    const __VLS_80 = {}.NInput;
    /** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.registerForm.mobile),
        placeholder: "请输入手机号",
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.registerForm.mobile),
        placeholder: "请输入手机号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_84;
    let __VLS_85;
    let __VLS_86;
    const __VLS_87 = {
        onBlur: (...[$event]) => {
            if (!!(__VLS_ctx.isLoginMode))
                return;
            __VLS_ctx.validateRegisterField('mobile');
        }
    };
    var __VLS_83;
    var __VLS_79;
    const __VLS_88 = {}.NFormItem;
    /** @type {[typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, typeof __VLS_components.NFormItem, typeof __VLS_components.nFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        label: "验证码",
        validationStatus: (__VLS_ctx.registerErrors.code ? 'error' : undefined),
        feedback: (__VLS_ctx.registerErrors.code),
    }));
    const __VLS_90 = __VLS_89({
        label: "验证码",
        validationStatus: (__VLS_ctx.registerErrors.code ? 'error' : undefined),
        feedback: (__VLS_ctx.registerErrors.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "code-row" },
    });
    const __VLS_92 = {}.NInput;
    /** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.registerForm.code),
        placeholder: "请输入短信验证码",
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onBlur': {} },
        value: (__VLS_ctx.registerForm.code),
        placeholder: "请输入短信验证码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onBlur: (...[$event]) => {
            if (!!(__VLS_ctx.isLoginMode))
                return;
            __VLS_ctx.validateRegisterField('code');
        }
    };
    var __VLS_95;
    const __VLS_100 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.countdown > 0),
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.countdown > 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (__VLS_ctx.sendCode)
    };
    __VLS_103.slots.default;
    (__VLS_ctx.countdown > 0 ? `${__VLS_ctx.countdown}s` : '获取验证码');
    var __VLS_103;
    var __VLS_91;
    const __VLS_108 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        type: "primary",
        block: true,
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        type: "primary",
        block: true,
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (__VLS_ctx.onRegister)
    };
    __VLS_111.slots.default;
    var __VLS_111;
    var __VLS_51;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "switch-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.isLoginMode ? '没有账号？' : '已有账号？');
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleMode) },
    type: "button",
    ...{ class: "switch-btn" },
});
(__VLS_ctx.isLoginMode ? '去注册' : '去登录');
/** @type {__VLS_StyleScopedClasses['auth-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-card']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['form-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-body']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-form']} */ ;
/** @type {__VLS_StyleScopedClasses['password-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['captcha-row']} */ ;
/** @type {__VLS_StyleScopedClasses['captcha-box']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-form']} */ ;
/** @type {__VLS_StyleScopedClasses['password-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['code-row']} */ ;
/** @type {__VLS_StyleScopedClasses['switch-row']} */ ;
/** @type {__VLS_StyleScopedClasses['switch-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NForm: NForm,
            NFormItem: NFormItem,
            NInput: NInput,
            loading: loading,
            countdown: countdown,
            captchaCode: captchaCode,
            showLoginPassword: showLoginPassword,
            showRegisterPassword: showRegisterPassword,
            isLoginMode: isLoginMode,
            loginForm: loginForm,
            registerForm: registerForm,
            loginErrors: loginErrors,
            registerErrors: registerErrors,
            refreshCaptcha: refreshCaptcha,
            validateLoginField: validateLoginField,
            validateRegisterField: validateRegisterField,
            onLogin: onLogin,
            onRegister: onRegister,
            sendCode: sendCode,
            toggleMode: toggleMode,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
