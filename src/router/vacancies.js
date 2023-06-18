const initial = [
  { label: 'breadCrumbs.main', name: 'first-page' },
  { label: 'breadCrumbs.vacancy', name: 'vacancy' },
];

const TYPE_CURRENT_VACANCY = {
  name: 'selected-vacancy',
  params: ['slug'],
  label: 'current_vacancy_name',
};

export default [
  {
    path: '/vacancies/:page?',
    name: 'vacancy',
    component: () => import('@/components/Vacancy/Vacancy.vue'),
    meta: {
      title: 'titles.vacancy',
      breadcrumb: {
        initialState: initial,
      },
    },
    props: true,
  },
  {
    path: '/vacancies/vacancy/:slug',
    name: 'selected-vacancy',
    component: () => import('@/components/Vacancy/VacancySelected.vue'),
    meta: {
      title: 'titles.vacancy',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_CURRENT_VACANCY],
      },
    },
  },
];
