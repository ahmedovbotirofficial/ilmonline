const initial = [
  { label: 'breadCrumbs.main', name: 'first-page' },
  { label: 'breadCrumbs.news', name: 'news' },
];

const TYPE_CURRENT_NEWS = {
  name: 'current-news',
  params: ['slug'],
  label: 'current_news_name',
};

export default [
  {
    path: '/news/:page?',
    name: 'news',
    component: () => import('@/components/News/News.vue'),
    meta: {
      title: 'titles.news',
      breadcrumb: {
        initialState: initial,
      },
    },
  },
  {
    path: '/current-news/:slug?',
    name: 'current-news',
    component: () => import('@/components/News/NewsCurrent.vue'),
    meta: {
      title: 'titles.news',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_CURRENT_NEWS],
      },
    },
  },
];
