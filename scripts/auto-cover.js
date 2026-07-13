'use strict';

/**
 * 自动封面脚本
 * 所有分类从 CDN 图片池中随机选取封面。
 * 优先级 11，在 hexo-auto-front-matter 插件之后运行。
 *
 * 分配策略：Fisher-Yates 全量洗牌 → 顺序取图
 * 每次构建将 62 张图打乱，依次分配，用完再重新洗牌。
 * 保证前 62 篇文章封面完全不重复，之后才可能出重复。
 */

const TOTAL_COVERS = 62;

// 用循环生成 URL 列表，简洁又容易改数量
const coverPool = Array.from(
  { length: TOTAL_COVERS },
  (_, i) => `https://img-proxy.zzc.dpdns.org/images/cover2/${i + 1}.webp`
);

// ---- Fisher-Yates 洗牌 ----
let shuffled = [];
let pointer = 0;

function shufflePool() {
  shuffled = [...coverPool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  pointer = 0;
}

function getRandomCover() {
  if (pointer >= shuffled.length) shufflePool(); // 用完了，重新洗牌
  return shuffled[pointer++];
}

// 初始化：构建启动时洗好牌
shufflePool();

hexo.extend.filter.register('before_post_render', function (data) {
  if (data.layout !== 'post') return data;

  let cats = data.categories;
  if (!cats) return data;
  if (typeof cats.toArray === 'function') cats = cats.toArray();
  if (!Array.isArray(cats) || cats.length === 0) return data;

  data.cover = getRandomCover();
  this.log.i('Auto cover [%s]: %s', data.title, data.cover);

  return data;
}, 11);
