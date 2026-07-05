/**
 * Typora .assets 图片兼容脚本
 */

const fs = require('fs');
const path = require('path');

/** 转义正则中的特殊字符 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================
// 1. 将 .assets 图片注册为 Hexo 生成文件
// ============================
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

// ============================
// 2. 修正 HTML 中图片路径
// ============================
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