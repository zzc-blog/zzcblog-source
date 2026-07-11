'use strict';

/**
 * 自动封面脚本
 * 所有分类从 cover 图片池中随机选取封面。
 * 优先级 11，在 hexo-auto-front-matter 插件之后运行。
 */

// 所有封面图片池（共 27 张）
const coverPool = [
  '/img/cover/cover-01.jpg',
  '/img/cover/cover-02.jpg',
  '/img/cover/cover-03.png',
  '/img/cover/cover-04.png',
  '/img/cover/cover-05.jpg',
  '/img/cover/cover-06.jpg',
  '/img/cover/cover-07.jpg',
  '/img/cover/cover-08.jpg',
  '/img/cover/cover-09.jpg',
  '/img/cover/cover-10.jpg',
  '/img/cover/cover-11.jpg',
  '/img/cover/cover-12.jpg',
  '/img/cover/cover-13.jpg',
  '/img/cover/cover-14.jpg',
  '/img/cover/cover-15.png',
  '/img/cover/cover-16.jpg',
  '/img/cover/cover-17.jpg',
  '/img/cover/cover-18.jpg',
  '/img/cover/cover-19.webp',
  '/img/cover/cover-20.webp',
  '/img/cover/cover-21.webp',
  '/img/cover/cover-22.jpg',
  '/img/cover/cover-23.jpg',
  '/img/cover/cover-24.jpg',
  '/img/cover/cover-25.jpg',
  '/img/cover/cover-26.jpg',
  '/img/cover/cover-27.jpg',
];

// 记录最近使用的索引，避免连续重复
const history = [];
const maxHistory = 3;

function getRandomCover() {
  let index;
  do {
    index = Math.floor(Math.random() * coverPool.length);
  } while (history.includes(index) && history.length < coverPool.length - 1);

  history.push(index);
  if (history.length > maxHistory) history.shift();

  return coverPool[index];
}

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