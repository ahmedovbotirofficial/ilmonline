const initial = [
  { label: 'breadCrumbs.main', name: 'first-page' },
  { label: 'breadCrumbs.education', name: 'education' },
];

const TYPE_CURRENT_EDUCATION_BASE = {
  name: 'education-category',
  params: ['category_slug'],
  label: 'current_education_name',
};

const TYPE_CURRENT_EDUCATION_ARTICLES = {
  name: 'subcategory-articles',
  params: ['category_slug', 'subcategory_slug'],
  label: 'current_articles_name',
};

const TYPE_CHOOSEN_ARTICLE = {
  name: 'current-article',
  params: ['category_slug', 'subcategory_slug', 'article_slug'],
  label: 'article_name',
};

export default [
  {
    path: '/education',
    name: 'education',
    component: () => import('@/components/Education/Education.vue'),
    meta: {
      title: 'titles.education',
      breadcrumb: {
        initialState: initial,
      },
    },
  },
  {
    path: '/education/:category_slug',
    name: 'education-category',
    component: () =>
      import('@/components/Education/EducationSubcategoryPage.vue'),
    meta: {
      title: 'titles.education',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_CURRENT_EDUCATION_BASE],
      },
    },
  },
  {
    path: '/education/:category_slug/:subcategory_slug',
    name: 'subcategory-articles',
    component: () => import('@/components/Education/Subcategory.vue'),
    meta: {
      title: 'titles.education',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_CURRENT_EDUCATION_BASE, TYPE_CURRENT_EDUCATION_ARTICLES],
      },
    },
  },
  {
    path: '/education/:category_slug/:subcategory_slug/:article_slug',
    name: 'current-article',
    component: () => import('@/components/Education/ArticleDetails.vue'),
    meta: {
      title: 'titles.article_info',
      breadcrumb: {
        initialState: initial,
        finders: [
          TYPE_CURRENT_EDUCATION_BASE,
          TYPE_CURRENT_EDUCATION_ARTICLES,
          TYPE_CHOOSEN_ARTICLE,
        ],
      },
    },
  },
];
