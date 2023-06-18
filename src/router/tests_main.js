const initial = [
  { label: 'breadCrumbs.main', name: 'first-page' },
  { label: 'breadCrumbs.trial_tests', name: 'tests-main' },
];

export default [
  {
    path: '/tests',
    name: 'tests-main',
    component: () => import('@/components/Tests/TestsMain.vue'),
    meta: {
      title: 'titles.tests',
      breadcrumb: {
        initialState: initial,
      },
    },
    // beforeEnter: (to, from, next) => {
    //   if (to.name === 'tests-main' && !checkUserToken()) {
    //     next({ name: 'sign' });
    //   } else {
    //     next();
    //   }
    // },
  },
];
