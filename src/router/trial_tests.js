import store from '@/store';

const initial = [
  { label: 'breadCrumbs.main', name: 'first-page' },
  { label: 'breadCrumbs.trial_tests', name: 'tests-main' },
];

const TYPE_DIRECTION = {
  name: 'trial-current-direction',
  params: ['direction', 'school_id'],
  label: 'direction',
};

const TYPE_VARIANT_LIST = {
  name: 'trial-list',
  params: ['direction', 'school_id', 'category_id'],
  label: 'variant_list_name',
};

const TYPE_CHOOSEN_VARIANT_TEST = {
  name: 'trial-test-variant',
  params: [
    'direction',
    'school_id',
    'variant_list_name',
    'category_id',
    'variant_id',
    'try_id',
  ],
  label: 'variant_number',
};

const TYPE_RESULT_TRIAL_TEST = {
  name: 'trial-list-results',
  params: ['try_id'],
  label: 'misstakes_work',
};

export default [
  {
    path: '/tests/trial/:direction/:school_id',
    name: 'trial-current-direction',
    component: () =>
      import('@/components/Tests/TrialTests/TrialCurrentDirectionMain.vue'),
    meta: {
      title: 'titles.tests',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_DIRECTION],
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

  {
    path: '/tests/trial/:direction/:school_id/:variant_list_name/:category_id',
    name: 'trial-list',
    component: () => import('@/components/Tests/TrialTests/TrialList.vue'),
    meta: {
      title: 'titles.tests',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_DIRECTION, TYPE_VARIANT_LIST],
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

  {
    path: '/tests/trial/:direction/:school_id/:variant_list_name/:category_id/variant/:variant_id/try/:try_id',
    name: 'trial-test-variant',
    component: () =>
      import('@/components/Tests/TrialTests/TrialTestVariant.vue'),
    meta: {
      title: 'titles.tests',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_DIRECTION, TYPE_VARIANT_LIST, TYPE_CHOOSEN_VARIANT_TEST],
      },
    },
    beforeRouteLeave(to, from) {
      const answer = window.confirm(
        'Do you really want to leave? you have unsaved changes!'
      );
      if (!answer) return false;
    },
  },

  {
    path: '/tests/trial-results/:try_id',
    name: 'trial-list-results',
    component: () =>
      import('@/components/Tests/TrialTests/TrialTestResults.vue'),
    meta: {
      title: 'titles.tests',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_RESULT_TRIAL_TEST],
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
