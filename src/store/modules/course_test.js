import {
  getLessonTestRightResponses,
  getLessonTest,
  passingTest,
  endPassingTest,
  deleteLessonTest,
} from '@/api/services';
import router from '@/router';
import { setToLS, getFromLS, isLSHasItem } from '@/library/helpers';

export default {
  state: {
    lessonTest: null,
    endedLessonTest: false,
    lessonTestProgress: null,
    rightLessonTestAnswers: null,
  },
  getters: {
    getLessonTest: (state) => state.lessonTest,
    getEndedLessonTestStatus: (state) => state.endedLessonTest,
    getRightLessonTestAnswers: (state) => state.rightLessonTestAnswers,
    getLessonTestProgress: (state) => state.lessonTestProgress,
  },
  mutations: {
    SET_LESSON_TEST(state, options) {
      // console.log('SET_LESSON_TEST <<<<', options);
      state.lessonTest = options;
    },

    SET_ENDED_LESSON_TEST(state, options) {
      state.endedLessonTest = options;
    },
    SET_RIGHT_LESSON_TEST_ANSWERS(state, options) {
      // console.log('SET_RIGHT_LESSON_TEST_ANSWERS >>>', options);
      state.rightLessonTestAnswers = options;
    },

    SET_LESSON_TEST_PROGRESS(state, options) {
      // console.log('SET_RIGHT_LESSON_TEST_ANSWERS >>>', options);
      state.lessonTestProgress = options;
    },
  },
  actions: {
    async getSchoolLessonTest({ commit }, data) {
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

    async passingSchoolTest({ commit }, data) {
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

    async endCourseTest({ commit }, data) {
      console.log('store curr test info', data);
      try {
        const res = await endPassingTest(data);
        if (res.status === 200) {
          commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async deleteSchoolLessonTest({ commit, dispatch }, data) {
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

    async getSchoolLessonTestRightResponses({ commit }, data) {
      try {
        const res = await getLessonTestRightResponses(data);
        if (res.status === 200) {
          commit('SET_RIGHT_LESSON_TEST_ANSWERS', res.data.data.answers);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },
  },
};
