# Buff Frontend

基于 `Vue3 + Vite + Naive UI` 的 Buff 交易前端，已按后端工程 `D:\WorkSpace\Projects\Buff` 的真实接口完成联调代码。

## 技术栈

- Vue 3 + TypeScript + Vite
- Naive UI
- Pinia
- Vue Router
- Axios

## 已对接接口

- 认证：`/auth/login` `/auth/register` `/auth/code` `/auth/refresh` `/auth/logout`
- 用户：`/user/current` `/user/bind-steam`
- 库存：`/inventory/my` `/inventory/statistics`
- 市场：`/market/listings` `/market/my-listings` `/market/list` `/market/list/{id}`
- 订单：`/order/create` `/order/{id}/pay` `/order/{id}/deliver` `/order/{id}/confirm` `/order/{id}/cancel` `/order/my-buy-orders` `/order/my-sell-orders`
- 钱包：`/wallet/balance` `/wallet/recharge` `/wallet/withdraw` `/wallet/logs`

## 启动步骤

1. 先启动后端工程（默认 `http://localhost:8080/api`）。
2. 前端安装依赖：

```bash
npm install
```

3. 启动前端：

```bash
npm run dev
```

4. 浏览器访问：

- `http://localhost:5173`

## 环境变量

复制 `.env.example` 为 `.env`（可选）：

```bash
VITE_API_BASE=/api
```

默认通过 Vite 代理把 `/api` 转发到 `http://localhost:8080`。

## 页面说明

- 登录/注册（含验证码发送）
- 仪表盘总览（余额、库存统计、市场热卖）
- 市场页（筛选、购买、上架、下架）
- 库存页（分页筛选）
- 订单页（买单/卖单状态流转）
- 钱包页（充值、提现、流水）

## 设计说明

- 简约现代风格，彩色渐变背景
- 分层阴影与毛玻璃卡片
- 卡片 hover 动效
- 响应式布局，兼容移动端与 Web 端
