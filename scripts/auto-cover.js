'use strict';

/**
 * 自动封面脚本
 * 根据文章最深层的分类名匹配封面图片，支持数组实现随机封面。
 * 优先级 11，在 hexo-auto-front-matter 插件之后运行。
 * 若分类未匹配到封面，则交给 Butterfly 主题的 default_cover 随机池。
 */

const coverMap = {
  Java: [
    '/img/cover/java-1.jpg',
    '/img/cover/java-2.jpg',
    '/img/cover/java-3.jpg',
  ],
  数据库: '/img/cover/database.jpg',
  前端: '/img/cover/frontend.jpg',
  工具: '/img/cover/tools.jpg',
  其他: '/img/cover/other.jpg',
  随笔: '/img/cover/essay.jpg',
  阅读: '/img/cover/reading.jpg',
};

hexo.extend.filter.register('before_post_render', function (data) {
  if (data.layout !== 'post') return data;

  const categories = data.categories || [];
  // 从最深层分类向浅层查找匹配
  for (let i = categories.length - 1; i >= 0; i--) {
    const cat = typeof categories[i] === 'string' ? categories[i] : categories[i].name;
    const cover = coverMap[cat];
    if (cover) {
      if (Array.isArray(cover)) {
        data.cover = cover[Math.floor(Math.random() * cover.length)];
      } else {
        data.cover = cover;
      }
      this.log.i('Auto cover [%s]: %s', data.title, data.cover);
      return data;
    }
  }

  return data;
}, 11);