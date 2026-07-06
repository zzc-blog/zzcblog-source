---
title: 使用Cloudflare部署Hexo个人博客
date: 2026-07-06 13:20:30
categories:
tags: [Cloudflare, Hexo]
---

## 1. 使用 Cloudflare 托管域名

![image-20260706132419924](https://hexo-1304867193.cos.ap-guangzhou.myqcloud.com/images/99520f82499ff60dba1fd288308c7171.png)

## 2. 使用 Pages

新版没有 pages 选项

![image-20260706132536006](https://hexo-1304867193.cos.ap-guangzhou.myqcloud.com/images/a200f4d32736cec196b29e18d61178b3.png)

先使用工具 在cloudflare 创建一个pages

**Wrangler CLI**

你本地 `hexo g`完，`public/`就是现成的静态文件，不用连 Git，CLI 一条命令推上去。

```bash
# 1. 装 wrangler（Node 16+）
npm i -g wrangler

# 2. 登录 CF 账号（会弹浏览器授权）
wrangler login

# 3. 进 Hexo 根目录，推 public/
npx wrangler pages deploy ./public --project-name=你的项目名
```

**然后控制台里把项目建起来**

1. **Workers & Pages → 创建 → Pages → Connect to Git**
2. 授权 GitHub，选你博客源码仓库（比如 `zhangzhicai.github.io`那个，或者单独一个 `blog-src`仓）
3. **Framework preset** 下拉里**没有 Hexo**，直接选 **None / 无**
4. 填三项关键配置：

| 项             | 填什么          | 说明                       |
| -------------- | --------------- | -------------------------- |
| Build command  | `hexo generate` | 或 `npx hexo generate`更稳 |
| Build output   | `public`        | Hexo 默认输出目录          |
| Root directory | `/`             | 源码在根目录就默认         |

***注： Build command 第一次先使用 npm i -g pnpm && pnpm install 安装依赖***

5. **Environment variables** 加一条（可选但建议）：

- `NODE_VERSION`= `20`（或 18，Hexo 3.x/4.x 都能跑，LTS 稳）
- `NODE_ENV`= `production`

6. **保存并部署**，第一次会跑一遍，成功就给 `xxx.pages.dev`域名。



**源码仓库要满足的条件**

CF Pages 拿到源码后会做：`npm ci`→ `hexo generate`→ 把 `public/`挂 CDN。所以仓库里：

- ✅ `package.json`+ `package-lock.json`必须提交（CF 靠这个装依赖）
- ✅ `.gitignore`里 `node_modules/`正常忽略就行，**不要 ignore `package-lock.json`**
- ✅ Hexo 核心包要在 `package.json`的 `dependencies`里（不是 `devDependencies`也没事，CF build 环境全装）：

其中：pnpm 使用 `pnpm-lock.yaml`,npm 使用 `package-lock.json`



**CF Pages 工作流**

```txt
git add . && git commit -m "new post" && git push
        ↓ CF Pages webhook 触发
        ↓ npm ci && hexo generate
        ↓ 部署 public/ 到 *.pages.dev
```

**核心区别**

| 特性             | `npm install`                                                | `npm ci`                                   |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------ |
| **用途**         | 日常开发、添加/更新依赖                                      | CI/CD、自动化部署、确保环境一致            |
| **依赖来源**     | 读取 `package.json`版本范围，可能更新 `package-lock.json`    | **严格读取 `package-lock.json`**，版本锁死 |
| **node_modules** | 增量更新，已有包不重装                                       | **先删后装**，保证纯净                     |
| **速度**         | 慢（需解析版本、计算树）                                     | 快（直接按 lock 文件布局）                 |
| **失败条件**     | `package-lock.json`缺失或与 `package.json`不一致时，自动补全或更新 | **直接报错退出**，保证环境一致             |
| **副作用**       | 可能修改 `package-lock.json`                                 | **绝不修改**任何文件                       |

**自定义域名**

部署成功之后会有一个默认域名，也可以自定义域名，自定义的域名必须托管在CF里面

![image-20260706134235049](https://hexo-1304867193.cos.ap-guangzhou.myqcloud.com/images/8e633808a7b5fd2e36b7be20bad5318e.png)

