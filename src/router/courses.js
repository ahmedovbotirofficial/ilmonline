import { checkUserToken } from '@/api/config';
import store from '@/store';
const initial = [
  { label: 'breadCrumbs.main', name: 'first-page' },
  {
    label: `breadCrumbs.courses.${store.getters.getCoursesMode}`,
    name: 'courses',
  },
];

const TYPE_CURRENT_COURSE = {
  name: 'current-course',
  params: ['course_id'],
  label: 'current_course_name',
};

const TYPE_CURRENT_COURSE_VIDEO = {
  name: `${store.getters.getUserRole}-video`,
  params: ['course_id', 'lesson_id'],
  label: 'watching_current_course',
};

const TYPE_CURRENT_COURSE_TEST = {
  name: 'course-test',
  params: ['course_id', 'lesson_id'],
  label: 'current_course_test',
};

const TYPE_COURSE_INDIVIDUAL_TASK = {
  name: 'student-individual-task',
  params: ['course_id', 'lesson_id', 'individual_task_id'],
  label: 'current_course_individual_task',
};

export default [
  {
    path: '/courses/:page?',
    name: 'courses',
    component: () => import('@/components/AllCoursesPage/AllCoursesPage.vue'),
    props: true,
    meta: {
      title: 'titles.courses',
      breadcrumb: {
        initialState: initial,
      },
    },
    // beforeEnter: (to, from, next) => {
    //   if (to.name === 'courses' && !checkUserToken()) {
    //     next({ name: 'sign' });
    //   } else {
    //     next();
    //   }
    // },
  },
  {
    path: '/courses/course/:course_id',
    name: 'current-course',
    component: () => import('@/components/Courses/CurrentCourse.vue'),
    meta: {
      title: 'titles.course_info',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_CURRENT_COURSE],
      },
    },
  },
  {
    path: '/courses/course/:course_id/video/:lesson_id',
    name: 'student-video',
    component: () => import('@/components/Video/StudentVideo.vue'),
    meta: {
      title: 'titles.watching',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_CURRENT_COURSE, TYPE_CURRENT_COURSE_VIDEO],
      },
    },
    beforeEnter: (to, from, next) => {
      if (
        (to.name === 'student-video' && !checkUserToken()) ||
        store.getters.getUserRole === 'teacher'
      ) {
        next({ name: 'registration' });
      } else {
        next();
      }
    },
  },
  {
    path: '/courses/course/:course_id/video/:lesson_id',
    name: 'student-video',
    component: () => import('@/components/Video/StudentVideo.vue'),
    meta: {
      title: 'titles.watching',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_CURRENT_COURSE, TYPE_CURRENT_COURSE_VIDEO],
      },
    },
    beforeEnter: (to, from, next) => {
      if (to.name === 'student-video' && !checkUserToken()) {
        next({ name: 'registration' });
      } else {
        next();
      }
    },
  },
  {
    path: '/courses/course/:course_id/lesson/:lesson_id/test/',
    name: 'course-test',
    component: () => import('@/components/Courses/CourseTest.vue'),
    meta: {
      title: 'titles.current_tests',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_CURRENT_COURSE, TYPE_CURRENT_COURSE_TEST],
      },
    },
    beforeEnter: (to, from, next) => {
      if (to.name === 'course-test' && !checkUserToken()) {
        next({ name: 'sign' });
      } else {
        next();
      }
    },
  },
  {
    path: '/courses/course/:course_id/lesson/:lesson_id/test/:test_id/results',
    name: 'course-test-results',
    component: () => import('@/components/Courses/CourseTestResults.vue'),
    meta: {
      title: 'titles.current_tests',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_CURRENT_COURSE, TYPE_CURRENT_COURSE_TEST],
      },
    },
    beforeEnter: (to, from, next) => {
      if (to.name === 'course-test' && !checkUserToken()) {
        next({ name: 'sign' });
      } else {
        next();
      }
    },
  },
  {
    path: '/courses/course/:course_id/lesson/:lesson_id/individual-task/:individual_task_id',
    name: 'student-individual-task',
    component: () =>
      import(
        '@/components/Courses/IndividualTask/StudentLessonIndividualTask.vue'
      ),
    meta: {
      title: 'titles.individual_task',
      breadcrumb: {
        initialState: initial,
        finders: [TYPE_CURRENT_COURSE, TYPE_COURSE_INDIVIDUAL_TASK],
      },
    },
    beforeEnter: (to, from, next) => {
      if (to.name === 'student-individual-task' && !checkUserToken()) {
        next({ name: 'sign' });
      } else {
        next();
      }
    },
  },
];
