const initial = [
  { label: 'breadCrumbs.main', name: 'first-page' },
  { label: 'breadCrumbs.trial_tests', name: 'tests-main' },
];

const TYPE_DIRECTION = {
  name: 'quiz-current-direction',
  params: ['direction', 'category_id'],
  label: 'direction',
};

const TYPE_PASSING_TEST = {
  name: 'quiz-passing',
  params: ['direction', 'category_id', 'quiz_id', 'quiz_passing_id'],
  label: 'test_title',
};

const TYPE_PASSING_TEST_BY_ID = {
  name: 'quiz-passing',
  params: ['direction', 'category_id', 'quiz_id'],
  label: 'test_title',
};

const TYPE_RESULT_QUIZ_TEST = {
  name: 'quiz-results',
  params: ['direction', 'category_id', 'quiz_id', 'quiz_passing_id'],
  label: 'results',
};

export default [
  {
    path: '/tests/quiz/:direction/:category_id',
    // path: '/tests/quiz',
    name: 'quiz-current-direction',
    component: () =>
      import('@/components/Tests/QuizTests/QuizCurrentDirectionMain.vue'),
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
    path: '/tests/quiz/:direction/:category_id/quiz-passing/:quiz_passing_id',
    name: 'quiz-passing-continue',
    component: () => import('@/components/Tests/QuizTests/QuizTestPassing.vue'),
    meta: {
      title: 'titles.tests',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_DIRECTION, TYPE_PASSING_TEST_BY_ID],
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
    path: '/tests/quiz/:direction/:category_id/quiz-passing/:quiz_id',
    name: 'quiz-passing',
    component: () => import('@/components/Tests/QuizTests/QuizTestPassing.vue'),
    meta: {
      title: 'titles.tests',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_DIRECTION, TYPE_PASSING_TEST],
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
    path: '/tests/quiz/:direction/:category_id/quiz-passing/results/:quiz_passing_id',
    name: 'quiz-results',
    component: () => import('@/components/Tests/QuizTests/QuizTestResults.vue'),
    meta: {
      title: 'titles.tests',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_DIRECTION, TYPE_PASSING_TEST, TYPE_RESULT_QUIZ_TEST],
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
