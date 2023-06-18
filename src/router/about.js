const initial = [
  { label: 'breadCrumbs.main', name: 'first-page' },
  { label: 'breadCrumbs.about', name: 'about' },
];

export default [
  {
    path: '/about',
    name: 'about',
    component: () => import('@/components/AboutUs/AboutUs.vue'),
    meta: {
      title: 'titles.about',
      breadcrumb: {
        initialState: initial,
        // name: 'titles.about',
      },
    },
  },
];
