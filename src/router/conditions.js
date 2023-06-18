const initialAgreement = [
  { label: 'breadCrumbs.main', name: 'first-page' },
  { label: 'breadCrumbs.condition', name: 'agreement' },
];

const initialPolicy = [
  { label: 'breadCrumbs.main', name: 'first-page' },
  { label: 'breadCrumbs.policy', name: 'policy' },
];

export default [
  {
    path: '',
    name: 'conditions',
    component: () => import('@/components/MainConditions/MainConditions.vue'),
    meta: {
      // title: 'titles.auth',
    },
    children: [
      {
        path: '/agreement',
        name: 'agreement',
        component: () =>
          import('@/components/MainConditions/AgreementConditions.vue'),
        meta: {
          title: 'titles.condition',
          breadcrumb: {
            initialState: initialAgreement,
          },
        },
      },
      {
        path: '/policy',
        name: 'policy',
        component: () =>
          import('@/components/MainConditions/PolicyConditions.vue'),
        meta: {
          title: 'titles.policy',
          breadcrumb: {
            initialState: initialPolicy,
          },
        },
      },
    ],
  },
];
