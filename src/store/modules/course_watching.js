import {
  getCurrentCoursePreview,
  getCurrentCourseData,
  getMyCourseProgress,
  startLesson,
  setVideoSecond,
} from '@/api/services';
import router from '@/router';
import { setToLS, getFromLS, isLSHasItem } from '@/library/helpers';

export default {
  state: {
    currentCourseData: null,
    currentCoursePreview: null,
    myCourseProgress: null,
    currentTest: null,

    lastWatchedLesson: isLSHasItem('last_watched_lesson_id')
      ? getFromLS('last_watched_lesson_id')
      : null,
  },
  getters: {
    getCurrentCoursePreview: (state) => state.currentCoursePreview,
    getCurrentCourseData: (state) => state.currentCourseData,
    getLastWatchedLessonId: (state) => state.lastWatchedLesson,
    getMyProgressOfCourse: (state) => state.myCourseProgress,
  },
  mutations: {
    SET_CURR_COURSE_DATA(state, options) {
      state.currentCoursePreview = options;
      state.currentCourseData = options;
      state.currentCoursePreview = options;
    },
    SET_LAST_WATCHED_LESSON(state, options) {
      state.lastWatchedLesson = options;
      setToLS('last_watched_lesson_id', options);
    },
    SET_MY_COURSE_PROGRESS(state, options) {
      // console.log('course progress setting', options);
      state.myCourseProgress = options;
    },
  },
  actions: {
    async getCurrentSchoolCourseData({ getters, commit }, id) {
      try {
        const res = await getCurrentCourseData(id);
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
        // console.log('SET_CURR_COURSE_DATA Error <<<', error.response);
        return error.response.data.error.id;
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getCurrentSchoolCoursePreview({ getters, commit }, id) {
      commit('SET_CURR_COURSE_DATA', null);
      try {
        const res = await getCurrentCoursePreview(id);
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
        // console.log('getCurrentCoursePreview Error <<<', error.response);
        return error.response.data.error.id;
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getMySchoolCourseProgress({ commit }, data) {
      try {
        const res = await getMyCourseProgress(data);
        // console.log('response startLesson', res);
        if (res.status === 200) {
          // console.log('courseProgress <<<', res.data.data.courseProgress);
          commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
        }
      } catch (error) {
        // console.log(error.response.data.error);
        return error.response.data.error;
      }
    },

    async startSchoolLesson({ commit, dispatch }, data) {
      try {
        const res = await startLesson(data);
        // console.log('response startLesson', res);
        if (res.status === 200) {
          // console.log('start less courseProgress <<<< ', res.data.data.courseProgress);
          // commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
          dispatch('getMySchoolCourseProgress', data.course_id);
          dispatch('getCurrentSchoolCourseData', data.course_id);
        }
      } catch (error) {
        // console.log(error.response.data.error);
        return error.response.data.error;
      }
    },

    async setSchoolVideoSecond({ commit }, data) {
      try {
        const res = await setVideoSecond(data);
        if (res.status === 200) {
          commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
        }
      } catch (error) {
        // console.log(
        //   'Set video second >>>>',
        //   error.response.data.error.lesson_id
        // );
        // error.handleGlobally && error.handleGlobally();
      }
    },
  },
};
