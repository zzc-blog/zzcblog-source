'use strict';

/**
 * 自动封面脚本
 * 从 CDN 图池随机选取封面，按需懒下载到本地。
 *
 * ── 流程 ──
 * ① before_post_render（优先级 11）
 *    Fisher-Yates 洗牌 → 取下一张 → 按需下载到 source/cover/
 * ② cover_images (generator)
 *    将 source/cover/ 中已有的封面注册为路由，输出到 public/cover/
 *
 * 效果：第一次构建只下载用到的封面，后续构建复用本地缓存。
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const TOTAL_COVERS = 62;
const CDN_BASE = 'https://img-proxy.zzc.dpdns.org/images/cover2';
const LOCAL_DIR = path.resolve(__dirname, '..', 'source', 'cover');

// ============================================================
// Fisher-Yates 洗牌
// ============================================================
let shuffled = [];
let pointer = 0;

function shufflePool() {
  shuffled = Array.from({ length: TOTAL_COVERS }, (_, i) => i + 1);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  pointer = 0;
}

shufflePool();

function nextIndex() {
  if (pointer >= shuffled.length) shufflePool();
  return shuffled[pointer++];
}

// ============================================================
// 按需下载单张图片
// ============================================================
function ensureDir() {
  if (!fs.existsSync(LOCAL_DIR)) {
    fs.mkdirSync(LOCAL_DIR, { recursive: true });
  }
}

function downloadIfMissing(index) {
  return new Promise((resolve, reject) => {
    const dest = path.join(LOCAL_DIR, `${index}.webp`);
    if (fs.existsSync(dest)) return resolve(dest);

    ensureDir();
    const url = `${CDN_BASE}/${index}.webp`;
    const file = fs.createWriteStream(dest);

    https.get(url, res => {
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        hexo.log.i('Auto cover: downloaded cover/%s.webp', index);
        resolve(dest);
      });
    }).on('error', err => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

// ============================================================
// ① before_post_render：随机分配封面（异步下载）
// ============================================================
hexo.extend.filter.register('before_post_render', async function (data) {
  if (data.layout !== 'post') return data;

  let cats = data.categories;
  if (!cats) return data;
  if (typeof cats.toArray === 'function') cats = cats.toArray();
  if (!Array.isArray(cats) || cats.length === 0) return data;

  const idx = nextIndex();

  try {
    await downloadIfMissing(idx);
    data.cover = `/cover/${idx}.webp`;
    this.log.i('Auto cover [%s]: /cover/%s.webp', data.title, idx);
  } catch (err) {
    // 下载失败时回退到 CDN 直链
    data.cover = `${CDN_BASE}/${idx}.webp`;
    this.log.warn('Auto cover [%s] CDN fallback: %s', data.title, err.message);
  }

  return data;
}, 11);

// ============================================================
// ② generator：扫描 source/cover/，将所有封面注册为路由
// ============================================================
hexo.extend.generator.register('cover_images', function () {
  if (!fs.existsSync(LOCAL_DIR)) return [];

  const files = fs.readdirSync(LOCAL_DIR).filter(f => /^\d+\.webp$/.test(f));
  return files.map(name => ({
    path: `cover/${name}`,
    data: () => fs.createReadStream(path.join(LOCAL_DIR, name))
  }));
});
