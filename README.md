# 财运体质测试网站

一个纯前端实现的趣味测评工具：前端部署在 GitHub Pages，后端使用 Supabase（密钥验证 + 次数管理），配合发卡平台实现自动发货。

## 功能特性

- ✅ 密钥验证（Supabase 原子扣减，每个密钥可测 3 次）
- ✅ 批量生成密钥（CSV 导入发卡平台 + SQL 导入数据库）
- ✅ 18 题财运体质测评，支持返回上一题修改答案
- ✅ 6 大维度雷达图 + 综合财运指数环形图
- ✅ 7 种财运体质结果分析 + 财运提升指南 + 开运锦囊
- ✅ 一键生成长图并下载保存
- ✅ 复制结果链接分享（带参数回显）
- ✅ 再测一次 / 问题反馈（弹窗）
- ✅ 移动端响应式适配

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 页面结构与主入口 |
| `styles.css` | 样式与移动端适配 |
| `app.js` | 测评逻辑、计分、结果生成、图片导出、密钥验证 |
| `supabase-config.js` | Supabase 项目配置（URL + anon key） |
| `supabase/schema.sql` | 数据库初始化脚本（cards 表 + use_card 函数） |
| `tools/generate-cards.js` | 批量生成密钥脚本 |
| `tools/cards.csv` | 生成的密钥列表（导入发卡平台） |
| `tools/cards.sql` | 生成的密钥 INSERT 语句（导入 Supabase） |

## 商业闭环流程

```
卖家: node tools/generate-cards.js 200
  ├─ tools/cards.csv → 上传到发卡平台（买家付款自动发一个密钥）
  └─ tools/cards.sql → 在 Supabase SQL Editor 执行导入

买家: 发卡平台付款 → 收到密钥（如 CF-PY4C-7YV4-QZBE）
  └─ 打开网站 → 输入密钥 → 开始测试（每个密钥3次）
```

## 部署步骤

### 1. Supabase（后端 + 数据库）

1. 注册/登录 [supabase.com](https://supabase.com)，创建新项目（免费版即可）
2. 在 SQL Editor 中执行 `supabase/schema.sql`
3. 生成密钥并导入：`node tools/generate-cards.js 100`，再在 SQL Editor 执行 `tools/cards.sql`
4. 在 Settings → API 页面复制 **Project URL** 和 **anon public key**
5. 填入 `supabase-config.js` 的 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`

### 2. GitHub Pages（前端）

```bash
git init && git add . && git commit -m "财运体质测试网站"
gh repo create fortune-test --public --source=. --push
gh api repos/{owner}/fortune-test/pages -X POST -f "source[branch]=main" -f "source[path]=/"
```

访问：`https://<你的GitHub用户名>.github.io/fortune-test/`

### 3. 发卡平台（自动发货）

1. 注册任意发卡平台（如鲸发卡、独角数卡等）
2. 创建商品，上传 `tools/cards.csv` 作为卡密库存
3. 买家付款后平台自动发放一个密钥

## 本地运行

```bash
cd 财运体质测试网站
python -m http.server 8080
# 浏览器访问 http://127.0.0.1:8080
```

> Supabase 未配置时自动降级为本地 localStorage 计数模式，方便本地开发调试。

## 技术依赖（CDN，无需本地安装）

- Tailwind CSS：响应式样式
- Supabase JS：密钥验证（RPC 调用 `use_card` 函数）
- html2canvas：结果页转图片
- Chart.js：雷达图 + 环形图

## 安全说明

- 数据库开启 RLS，前端匿名用户无法直接读写 `cards` 表
- 密钥验证通过 `use_card` 安全定义函数原子扣减，防止并发超用
- anon key 暴露在前端是 Supabase 的设计（受 RLS 保护），如需更高安全性可升级为 Edge Function

## 注意事项

- 本测评仅供娱乐参考，不构成投资建议。
- 密钥格式：`CF-XXXX-XXXX-XXXX`（排除易混淆字符 0/O/1/I/L）。
