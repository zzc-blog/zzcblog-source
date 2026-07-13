---
title: 《从零到一：我用 Hexo + GitHub Pages 搭了一个博客》
categories:
  - 其他
tags:
  - Hexo
  - GitHub
abbrlink: fc67d995
date: 2026-07-06 11:30:24
---

## 1. 安装 Hexo

### 1.1 什么是 Hexo？

Hexo 是一个快速、简洁且高效的博客框架。 Hexo 使用 [Markdown](http://daringfireball.net/projects/markdown/)（或其他标记语言）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

### 1.2 要求

安装 Hexo 相当简单，只需要先安装下列应用程序即可：

- [Node.js](http://nodejs.org/) (Node.js 版本需不低于 10.13，建议使用 Node.js 12.0 及以上版本)
- [Git](http://git-scm.com/)

### 1.3 安装 Hexo

所有必备的应用程序安装完成后，即可使用 npm 安装 Hexo。

```bash
npm install -g hexo-cli
```

安装以后，可以使用以下两种方式执行 Hexo：

1. `npx hexo <command>`
2. Linux 用户可以将 Hexo 所在的目录下的 `node_modules` 添加到环境变量之中即可直接使用 `hexo <command>`：

```bash
echo 'PATH="$PATH:./node_modules/.bin"' >> ~/.profile
```

### 1.4 Node.js 版本限制

| Hexo 版本   | 最低版本 (Node.js 版本) | 最高版本 (Node.js 版本) |
| :---------- | :---------------------- | :---------------------- |
| 8.0+        | 20.19.0                 | latest                  |
| 7.0+        | 14.0.0                  | latest                  |
| 6.2+        | 12.13.0                 | latest                  |
| 6.0+        | 12.13.0                 | 18.5.0                  |
| 5.0+        | 10.13.0                 | 12.0.0                  |
| 4.1 - 4.2   | 8.10                    | 10.0.0                  |
| 4.0         | 8.6                     | 8.10.0                  |
| 3.3 - 3.9   | 6.9                     | 8.0.0                   |
| 3.2 - 3.3   | 0.12                    | 未知                    |
| 3.0 - 3.1   | 0.10 或 iojs            | 未知                    |
| 0.0.1 - 2.8 | 0.10                    | 未知                    |

安装 Hexo 完成后，请执行下列命令，Hexo 将会在指定文件夹中新建所需要的文件。

```bash
hexo init <folder>
cd <folder>
pnpm install
```

初始化后，您的项目文件夹将如下所示：

![image-20260706114155246](https://img-proxy.zzc.dpdns.org/images/521559cf8f478195220a2daa3879f04b.png)

### 1.5 配置 _config.yml

网站的 [配置](https://hexo.io/zh-cn/docs/configuration) 文件。 您可以在此配置大部分的参数。

具体配置查看 [官网_config.yml](https://hexo.io/zh-cn/docs/configuration#)

```json
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title: zzc-blog
subtitle: ''
description: ''
keywords:
author: zzc-blog
language: zh-CN
timezone: Asia/Shanghai

# URL
## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'

permalink: posts/:abbrlink/
abbrlink:
  alg: crc32
  rep: hex
permalink_defaults:
pretty_urls:
  trailing_index: true
  trailing_html: true

#permalink: :year/:month/:day/:title/
#permalink_defaults:
#pretty_urls:
  #trailing_index: true
  #trailing_html: true

# Directory
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang


# Writing
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link:
  enable: true # Open external links in new tab
  field: site # Apply to the whole site
  exclude: ''
filename_case: 0
render_drafts: false
post_asset_folder: false
relative_link: false
future: true
syntax_highlighter: highlight.js
highlight:
  line_number: true
  auto_detect: false
  tab_replace: ''
  wrap: true
  hljs: false
prismjs:
  preprocess: true
  line_number: true
  tab_replace: ''

# Home page setting
# path: Root path for your blogs index page. (default = '')
# per_page: Posts displayed per page. (0 = disable pagination)
# order_by: Posts order. (Order by date descending by default)
index_generator:
  path: ''
  per_page: 10
  order_by: -date

# Category & Tag
default_category: uncategorized
category_map:
tag_map:

# Metadata elements
## https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
meta_generator: true

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss
## updated_option supports 'mtime', 'date', 'empty'
updated_option: 'mtime'

# Pagination
## Set per_page to 0 to disable pagination
per_page: 10
pagination_dir: page

# Include / Exclude file(s)
## include:/exclude: options only apply to the 'source/' folder
include:
exclude:
ignore:

# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
#theme: landscape
theme: butterfly


# Feed
feed:
  type: atom
  path: atom.xml
  limit: 20
  hub:
  content: true
  content_limit: 140
  content_limit_delim: ' '
  order_by: -date
  icon: /img/favicon.webp

# Deployment
## Docs: https://hexo.io/docs/one-command-deployment

url: https://blog.zzc.dpdns.org

skip_render:
  - 'CNAME'
  
  
# https://github.com/RayKr/hexo-auto-front-matter
auto_front_matter:
  enable: true

  # 控制 front-matter 字段的显示顺序（可选）
  # 留空则保持原文件中字段的先后顺序
  order:
    - title
    - date
    - categories
    - tags
    - cover
    - description

  # ---- 自动标题 ----
  auto_title:
    enable: true
    mode: 1   # 1=仅当 title 为空时自动填入；2=始终覆盖

  # ---- 自动日期 ----
  auto_date:
    enable: true

  # ---- 自动分类 ----
  # 逻辑同 hexo-auto-category，从文章所在文件夹路径推断分类
  auto_categories:
    enable: false
    multiple: false   # false=将文件夹路径作为单级分类；true=每层文件夹作为一个分类层级
    depth:            # 不填则取全部文件夹层级；填数字则只取前 N 层

  # ---- 自动标签 ----
  # 当 tags 字段为空时，自动把 categories 的内容复制到 tags
  auto_tags:
    enable: true

  # ---- 自动封面 ----
  # 根据最深层的分类名称匹配封面图片路径
  auto_cover:
    enable: true
    per_category:
      # 格式：父分类: { 子分类: 图片路径 }
      技术:
        Java: https://img-proxy.zzc.dpdns.org/images/cover/1.webp
        数据库: https://img-proxy.zzc.dpdns.org/images/cover/5.webp
        前端: https://img-proxy.zzc.dpdns.org/images/cover/25.webp
        工具: https://img-proxy.zzc.dpdns.org/images/cover/1.webp
        其他: https://img-proxy.zzc.dpdns.org/images/cover/6.webp
      生活:
        随笔: https://img-proxy.zzc.dpdns.org/images/cover/24.webp
        阅读: https://img-proxy.zzc.dpdns.org/images/cover/27.webp
```

**package.json**

应用程序的信息。 [EJS](https://ejs.co/), [Stylus](http://learnboost.github.io/stylus/) 和 [Markdown](http://daringfireball.net/projects/markdown/) 渲染引擎 已默认安装，您可以自由移除。 如果您想，可以稍后卸载它们。

```json
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server"
  },
  "hexo": {
    "version": ""
  },
  "dependencies": {
    "hexo": "^7.0.0",
    "hexo-generator-archive": "^2.0.0",
    "hexo-generator-category": "^2.0.0",
    "hexo-generator-index": "^3.0.0",
    "hexo-generator-tag": "^2.0.0",
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-marked": "^6.0.0",
    "hexo-renderer-stylus": "^3.0.0",
    "hexo-server": "^3.0.0",
    "hexo-theme-landscape": "^1.0.0"
  }
}
```

个人博客需要依赖

```json
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server"
  },
  "hexo": {
    "version": "8.1.2"
  },
  "dependencies": {
    "hexo": "^8.0.0",
    "hexo-abbrlink": "^2.2.1",
    "hexo-deployer-git": "^4.0.0",
    "hexo-generator-archive": "^2.0.0",
    "hexo-generator-category": "^2.0.0",
    "hexo-generator-cname": "^0.3.0",
    "hexo-generator-feed": "^4.0.0",
    "hexo-generator-index": "^4.0.0",
    "hexo-generator-search": "^2.4.3",
    "hexo-generator-tag": "^2.0.0",
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-marked": "^7.0.0",
    "hexo-renderer-pug": "^3.0.0",
    "hexo-renderer-stylus": "^3.0.1",
    "hexo-server": "^3.0.0",
    "hexo-theme-landscape": "^1.0.0",
    "hexo-util": "^4.0.0",
    "hexo-wordcount": "^6.0.1",
    "moment-timezone": "^0.6.2"
  },
  "devDependencies": {
    "hexo-auto-front-matter": "^0.1.3"
  }
}
```

**scaffolds**

[模版](https://hexo.io/zh-cn/docs/writing#模版（Scaffold）) 文件夹。 当您新建文章时，Hexo 会根据 scaffold 来创建文件。

**source**

资源文件夹。 是存放用户资源的地方。 除 `_posts` 文件夹之外，开头命名为 `_` (下划线)的文件 / 文件夹和隐藏的文件将会被忽略。 Markdown 和 HTML 文件会被解析并放到 `public` 文件夹，而其他文件会被拷贝过去。

**themes**

[主题](https://hexo.io/zh-cn/docs/themes) 文件夹。 Hexo 会根据主题来生成静态页面。

这里使用 `butterfly` 主题

![image-20260706114959529](https://img-proxy.zzc.dpdns.org/images/fed349aca3bae88cc34806b94b5f0dc4.png)

其中

![image-20260706115108881](https://img-proxy.zzc.dpdns.org/images/b84a2403bf8da0a20b1e1f1c51504f82.png)

_config.butterfly.yml 为 butterfly 主题配置文件

```json
# Butterfly 主题配置文件
# 文档: https://butterfly.js.org/

# ============================================================
# 导航栏 Navigation
# ============================================================
nav:
  logo:
  display_title: true
  display_post_title: true
  fixed: true

menu:
  首页: / || fas fa-home
  归档: /archives/ || fas fa-archive
  标签: /tags/ || fas fa-tags
  分类: /categories/ || fas fa-folder-open
  图库: /gallery/ || fas fa-images
  关于||fas fa-heart:
    关于本站: /about/ || fas fa-info-circle

# ============================================================
# 代码块 Code Blocks
# ============================================================
code_blocks:
  theme: darker
  macStyle: true
  height_limit: false
  word_wrap: false
  copy: true
  language: true
  shrink: false
  fullpage: true

# ============================================================
# 社交链接 Social
# ============================================================
social:
  fab fa-github: https://github.com/zzc-blog || Github || '#24292e'

# ============================================================
# 图片 Image
# ============================================================
favicon: /img/favicon.webp

avatar:
  img: /img/avarte.webp
  effect: true

disable_top_img: false
default_top_img: https://img-proxy.zzc.dpdns.org/images/cover/1.webp
index_img: https://img-proxy.zzc.dpdns.org/images/cover/2.webp
archive_img: https://img-proxy.zzc.dpdns.org/images/cover/3.webp
tag_img: https://img-proxy.zzc.dpdns.org/images/cover/4.webp
category_img: https://img-proxy.zzc.dpdns.org/images/cover/5.webp

footer_img: /img/footer-bg.svg
background: https://img-proxy.zzc.dpdns.org/images/cover/6.webp

cover:
  index_enable: true
  aside_enable: true
  archives_enable: true
  default_cover:
    - https://img-proxy.zzc.dpdns.org/images/cover/1.webp
    - https://img-proxy.zzc.dpdns.org/images/cover/2.webp
    - https://img-proxy.zzc.dpdns.org/images/cover/3.webp
    - https://img-proxy.zzc.dpdns.org/images/cover/4.webp
    - https://img-proxy.zzc.dpdns.org/images/cover/5.webp
    - https://img-proxy.zzc.dpdns.org/images/cover/6.webp
    - https://img-proxy.zzc.dpdns.org/images/cover/7.webp
    - https://img-proxy.zzc.dpdns.org/images/cover/8.webp
    - https://img-proxy.zzc.dpdns.org/images/cover/9.webp
    - https://img-proxy.zzc.dpdns.org/images/cover/10.webp

error_img:
  flink: /img/error-page.svg
  post_page: /img/default_top_img.svg

error_404:
  enable: true
  subtitle: '页面没有找到...'
  background: https://img-proxy.zzc.dpdns.org/images/cover/7.webp

# ============================================================
# 文章元数据 Post Meta
# ============================================================
post_meta:
  page:
    date_type: created
    date_format: date
    categories: true
    tags: false
    label: true
  post:
    position: center
    date_type: both
    date_format: date
    categories: true
    tags: true
    label: true

# ============================================================
# 首页设置 Index Page
# ============================================================
index_site_info_top:
index_top_img_height:

subtitle:
  enable: true
  effect: true
  typed_option:
  source: 1
  sub:
    - 记录技术成长，分享编程心得
    - 专注 Java 后端开发
    - 路漫漫其修远兮，吾将上下而求索

index_layout: 3

index_post_content:
  method: 2
  length: 500

# ============================================================
# 文章设置 Post Settings
# ============================================================
toc:
  post: true
  page: false
  number: false
  expand: false
  style_simple: false
  scroll_percent: true

post_copyright:
  enable: true
  decode: false
  author_href:
  license: CC BY-NC-SA 4.0
  license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/

reward:
  enable: false
  text:
  QR_code:

post_edit:
  enable: false
  url:

related_post:
  enable: true
  limit: 6
  date_type: created

post_pagination: 1

noticeOutdate:
  enable: true
  style: flat
  limit_day: 365
  position: top
  message_prev: 本文最后更新于
  message_next: 天前，部分内容可能已过时，请注意辨别。

# ============================================================
# 页脚 Footer
# ============================================================
footer:
  nav:
  owner:
    enable: true
    since: 2025
  copyright:
    enable: true
    version: true
  custom_text: '<i class="fas fa-heart" style="color: #FF7242"></i> 保持热爱，奔赴山海'

# ============================================================
# 侧边栏 Aside（仿官方站风格）
# ============================================================
aside:
  enable: true
  hide: false
  button: true
  mobile: true
  position: right
  display:
    archive: true
    tag: true
    category: true
  card_author:
    enable: true
    description: 一个热爱编程的后端开发者
    button:
      enable: true
      icon: fab fa-github
      text: Follow Me
      link: https://github.com/zzc-blog
  card_announcement:
    enable: true
    content: 欢迎来到我的博客！这里主要分享技术和生活。
  card_recent_post:
    enable: true
    limit: 5
    sort: date
    sort_order:
  card_newest_comments:
    enable: false
    sort_order:
    limit: 6
    storage: 10
    avatar: true
  card_categories:
    enable: true
    limit: 8
    expand: none
    sort_order:
  card_tags:
    enable: true
    limit: 40
    color: false
    custom_colors:
    orderby: random
    order: 1
    sort_order:
  card_archives:
    enable: true
    type: monthly
    format: MMMM YYYY
    order: -1
    limit: 8
    sort_order:
  card_webinfo:
    enable: true
    post_count: true
    last_push_date: true
    sort_order:
    runtime_date: 2026/05/20 00:00:00

# ============================================================
# 右下角按钮 Right Side
# ============================================================
rightside_bottom:
translate:
  enable: true
  default: 繁
  defaultEncoding: 2
  translateDelay: 0
  msgToTraditionalChinese: '繁'
  msgToSimplifiedChinese: '简'

readmode: true

darkmode:
  enable: true
  button: true
  autoChangeMode: 1
  start:
  end:

rightside_scroll_percent: true

rightside_item_order:
  enable: false
  hide:
  show:

rightside_config_animation: true

# ============================================================
# 全局设置 Global
# ============================================================
anchor:
  auto_update: true
  click_to_scroll: false

photofigcaption: false

copy:
  enable: true
  copyright:
    enable: true
    limit_count: 150

wordcount:
  enable: true
  post_wordcount: true
  min2read: true
  total_wordcount: true

busuanzi:
  site_uv: true
  site_pv: true
  page_pv: true

# ============================================================
# 数学公式 Math
# ============================================================
math:
  use: katex
  per_page: true
  hide_scrollbar: false
  mathjax:
    enableMenu: true
    tags: none
  katex:
    copy_tex: false

# ============================================================
# 搜索 Search
# ============================================================
search:
  use: local_search
  placeholder: 搜索文章...
  algolia_search:
    hitsPerPage: 6
  local_search:
    preload: true
    top_n_per_article: 1
    unescape: true
    pagination:
      enable: true
      hitsPerPage: 8
    CDN:
  docsearch:
    appId:
    apiKey:
    indexName:
    option:

# ============================================================
# 分享 Share
# ============================================================
share:
  use: sharejs
  sharejs:
    sites: wechat,weibo,qq,qzone
  addtoany:
    item: wechat,sina_weibo,facebook_messenger,email,copy_link

# ============================================================
# 评论区 Comments（暂不启用）
# ============================================================
comments:
  use:
  text: true
  lazyload: false
  count: false
  card_post_count: false

# ============================================================
# 美化 / 特效 Beautify / Effect
# ============================================================
theme_color:
  enable: true
  main: '#49B1F5'
  paginator: '#00c4b6'
  button_hover: '#FF7242'
  text_selection: '#00c4b6'
  link_color: '#99a9bf'
  meta_color: '#858585'
  hr_color: '#A4D8FA'
  code_foreground: '#F47466'
  code_background: 'rgba(27, 31, 35, .05)'
  toc_color: '#00c4b6'
  blockquote_padding_color: '#49b1f5'
  blockquote_background_color: '#49b1f5'
  scrollbar_color: '#49b1f5'
  meta_theme_color_light: 'ffffff'
  meta_theme_color_dark: '#0d0d0d'

category_ui: index
tag_ui: index

rounded_corners_ui: true
text_align_justify: false

mask:
  header: true
  footer: false

preloader:
  enable: true
  source: 1
  pace_css_url:

enter_transitions: true
display_mode: light

beautify:
  enable: true
  field: post
  title_prefix_icon: '\f0c1'
  title_prefix_icon_color: '#F47466'

font:
  global_font_size:
  code_font_size:
  font_family:
  code_font_family:

blog_title_font:
  font_link:
  font_family:

hr_icon:
  enable: true
  icon:
  icon_top:

activate_power_mode:
  enable: false
  colorful: true
  shake: true
  mobile: false

canvas_ribbon:
  enable: false
  size: 150
  alpha: 0.6
  zIndex: -1
  click_to_change: false
  mobile: false

canvas_fluttering_ribbon:
  enable: false
  mobile: false

canvas_nest:
  enable: true
  color: '0,0,255'
  opacity: 0.5
  zIndex: -1
  count: 99
  mobile: false

fireworks:
  enable: false
  zIndex: 9999
  mobile: false

click_heart:
  enable: true
  mobile: false

clickShowText:
  enable: false
  text:
  fontSize: 15px
  random: false
  mobile: false

# ============================================================
# 灯箱 Lightbox
# ============================================================
lightbox: fancybox

# ============================================================
# 标签插件 Tag Plugins
# ============================================================
series:
  enable: true
  orderBy: 'date'
  order: -1
  number: true

abcjs:
  enable: false
  per_page: true

mermaid:
  enable: true
  code_write: false
  theme:
    light: default
    dark: dark
  open_in_new_tab: true
  zoom_pan: true

chartjs:
  enable: false
  fontColor:
    light: 'rgba(0, 0, 0, 0.8)'
    dark: 'rgba(255, 255, 255, 0.8)'
  borderColor:
    light: 'rgba(0, 0, 0, 0.1)'
    dark: 'rgba(255, 255, 255, 0.2)'
  scale_ticks_backdropColor:
    light: 'transparent'
    dark: 'transparent'

note:
  style: flat
  icons: true
  border_radius: 3
  light_bg_offset: 0

# ============================================================
# 其他设置 Other
# ============================================================
pjax:
  enable: true
  exclude:

aplayerInject:
  enable: false
  per_page: true

snackbar:
  enable: true
  position: bottom-left
  bg_light: '#49b1f5'
  bg_dark: '#1f1f1f'

instantpage: true

lazyload:
  enable: true
  native: false
  field: site
  placeholder:
  blur: false

pwa:
  enable: false
  manifest:
  apple_touch_icon:
  favicon_32_32:
  favicon_16_16:
  mask_icon:

Open_Graph_meta:
  enable: true
  option:

structured_data:
  enable: true
  alternate_name:

css_prefix: true

# ============================================================
# 注入代码 Inject
# ============================================================
inject:
  head:
    - <style>#footer,#footer a,#footer .copyright,#footer .framework-info,#footer .footer_custom_text{color:#555}#footer a:hover{color:#49B1F5}</style>
  bottom:

# ============================================================
# CDN 设置
# ============================================================
CDN:
  internal_provider: local
  third_party_provider: jsdelivr
  version: true
  custom_format:
  option:

```

[命令](https://hexo.io/zh-cn/docs/commands)

### 1.6 基本使用

**初始化项目**

```bash
hexo init 文件夹  
```

**清理 `public`**

```bash
hexo clean
```

**生成 `public`**

```bash
hexo g
```

**运行** 

```bash
hexo s
```

**使用 `hexo-deployer-git` 提交到 `github`**

```bash
hexo d
```

**必须配置**

```json
deploy:
  type: git
  repo: git@github.com:zzc-blog/zzc-blog.github.io.git
  branch: gh-pages
  message: 'Site updated: {{ now("yyyy-MM-dd HH:mm:ss") }}' 
```

`注意: 在 github 新建一个仓库，名字必须为 用户名.github.io`

**新建文章**

```bash
hexo new 文件名
```

## 3. 配置 GitHub Pages

**GitHub Pages 工作流**

```txt
hexo g
hexo d  → 推到 gh-pages 分支 → GitHub Pages 托管
```

### 3.1 新建仓库 

用户名.github.io

配置 自定义域名

![image-20260706124136258](https://img-proxy.zzc.dpdns.org/images/e7f948ec869a9e3d19d232f117e1053e.png)

以上部分都要设置，建议新建一个分支 gh-pages

设置自定义域名之后，会自动新建一个 **CNAME** 文件

![image-20260706124331521](https://img-proxy.zzc.dpdns.org/images/8392ad3edeae12d62159855c9956db76.png)

问题点：hexo g && hexo d 每次都会删除 public 文件夹，重新上传，并重新推送到 github，导致 CNAME 文件删除

解决方法： 在 source 目录下新建一个 CNAME 文件，每次 hexo g 会自动添加到 public 文件夹里，hexo d 会上传这个文件，CNAME 就不会被删除，github 就不会每次提交都会重新设置自定义域名

![image-20260706124857676](https://img-proxy.zzc.dpdns.org/images/d3409ea739a2d9b6542a69f03c685e84.png)

上传之后 github 自动部署

![image-20260706124946691](https://img-proxy.zzc.dpdns.org/images/26341aa5d9f6be0ff9cb4534d9d70ae3.png)

然后就可以用自定义域名访问了

https://zzcblog.ccwu.cc/

### 3.2 图片的处理

**github 限制清单**

| 项目                                      | 限制                                          | 说明                                |
| ----------------------------------------- | --------------------------------------------- | ----------------------------------- |
| **单文件硬上限（不走 LFS）**              | **100 MB**，超了直接拒                        | 50 MB 以上给 warning 还能传         |
| **单文件硬上限（走 LFS）**                | Free/Pro **2 GB**，Team 4 GB，Enterprise 5 GB |                                     |
| **仓库推荐大小**                          | **< 1 GB**，官方 "强烈建议 < 5 GB"             | 超了 clone 慢，support 可能来找你聊 |
| **浏览器上传**                            | ≤ 25 MB                                       | 网页拖拽的上限比 git push 严        |
| **GitHub Free LFS 免费额度（2026 当前）** | **10 GiB 存储 + 10 GiB/月带宽**               | 老文章写的 1GB 是旧口径，已涨       |

> 💡 10 GiB 存储 + 10 GiB 月带宽对个人博客图床其实够用了——博客插图单张通常 200KB~2MB，10 GiB 能塞几千张。但要注意：**带宽按月重置，超了当月 LFS 就被禁用**，读者刷你图刷超了会 403。

虽然可以存储图片，但是在用 typora 写文章时，需要插入图片，需要在本地存储图片，很麻烦

鉴于 这种情况，hexo 不会自动将 ./${filename}.assets 文件夹下的图片自动复制到 public 下

![image-20260706125801883](https://img-proxy.zzc.dpdns.org/images/d3c126cb9ce195ad6ac70738ace78eaf.png)

解决方法：编写一个 hexo 的 脚本 `fix-asset-paths.js` ，转换图片地址，才能正常访问，改脚本在 hexo g 时会被执行

```js
/**
 * Typora .assets 图片兼容脚本
 */

const fs = require('fs');
const path = require('path');

/** 转义正则中的特殊字符 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==== ==== ==== ==== ==== ==== ====
// 1. 将 .assets 图片注册为 Hexo 生成文件
// ==== ==== ==== ==== ==== ==== ====
hexo.extend.generator.register('typora_assets', function (locals) {
  const sourcePostsDir = path.join(hexo.source_dir, '_posts');
  const result = [];

  locals.posts.each(function (post) {
    const slug = post.slug;
    const assetsDir = path.join(sourcePostsDir, slug + '.assets');
    if (!fs.existsSync(assetsDir)) return;

    const postDir = post.path.replace(/\/?(?:index\.html)?$/, '').replace(/\\/g, '/');

    const fileNames = fs.readdirSync(assetsDir);
    fileNames.forEach(function (name) {
      const fullPath = path.join(assetsDir, name);
      if (!fs.statSync(fullPath).isFile()) return;

      result.push({
        path: postDir + '/' + name,
        data: function () {
          return fs.createReadStream(fullPath);
        }
      });
    });
  });

  return result;
});

// ==== ==== ==== ==== ==== ==== ====
// 2. 修正 HTML 中图片路径
// ==== ==== ==== ==== ==== ==== ====
hexo.extend.filter.register('after_post_render', function (data) {
  const slug = data.slug;
  if (!slug) return data;

  // 计算文章目录的绝对路径，如 /2026/07/04/hello-world/
  const postDir = data.path
    ? '/' + data.path.replace(/\/?(?:index\.html)?$/, '').replace(/\\/g, '/') + '/'
    : '/';

  // slug 中的中文在 HTML 中会被 URL 编码（如 字符串 → %E5%AD%97%E7%AC%A6%E4%B8%B2）
  // 需要同时匹配原始中文和 URL 编码两种格式
  const encodedSlug = encodeURIComponent(slug);

  // 匹配 src 后多种格式的路径：
  //   ./slug.assets/xxx   → 原始 Markdown 渲染结果
  //   /./slug.assets/xxx  → Hexo 额外添加了根目录斜杠
  //   slug.assets/xxx     → 无前缀
  //   ./slug/xxx          → 无 .assets
  const regex = new RegExp(
    `(<img[^>]*src\\s*=\\s*["'])\\/?(?:\\.\\/)?(?:${escapeRegex(slug)}|${escapeRegex(encodedSlug)})(?:\\.assets)?\\/`,
    'gi'
  );
  data.content = data.content.replace(regex, '$1' + postDir);

  return data;
});
```

缺点：使用 github 存储图片不实用

**使用 OSS 对象存储服务**

这里使用腾讯 COS

使用 Typora + PicGo 实现图片上传

配置 Typora

![image-20260706130351239](https://img-proxy.zzc.dpdns.org/images/f8fb2645078633ee6455b7502e598e0c.png)

配置 PicGo

![image-20260706130634174](https://img-proxy.zzc.dpdns.org/images/7366af40e0cbae6af474ed145ef4b35d.png)

配置好后就可以上传测试了

## 4. 使用 OSS 注意事项

**设置防盗刷，防止图片内嵌**

![image-20260706131114158](https://img-proxy.zzc.dpdns.org/images/09aea6c5b67be68c03604f0cfa66ebc3.png)

COS 基础资源包

![image-20260706131251430](https://img-proxy.zzc.dpdns.org/images/e64257d89759258b184fd173b2a5ed16.png)

**外网下行和请求上传都要额外计费**

![image-20260706131328323](https://img-proxy.zzc.dpdns.org/images/9eb476a536b1670880850b26e2bdd87f.png)

![image-20260706131400300](https://img-proxy.zzc.dpdns.org/images/e4a02fc4b26ffbadf4ee407a14b767bb.png)

**具体如下**

| **方向**                          | **收费？**                     | **说明**                                                     |
| :-------------------------------- | :----------------------------- | :----------------------------------------------------------- |
| 外网 **下行**（COS → 公网）        | **收费**                       | 就是读者看图、你下载文件这段                                 |
| 外网 **上行**（公网 → COS）        | **免费**                       | PicGo 传图上去那段不收流量钱                                 |
| 同地域内网（CVM/云函数 → COS）    | 免费                           | 你博客如果部署在腾讯云 CVM 同地域拉 COS，不走外网下行        |
| CDN 回源（COS → 腾讯云 CDN 节点） | 单独计费项，**比外网下行便宜** | 挂了 CDN 后，读者命中 CDN 就不走 COS 下行了，只 CDN 侧出流量 |

**算一笔账**

假设你博客一篇文章平均 3 张图，每张 500KB，日 PV 100：

- **外网下行**：3 × 500KB × 100 = 150MB/天 ≈ **4.5GB/月** → 按境内 0.15 元/GB（外网下行流量包抵扣后更低），月流量费 ≈ 0.7 元
- **请求**：3 × 100 = 300 次/天 ≈ **9000 次/月** → 远低于 100 万免费线，**0 元**

所以个人博客量级下，**请求不用管，下行才是大头**。

**省流量的两个方向**

1. **挂 CDN**：COS 作为 CDN 源站，读者第一次访问 CDN 没命中才回源到 COS（走 "CDN 回源流量"，比外网下行便宜），后续直接 CDN 节点出。每月 PV 几千以下其实没必要，PV 上万再考虑。
2. **外网下行流量包**：腾讯云有卖（比如 100GB/年 十几块钱），比按量 0.15 元/GB 划算，你博客现在这个量级买个最小档够用一年。

**价格对照（境内标准存储）**

| 计费方式         | 单价             | 说明                          |
| ---------------- | ---------------- | ----------------------------- |
| 按量计费（裸用） | **0.5 元/GB**    | 没买流量包，直接从余额扣      |
| 流量包抵扣       | 约 0.15 元/GB 起 | 100GB/年 大概 20 多块，摊下来 |




