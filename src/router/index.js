import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { getFromLS, isLSHasItem } from '@/library/helpers';
import { checkUserToken } from '@/api/config';
import VueI18n from '../i18n';

import about from './about';
import quiz_tests from './quiz_tests';
import tests_main from './tests_main';
import trial_tests from './trial_tests';
import courses from './courses';
import conditions from './conditions';
import vacancies from './vacancies';
import news from './news';
import education from './education';

Vue.use(VueRouter);
Vue.use(VueI18n);

const routes = [
  {
    path: '/',
    name: '',
    component: () => import('@/components/Home/Home.vue'),
    meta: {
      // title: `Home`,
    },
    children: [
      {
        path: '/',
        name: 'first-page',
        component: () => import('@/components/FirstPage/FirstPage.vue'),
        meta: {
          title: 'titles.main',
        },
      },
      {
        path: '/profile/teacher/course/:course_id/student/:student_id/lesson_progress_id/:lesson_progress_id/test-results/:test_id',
        name: 'teacher-test-detail',
        component: () =>
          import(
            '@/components/StudentCourseProgress/TeacherStudentTestProgress.vue'
          ),
        meta: {
          title: 'titles.watching',
          breadcrumbs: {
            name: 'titles.lesson',
          },
        },
      },
      {
        path: '/profile/teacher/course/:course_id/student/:student_id/lesson/:lesson_id/individual-task-progress/:task_progress_id',
        name: 'teacher-individual-task-by-student',
        component: () =>
          import(
            '@/components/Courses/IndividualTask/TeacherLessonIndividualTask.vue'
          ),
        meta: {
          title: 'titles.individual_task',
          breadcrumbs: {
            title: 'titles.individual_task',
          },
        },
      },
      {
        path: '/profile/teacher/course/:course_id/lesson/:lesson_id/individual-task/:individual_task_id',
        name: 'teacher-individual-task-details',
        component: () =>
          import(
            '@/components/Courses/IndividualTask/TeacherIndividualTaskOnlyView.vue'
          ),
        meta: {
          title: 'titles.individual_task',
          breadcrumbs: {
            title: 'titles.individual_task',
          },
        },
      },
      {
        path: '/profile/teacher/course/:course_id/:lesson_id',
        name: 'teacher-test-detail-main',
        component: () =>
          import('@/components/StudentCourseProgress/TeacherTestsMain.vue'),
        meta: {
          title: 'titles.watching',
          breadcrumbs: {
            name: 'titles.lesson',
          },
        },
      },
      {
        path: '/profile/student/:student_id/course-details/:course_id/:course_progress_id/lesson/:lesson_id',
        name: 'teacher-lesson-detail',
        component: () =>
          import(
            '@/components/StudentCourseProgress/TeacherLessonsProgressDetails.vue'
          ),
        meta: {
          title: 'titles.watching',
          breadcrumbs: {
            name: 'titles.lesson',
          },
        },
      },
      {
        path: '/profile/teacher/course-details/:course_id',
        name: 'lesson-detail',
        component: () =>
          import('@/components/StudentCourseProgress/TeacherDetailsCourse.vue'),
        meta: {
          title: 'titles.watching',
          breadcrumbs: {
            name: 'titles.lesson',
          },
        },
      },
      // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLmlsbS5kZXZiYXp1LmNvbVwvYXBpXC9hdXRoXC9zaWduLWluIiwiaWF0IjoxNjU1NzIwMTgwLCJleHAiOjYxNjU1NzIwMTgwLCJuYmYiOjE2NTU3MjAxODAsImp0aSI6ImxPbm5kbWtRRDZVRjdETEIiLCJzdWIiOjYzLCJwcnYiOiJlY2FhNDNjYWFjNWUwYjk4MzFkNmY1NmE3OTNlMWQ3NmI1NDIzYTQ5In0._vkvH7-CkifGdNhBS2NK5RuM5pfn210FushUYU6RYaw
      // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLmlsbS5kZXZiYXp1LmNvbVwvYXBpXC9hdXRoXC9zaWduLWluIiwiaWF0IjoxNjU1NzIxMzA3LCJleHAiOjYxNjU1NzIxMzA3LCJuYmYiOjE2NTU3MjEzMDcsImp0aSI6Ik9YTFNBWjJJVGo5R09UWmUiLCJzdWIiOjYzLCJwcnYiOiJlY2FhNDNjYWFjNWUwYjk4MzFkNmY1NmE3OTNlMWQ3NmI1NDIzYTQ5In0.jSQI-xEkR-LCjQOfG3_uE_y9Ys8X_qm23fMKapULBXk
      {
        path: '',
        name: 'auth',
        component: () => import('@/components/Auth/Auth.vue'),
        meta: {
          title: 'titles.auth',
        },
        children: [
          {
            path: '/sign-in',
            name: 'sign',
            component: () => import('@/components/Auth/AuthSignIn.vue'),
            meta: {
              title: 'titles.auth',
            },
          },
          {
            path: '/registration',
            name: 'registration',
            component: () => import('@/components/Auth/AuthRegistration.vue'),
            meta: {
              title: 'titles.registration',
            },
          },
          {
            path: '/reset-password/:token',
            name: 'reset-password',
            component: () => import('@/components/Auth/ResetPassword.vue'),
            meta: {
              // title: 'titles.reset_password',
            },
          },
          {
            path: '/auth/success',
            name: 'sign-in-social-success',
            component: () => import('@/components/Auth/AuthSocialSuccess.vue'),
            meta: {
              title: 'titles.auth',
            },
          },
          {
            path: '/sign-in/telegram-login-mobile',
            name: 'sign-in-telegram-mobile',
            component: () =>
              import('@/components/Auth/TelegramLoginMobile.vue'),
            meta: {
              title: 'titles.auth',
            },
          },
        ],
      },

      {
        path: '',
        name: 'profile-main',
        component: () => import('@/components/Profiles/ProfileMain.vue'),
        meta: {
          // title: 'titles.auth',
        },
        children: [
          {
            path: '/profile',
            name: 'profile',
            component: () => import('@/components/Profiles/ProfileInside.vue'),
            meta: {
              title: 'titles.profile',
            },
          },
          {
            path: '/profile/edit',
            name: 'profile-edit',
            component: () => import('@/components/Profiles/EditProfile.vue'),
            meta: {
              title: 'titles.profile',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'profile-edit' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/my-lessons/:page?',
            name: 'lessons',
            component: () => import('@/components/Profiles/MyLessons.vue'),
            meta: {
              title: 'titles.my_lessons',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'lessons' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/chat',
            name: 'chat',
            component: () => import('@/components/Chat/Chat.vue'),
            meta: {
              title: 'titles.chat',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'chat' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/payment',
            name: 'payment',
            component: () =>
              import('@/components/Profiles/Payment/Payment.vue'),
            meta: {
              title: 'titles.payments',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'payment' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/payment/add-card',
            name: 'payment-add-card',
            component: () => import('@/components/Profiles/PaymentAdd.vue'),
            meta: {
              title: 'titles.payments',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'payment-add-card' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/payment/edit-card',
            name: 'payment-edit-card',
            component: () => import('@/components/Profiles/PaymentEdit.vue'),
            meta: {
              title: 'titles.payments',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'payment-add-card' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/referal',
            name: 'referal',
            component: () => import('@/components/Profiles/ReferalSystem.vue'),
            meta: {
              title: 'titles.referal',
            },
            beforeEnter: (to, from, next) => {
              if (
                (to.name === 'referal' && !checkUserToken()) ||
                getFromLS('role') !== 'student'
              ) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/parent_control',
            name: 'parent_control',
            component: () => import('@/components/Profiles/ParentControl.vue'),
            meta: {
              title: 'header.parent_control',
            },
            beforeEnter: (to, from, next) => {
              if (
                (to.name === 'referal' && !checkUserToken()) ||
                getFromLS('role') !== 'student'
              ) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/tests',
            name: 'profile-tests',
            component: () => import('@/components/Profiles/ProfileTests.vue'),
            meta: {
              title: 'titles.my_tests',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'profile-tests' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/students',
            name: 'students',
            component: () =>
              import('@/components/Profiles/StudentsOfTeacher.vue'),
            meta: {
              title: 'titles.students',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'students' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/smart-subscribe',
            name: 'smart_subscribe',
            component: () => import('@/components/Profiles/SmartSubscribe.vue'),
            meta: {
              title: 'titles.subscribe',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'smart_subscribe' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/smart-subscribe/direction',
            name: 'direction',
            component: () =>
              import('@/components/Profiles/SmartSubscribeDirections.vue'),
            meta: {
              // title: 'titles.auth',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'direction' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/smart-subscribe/pay-successful',
            name: 'pay-successful',
            component: () =>
              import('@/components/Profiles/SmartSubscribePaySuccessful.vue'),
            meta: {
              // title: 'titles.auth',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'pay-successful' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
          {
            path: '/profile/smart-subscribe/pay-failed',
            name: 'pay-failed',
            component: () =>
              import('@/components/Profiles/SmartSubscribePayFailed.vue'),
            meta: {
              // title: 'titles.auth',
            },
            beforeEnter: (to, from, next) => {
              if (to.name === 'pay-failed' && !checkUserToken()) {
                next({ name: 'sign' });
              } else {
                next();
              }
            },
          },
        ],
      },
      ...courses,
      ...tests_main,
      ...trial_tests,
      ...education,
      ...quiz_tests,
      ...vacancies,
      ...conditions,
      ...about,
      ...news,

      {
        path: '/profile/payment/withdrawal/:id?',
        name: 'withdrawal',
        component: () => import('@/components/Profiles/Withdrawal.vue'),
        beforeEnter: (to, from, next) => {
          if (
            (to.name === 'withdrawal' && !checkUserToken()) ||
            store.getters.getUserRole === 'student'
          ) {
            next({ name: 'sign' });
          } else {
            next();
          }
        },
        meta: {
          title: 'titles.withdrawal',
        },
      },
      {
        path: '*',
        name: 'error',
        component: () => import('@/components/Error/ErrorPage.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            selector: to.hash,
            behavior: 'smooth',
          });
        }, 1000);
      });
    } else {
      return { x: 0, y: 0 };
    }
  },
});

// router.beforeEach((to, from, next) => {
// next()
// });

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    // console.log(VueI18n.t('titles.main'));

    document.title =
      to.meta && to.meta.title
        ? `${VueI18n.t(`${to.meta.title}`)} | ${process.env.VUE_APP_TITLE}`
        : process.env.VUE_APP_TITLE;
  });
});

export default router;
