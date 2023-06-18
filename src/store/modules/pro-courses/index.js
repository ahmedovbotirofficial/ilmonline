import {
  getCurrentProCoursePreview,
  getProCoursesFilters,
  getProCoursesCategories,
  getProCoursesList,
  getPopularProCoursesList,
  getLatestProCoursesList,
  getCurrentProCourseData,
  getProCourseReviews,
  getProThreads,
  addProCourseReview,
  purchaseProCourse,
  getMyProCourseProgress,
  setProVideoSecond,
  startProCourse,
  startProLesson,
  getProStudentSubscriptionInfo,
  deleteProStudentSubscription,
  updateProStudentSubscription,
  getLessonTest,
  deleteLessonTest,
  passingTest,
  getLessonTestRightResponses,
  getProStudentsList,
  getStudentsProCourseProgressList,
  getStudentsProCourseProgress,
  getProLessonProgressData,
  getProTeacherLessonProgress,
  getMyProUnreadMessages,
  getMyCoursesList,
} from '@/api/pro-courses/services';
import { isLSHasItem, setToLS } from '@/library/helpers';
import VueI18n from '@/i18n';
import router from '@/router';

export default {
  state: {},
  getters: {},
  mutations: {},

  actions: {
    async getAllProCoursesFilters({ commit }) {
      try {
        const res = await getProCoursesFilters();
        if (res.status === 200) {
          commit('SET_FILTERS_LIST', res.data.data.filters);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },
    async getProCoursesCategories() {
      try {
        const res = await getProCoursesCategories();
        return res.data.data.courses_categories;
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getAllProCoursesList({ getters, commit, dispatch }, data) {
      if (getters.getAllCoursesStatus) {
        data = {
          page: 1,
          order_by: 'rating_desc',
        };
        commit('setHeaderCoursesFilter', null);
      }
      try {
        const res = await getProCoursesList(data);

        // console.log(router.history.current.name);
        // console.log(getters.getCurrentCoursesPage);
        if (res.status === 200) {
          commit('SET_COURSES_LIST', res.data.data.courses);
          commit('SET_COURSES_PAGE_COUNT', res.data.data.courses.last_page);
          commit('SET_ALL_COURSES', false);
          if (getters.getCurrentCoursesPage > res.data.data.courses.last_page) {
            commit('SET_CURRENT_COURSES_PAGE', 1);
            dispatch('getAllProCoursesList', {
              page: 1,
              order_by: 'rating_desc',
            });
          }
          router.push({
            name: router.history.current.name,
            query: { page: getters.getCurrentCoursesPage },
          })
            .catch(() => { });
        }
        // console.log(res);
        // return res.data.data.courses;
      } catch (error) {
        // console.log(error);
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getMyProCoursesList({ getters }, data) {
      try {
        const res = await getMyCoursesList(data);
        // console.log(res);
        return res.data.data.courses;
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },
    async getPopularProCoursesList() {
      try {
        const res = await getPopularProCoursesList();
        // console.log(res);
        return res.data.data.courses;
      } catch (error) {
        return { error: true };
        // error.handleGlobally && error.handleGlobally();
      }
    },
    async getLatestProCoursesList() {
      try {
        const res = await getLatestProCoursesList();
        // console.log(res);
        return res.data.data.courses;
      } catch (error) {
        return { error: true };
        // error.handleGlobally && error.handleGlobally();
      }
    },
    async getCurrentProCourseData({ getters, commit }, id) {
      try {
        const res = await getCurrentProCourseData(id);
        if (res.status === 200) {
          commit('SET_CURR_COURSE_DATA', res.data.data.course);
          if (!isLSHasItem('last_watched_lesson_id')) {
            setToLS(
              'last_watched_lesson_id',
              res.data.data.course.chapters[0].lessons_and_tests_and_tasks[0]
                .lesson.id
            );
          }
        }
      } catch (error) {
        console.log('SET_CURR_COURSE_DATA', error.response);
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getCurrentProCoursePreview({ getters, commit }, id) {
      commit('SET_CURR_COURSE_DATA', null);
      try {
        const res = await getCurrentProCoursePreview(id);
        if (res.status === 200) {
          commit('SET_CURR_COURSE_DATA', res.data.data.course);
          if (!isLSHasItem('last_watched_lesson_id')) {
            commit(
              'SET_LAST_WATCHED_LESSON',
              res.data.data.course.last_lesson_focused_id
            );
          }
        }
        // return res.data.data.course;
      } catch (error) {
        console.log('getCurrentCoursePreview Error <<<', error.response);
        return error.response.data.error.id;
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getMyProCourseProgress({ commit }, data) {
      try {
        const res = await getMyProCourseProgress(data);
        // console.log('response startLesson', res);
        if (res.status === 200) {
          // console.log('courseProgress <<<', res.data.data.courseProgress);
          commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
        }
      } catch (error) {
        console.log(error.response.data.error);
        return error.response.data.error;
      }
    },

    async setProVideoSecond({ commit }, data) {
      try {
        const res = await setProVideoSecond(data);
        if (res.status === 200) {
          commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
        }
      } catch (error) {
        console.log(
          'Set video second >>>>',
          error.response.data.error.lesson_id
        );
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async startProCourse({ commit }, data) {
      // console.log(data);
      try {
        const res = await startProCourse(data);
        console.log('response start course >>>', res.data.data);
        return res.data.data;
      } catch (error) {
        return error.response.data.error;
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async startProLesson({ commit, dispatch }, data) {
      try {
        const res = await startProLesson(data);
        // console.log('response startLesson', res);
        if (res.status === 200) {
          // console.log('start less courseProgress <<<< ', res.data.data.courseProgress);
          // commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
          // dispatch('getMyProCourseProgress');
        }
      } catch (error) {
        console.log(error.response.data.error);
        return error.response.data.error;
      }
    },

    async getProLessonTest({ commit }, data) {
      try {
        const res = await getLessonTest(data);
        if (res.status === 200) {
          // console.log('getLessonTest <<<<', res.data.data);
          commit('SET_LESSON_TEST', res.data.data.test);
        }
        // return res.data.data.test;
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async deleteProLessonTest({ commit, dispatch }, data) {
      // console.log('store curr test info', data);
      try {
        const res = await deleteLessonTest(data);
        if (res.status === 200) {
          commit('SET_ENDED_LESSON_TEST', false);
          commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
        }
        // console.log('response deleteLessonTest', res.data.data);
        return res.data.data;
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async passingProTest({ commit }, data) {
      // console.log('store curr test info', data);
      try {
        const res = await passingTest(data);
        if (res.status === 200) {
          commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getProLessonTestRightResponses({ commit }, data) {
      try {
        const res = await getLessonTestRightResponses(data);
        if (res.status === 200) {
          commit('SET_RIGHT_LESSON_TEST_ANSWERS', res.data.data.answers);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getProCourseReviews(_, { id, offset }) {
      try {
        const res = await getProCourseReviews(id, offset);
        return res.data.data.reviews;
      } catch (error) {
        console.log(error);
      }
    },

    async addProCourseReview(
      { getters, commit, dispatch },
      { id, rating, text }
    ) {
      try {
        const res = await addProCourseReview(id, rating, text);
        if (res.status === 200) {
          dispatch('setNotification', {
            type: 'success',
            text: `${VueI18n.t('courses.rate_thanks')}`,
          });
        }
        // При успешном исходе: - Спасибо за Ваш отзыв!(uz, uz - latn: Fikr - mulohazangiz uchun tashakkur!)
      } catch (error) {
        dispatch('setNotification', {
          type: 'success',
          text: error.response.data.error.author_id[0],
        });
        // commit('SET_ERRORS', error.response.data.error);
      }
    },

    async purchaseProCourse({ commit, dispatch, getters }, id) {
      try {
        const res = await purchaseProCourse(id);
        if (res.status === 200) {
          commit('SET_MODAL', { state: false });
          dispatch('getCurrentProCourseData', id);
          await router.push({
            name: `${getters.getUserRole}-video`,
            params: {
              course_id: id,
              lesson_id: getters.getLastWatchedLessonId,
            },
          });
          dispatch('setNotification', {
            type: 'success',
            text: `${VueI18n.t('courses.successBought')}`,
          });
        }
      } catch (error) {
        commit('SET_MODAL', {
          state: true,
          name: `rejected-purchase`,
          props: {
            courseId: id,
            // serverError: error.response.data.error.course_id[0],
          },
        });
      }
    },

    async getProStudentSubscriptionInfo({ commit }) {
      try {
        const res = await getProStudentSubscriptionInfo();
        if (res.status === 200) {
          commit('changingStudentsSubscribes', res.data.data.subscriptions);
        }
        return { error: false };
      } catch (error) {
        return { error: true };
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async deleteProStudentSubscription({ dispatch }) {
      try {
        const res = await deleteProStudentSubscription();
        if (res.status === 200) {
          await dispatch('getProStudentSubscriptionInfo');
          await dispatch('setNotification', {
            type: 'success',
            text: `${VueI18n.t('main.smart_subscription_canceled')}`,
          });
          return { error: false };
        }
        // return res.data.data.subscriptions;
      } catch (error) {
        return { error: true };
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async updateProStudentSubscription({ commit, dispatch, getters }, data) {
      try {
        const res = await updateProStudentSubscription(data);
        if (res.status === 200) {
          await dispatch('getProStudentSubscriptionInfo');
          await dispatch('setNotification', {
            type: 'success',
            text: data.isExistSubscribes
              ? `${VueI18n.t('main.smart_subscription_updated')}`
              : `${VueI18n.t('main.smart_subscription_formalized')}`,
          });

          commit('SET_MODAL', { state: false });
        }
      } catch (error) {
        commit('SET_MODAL', {
          state: true,
          name: `rejected-subscription`,
          props: {
            serverError: error.response.data.error.categories[0],
          },
        });
      }
    },

    // Teacher

    async getProStudentsList({ commit }, data) {
      try {
        const res = await getProStudentsList(data);
        return res.data.data.students;
      } catch (error) {
        console.log(error);
      }
    },
    async getProTeacherLessonProgress({ commit }, data) {
      try {
        const res = await getProTeacherLessonProgress(data);
        if (res.status === 200) {
          commit('SET_TEACHER_LESSON_PROGRESS', res.data.data.lesson_progress);
          commit(
            'SET_LESSON_TEST_PROGRESS',
            res.data.data.lesson_progress.testProgress
          );
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },
    async getStudentsProCourseProgressList({ commit }, data) {
      try {
        const res = await getStudentsProCourseProgressList(data);
        commit('SET_LESSON_PROGRESS', res.data.data.lessons_and_tests_progress);
        // return res.data.data.lessons_and_tests_progress;
      } catch (error) {
        console.log(error);
      }
    },

    async getProLessonProgressData({ commit }, data) {
      try {
        const res = await getProLessonProgressData(data);
        if (res.status === 200) {
          commit('SET_LESSON_PROGRESS_DATA', res.data.data.lesson_progress);
        }
      } catch (error) {
        console.log(error.response.data);
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getStudentsProCourseProgress({ commit, getters }, id) {
      try {
        const res = await getStudentsProCourseProgress(id);
        if (res.status === 200) {
          commit('SET_MY_COURSE_PROGRESS', res.data.data.course_progress);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getProThreads({ commit, dispatch }, searchQuery) {
      try {
        const res = await getProThreads(searchQuery);
        // console.log('threads from server >>.', res.data.data.threads);
        commit('SET_USER_THREADS', res.data.data.threads);
        dispatch('getMyProUnreadMessages');
      } catch (error) {
        console.log(error);
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getMyProUnreadMessages({ commit }) {
      try {
        const res = await getMyProUnreadMessages();
        // console.log('getMyUnreadMessages from server >>.', res.data.data);
        commit('SET_MY_UNREAD_MESS', res.data.data.my_unread_count);
      } catch (error) {
        console.log(error);
        // error.handleGlobally && error.handleGlobally();
      }
    },
  },
};
