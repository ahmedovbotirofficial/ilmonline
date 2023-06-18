import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';
import { COURSES_MODES, DEFAULT_COURSES_MODE } from '@/types/constants';
import modules from './modules/index.js';
import VueI18n from '@/i18n';

import {
  login,
  singUp,
  singUpVerify,
  getExistEmail,
  resetPassword,
  resentResetPassword,
  getQuizCertificate,
  confirmResetPassword,
  singInFacebook,
  getCoursesFilters,
  getCoursesCategories,
  getCoursesList,
  addCourseReview,
  getCourseReviews,
  getPopularCoursesList,
  getStudentsList,
  getStudentsCourseProgressList,
  getNewsCategories,
  getNewsList,
  getNewsBySlug,
  getNewsSimilar,
  getPprofileData,
  deletePhoto,
  getSchoolStudentSubscriptionInfo,
  uploadPhoto,
  getBroadcastingChannelId,
  getConnectionToken,
  getParentConnectionStatus,
  sendSubmitParentControl,
  deleteStudentSubscription,
  updateStudentSubscription,
  startCourse,
  purchaseCourse,
  getQuizTestCategories,
  getQuizTestsList,
  getQuizTest,
  getQuizFilters,
  startQuizTest,
  passingQuizTest,
  getQuizTestResults,
  getQuizSubCategories,
  getQuizCategoriesBySubCategories,
  sendQuizTestResults,
  updateProfileInfo,
  changePasswrod,
  getMyCoursesList,
  sendFeedbackFormData,
  createWithdrawalRequest,
  getTeacherTestResults,
  getTeacherLessonProgress,
  getStudentsCourseProgress,
  getLessonProgressData,
  getImgByLocation,
  sendVerificationRegister
} from '@/api/services';
import { setToLS, getFromLS, isLSHasItem } from '@/library/helpers';
import { getNewsDigestList } from '../api/services';

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  state: {
    coursesMode: isLSHasItem('courses_mode') ? getFromLS('courses_mode') : null,
    isShowSelectModePage: false,

    role: isLSHasItem('role') ? getFromLS('role') : null,
    token: isLSHasItem('token') ? getFromLS('token') : null,

    user_id: isLSHasItem('user_id') ? getFromLS('user_id') : null,

    cards: isLSHasItem('cards') ? getFromLS('cards') : null,

    language: getFromLS('multi_lang') || 'uz-latn',

    userProfileData: null,

    userVideoData: null,

    seledtedProfileLink: isLSHasItem('seledtedProfileLink')
      ? getFromLS('seledtedProfileLink')
      : 'profile',

    coursesFilters: [],
    coursesList: [],
    coursesFilterStatus: false,
    coursesHeaderFilter: null,
    coursesPageCount: 1,
    currentCoursesPage: 1,
    // currentPageCourses: isLSHasItem('current-page')
    //   ? getFromLS('current-page')
    //   : 1,
    studentSubscriptions: [],
    subscriptions: [],
    teacherTestResults: [],
    teacherLessonProgress: null,
    currentCourseData: null,
    myCourseProgress: null,
    imgByRegion: null,
    userTestAnswersResult: null,
    lessonProgressData: [],

    textMessage: null,

    fingerprint: getFromLS('fingerprint') || null,
    quizCategories: [],
    quizSubCategories: [],
    quizFilters: [],
    quizTests: [],
    quizTest: [],
    quizTestPassingId: null,
    passingQuizTests: {
      studentResponses: null,
    },
    quizTimerStatus: false,
    resultQuizTests: [],
    lessonProgress: null,

    windowWidth: document.documentElement.clientWidth,
    windowHeight: document.documentElement.clientHeight,

    parentControlBotConnection: {
      application_submitted: false,
      is_parental_control_bot_connected: false,
    },

    currentBreadLabel: [],
    initialCourse: { initial: [] },
    // notification: { type: 'icon name', text: 'notification text' },
    notification: null,

    errors: {},
    idLesson: null,
    leavePageStatus: false,
    allCourses: false,
  },

  getters: {
    getErrors: (state) => state.errors,
    getLeavePageStatus: (state) => state.leavePageStatus,

    getCoursesMode: (state) => state.coursesMode,
    getCoursesModeDispatch: (state, getters) =>
      getters.getCoursesMode.charAt(0).toUpperCase() +
      getters.getCoursesMode.slice(1),
    getIsShowSelectModePage: (state) => state.isShowSelectModePage,
    gettterInitialCourse: (state) => state.initialCourse.initial,
    isAuthUser: (state) => !!state.token,
    getUserRole: (state) => state.role,
    getUserId: (state) => state.user_id,
    getIdLesson: (state) => state.idLesson,
    getUniqueUserID: (state) => state.fingerprint,

    getUserProfileData: (state) => state.userProfileData,

    getTextMessage: (state) => state.textMessage,
    // getChannelId: (state) => state.broadcastinig_channel_id,

    getCards: (state) => state.cards,

    getUserVideoData: (state) => state.userVideoData,

    getFiltersOfCourses: (state) => state.coursesFilters,
    getAllCoursesStatus: (state) => state.allCourses,
    getCoursesList: (state) => state.coursesList,
    getCoursesPageCount: (state) => state.coursesPageCount,
    getCurrentCoursesPage: (state) => state.currentCoursesPage,
    getCurrentCourse: (state) => state.currentCourseData,
    getUserTestAnswersResult: (state) => state.userTestAnswersResult,
    getCourseProgressData: (state) => state.myCourseProgress,
    getTeacherTestResults: (state) => state.teacherTestResults,
    getTeacherLessonProgress: (state) => state.teacherLessonProgress,

    getQuizCategories: (state) => state.quizCategories,
    getQuizSubCategories: (state) => state.quizSubCategories,
    getQuizTestsList: (state) => state.quizTests,
    getQuizFilters: (state) => state.quizFilters,
    getQuizTest: (state) => state.quizTest,
    getQuizTestPassingId: (state) => state.quizTestPassingId,
    getQuizTestResponse: (state) => state.passingQuizTests,
    getQuizTestResults: (state) => state.resultQuizTests,
    getQuizTimerStatus: (state) => state.quizTimerStatus,

    getSeparateLessonProgress: (state) => state.lessonProgressData,
    getSeledtedProfileLink: (state) => state.seledtedProfileLink,
    getSelectedLanguage: (state) => state.language,
    getLessonProgress: (state) => state.lessonProgress,
    getCoursesFilterStatus: (state) => state.coursesFilterStatus,
    getVacancyFilterStatus: (state) => state.vacancyFilterStatus,

    getHeaderCoursesFilter: (state) => state.coursesHeaderFilter,

    getStudentsSubscribes: (state) => state.studentSubscriptions,
    getImgByRegion: (state) => state.imgByRegion,

    getWindowWidth: (state) => state.windowWidth,
    getWindowHeight: (state) => state.windowHeight,

    getBotConnection: (state) => state.parentControlBotConnection,

    getCurrentBreadLabel: (state) => state.currentBreadLabel,

    // getStudentsSubscribesIds: (state) => state.subscriptions,

    // getCurrentPageCourses: (state) => state.currentPageCourses,

    getNotification: (state) => state.notification,
  },

  mutations: {
    SET_COURSES_MODE(state, mode) {
      state.coursesMode = mode;
      setToLS('courses_mode', mode);
    },
    SET_IS_SHOW_SELECT_MODE_PAGE(state, isShow) {
      state.isShowSelectModePage = isShow;
    },
    SET_LEAVE_PAGE_STATUS(state, options) {
      // console.log(options);
      state.leavePageStatus = options;
    },
    SET_QUIZ_TIMER_STATUS(state, options) {
      // console.log(options);
      state.quizTimerStatus = options;
    },

    SET_INITIAL_COURSE(state, options) {
      // console.log(options);
      state.initialCourse = options;
    },

    SET_CURR_BREAD_LABEL(state, options) {
      // console.log('SET_CURR_BREAD_LABEL >>>', options);
      state.currentBreadLabel = { ...state.currentBreadLabel, ...options };
    },

    SET_CURR_COURSE_DATA(state, options) {
      state.currentCourseData = options;
    },

    SET_COURSES_LIST(state, options) {
      // console.log('SET_COURSES_LIST <<<<', options);
      state.coursesList = options;
    },

    SET_CURRENT_COURSES_PAGE(state, options) {
      // console.log('SET_CURRENT_COURSES_PAGE <<<<', options);
      state.currentCoursesPage = options;
    },

    SET_COURSES_PAGE_COUNT(state, options) {
      // console.log('SET_COURSES_PAGE_COUNT <<<<', options);
      state.coursesPageCount = options;
    },

    SET_FILTERS_LIST(state, options) {
      state.coursesFilters = options;
    },

    SET_ALL_COURSES(state, options) {
      state.allCourses = options;
    },

    SET_FINGERPRINT(state, options) {
      state.fingerprint = options;
      setToLS('fingerprint', options);
    },
    setBotConnection(state, options) {
      // console.log('set bot connection >>>', options);
      state.parentControlBotConnection = options;
      setToLS('connection_status', options);
    },

    setWindowWidth(state, options) {
      // console.log(options);
      state.windowWidth = options;
    },

    setWindowHeight(state, options) {
      // console.log(options);
      state.windowHeight = options;
    },

    changeUserVideoData(state, options) {
      // console.log(options);
      state.userVideoData = options;
      setToLS('userVideoData', options);
    },

    SHOW_MESS(state, data) {
      state.textMessage = data;
    },

    SET_QUIZ_CATEGORIES(state, options) {
      // console.log('SET_QUIZ_CATEGORIES >>>', options);
      state.quizCategories = options;
    },

    SET_QUIZ_SUBCATEGORIES(state, options) {
      // console.log('SET_QUIZ_CATEGORIES >>>', options);
      state.quizSubCategories = options;
    },
    SET_LESSON_ID(state, option) {
      state.idLesson = option;
    },
    SET_QUIZ_TESTS(state, options) {
      // console.log('SET_QUIZ_CATEGORIES >>>', options);
      state.quizTests = options;
    },

    SET_QUIZ_TEST(state, options) {
      // console.log('SET_QUIZ_CATEGORIES >>>', options);
      state.quizTest = options;
    },

    SET_PASSING_QUIZ_TEST_ID(state, options) {
      // console.log('SET_QUIZ_CATEGORIES >>>', options);
      state.quizTestPassingId = options;
    },

    SET_MY_COURSE_PROGRESS(state, options) {
      // console.log('course progress setting', options);
      state.myCourseProgress = options;
    },
    SET_QUIZ_STUDENT_RESPONSES(state, options) {
      // console.log('SET_QUIZ_STUDENT_RESPONSES >>>', options);
      state.passingQuizTests = options;
    },

    SET_QUIZ_STUDENT_RESULT(state, options) {
      // console.log('SET_QUIZ_STUDENT_RESULT >>>', options);
      state.resultQuizTests = options;
    },

    SET_QUIZ_FILTERS(state, options) {
      // console.log('SET_QUIZ_STUDENT_RESULT >>>', options);
      state.quizFilters = options;
    },

    SET_CURR_TEACHER_TEST(state, options) {
      state.teacherTestResults = [...options];
    },
    SET_TEACHER_LESSON_PROGRESS(state, options) {
      state.teacherLessonProgress = options;
    },

    SET_LESSON_PROGRESS(state, payload) {
      state.lessonProgressData = [...payload];
    },

    SET_LESSON_PROGRESS_DATA(state, payload) {
      state.lessonProgress = payload;
    },

    SET_IMG_BY_LOCATION(state, payload) {
      state.imgByRegion = payload;
    },

    SET_ERRORS(state, payload) {
      state.errors = payload;
    },

    RESET_ERRORS(state) {
      state.errors = {};
    },

    RESET_FIELD_ERROR(state, fieldName) {
      state.errors[fieldName] = null;
    },

    addCards(state, card) {
      state.cards = card;
      setToLS('cards', card);
    },
    changingStudentsSubscribes(state, options) {
      state.studentSubscriptions = options;
    },

    selectProfileLink(state, id) {
      // console.log(id);
      state.seledtedProfileLink = id;
      setToLS('seledtedProfileLink', id);
    },
    selectLanguage(state, lang) {
      state.language = lang;
      setToLS('multi_lang', lang);
      // console.log(router.history.current.meta);
      Vue.nextTick(() => {
        document.title =
          `${VueI18n.t(`${router.history.current.meta.title}`)}` +
          ` | ${process.env.VUE_APP_TITLE}`;
      });
    },

    clearCheckboxes(state, status) {
      // console.log('mutation filter status', status);
      state.coursesFilterStatus = status;
    },
    setVacancyFilterStatus(state, status) {
      state.vacancyFilterStatus = status;
    },
    setHeaderCoursesFilter(state, filter) {
      // console.log('set header course filter', filter);
      state.coursesFilterStatus = true;
      state.coursesHeaderFilter = filter;
    },
    // selectCurrentPageCourses(state, page) {
    //   state.currentPageCourses = page;
    //   setToLS('current-page', page);
    // },
    SAVE_USER_TOKEN(state, token) {
      state.token = token;
      setToLS('token', token);
    },
    SAVE_USER(state, payload) {
      const { token, role, user } = payload;
      state.role = role;
      state.token = token;
      state.user_id = user.id;
      setToLS('token', token);
      setToLS('role', role);
      setToLS('user_id', user.id);
      // setToLS('fingerprint', null);
    },
    LOGOUT_USER(state) {
      state.role = null;
      state.token = null;
      state.user_id = null;
      for (let key in localStorage) {
        if (
          key !== 'multi_lang' &&
          key !== 'fingerprint' &&
          key !== 'courses_mode'
        ) {
          delete localStorage[key];
        }
      }
    },

    SET_NOTIFICATION(state, notification) {
      state.notification = notification;
    },

    CLEAR_NOTIFICATION(state) {
      state.notification = null;
    },

    SRT_USER_PROFILE_DATA(state, options) {
      state.userProfileData = options;
    },
  },

  actions: {
    // async getInitialCourse({ commit }, data) {
    //   try {
    //     commit('SET_INITIAL_COURSE', [
    //       { label: `${VueI18n.t('titles.main')}`, name: "first-page" },
    //       { label: "Уроки", name: "courses" },
    //     ]
    //     );
    //   } catch (e) { }
    // },

    async sentVerify({commit, dispatch}, data){
      let res; 
      try{
         res = sendVerificationRegister(data)

         console.log(res)
       }catch(e){
         console.log(e)
       }
    },

    async authorization({ commit, dispatch }, data) {
      let res;
      let serverErrors;
      try {
        res = await login(data);
        const { token, user } = res.data.data;
        if (token) {
          const role = user.role;
          commit('SAVE_USER', {
            token,
            role,
            user,
          });
          commit('RESET_ERRORS');

          dispatch('getConnectionToken');
          dispatch('getBroadcastingChannelId');
          dispatch('getPprofileData');
          
          router.push('/profile')

          
          return res;
        }
      } catch (error) {
        commit('SET_ERRORS', error.response.data.error);

        let serverErrors;
        serverErrors = {
          emailError: !!error.response.data.error.email,
        };
        return serverErrors;

        // error.handleGlobally && error.handleGlobally();
      }
    },
    setLessonId({ commit }, id) {
      commit('SET_LESSON_ID', id);
    },
    async registration({ commit }, data) {
      let res;
      try {
        res = await singUp(data);
        commit('RESET_ERRORS');
        return false;
      } catch (error) {
        commit('SET_ERRORS', error.response.data.error);

        // error.handleGlobally && error.handleGlobally();
      }
    },

    async singUpVerify({ commit }, data) {
      let res;
      try {
        res = await singUpVerify(data);
        return false;
      } catch (error) {
        let serverErrors;
        serverErrors = {
          emailError: !!error.response.data.error.email,
          confirmation_code: !!error.response.data.error.confirmation_code,
        };
        return serverErrors;
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getExistEmail({ commit }, data) {
      let res;
      try {
        res = await getExistEmail(data);
        return res.data.data;
      } catch (error) { }
    },

    async getSchoolLessonProgressData({ commit }, data) {
      try {
        const res = await getLessonProgressData(data);
        if (res.status === 200) {
          commit('SET_LESSON_PROGRESS_DATA', res.data.data.lesson_progress);
        }
      } catch (error) {
        // console.log(error.response.data);
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async resetPassword({ commit }, data) {
      let res;
      try {
        res = await resetPassword(data);
        return false;
      } catch (error) {
        let serverErrors;
        serverErrors = {
          emailError: !!error.response.data.error.email,
        };
        return serverErrors;
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async resentResetPassword({ commit }, data) {
      let res;
      try {
        res = await resentResetPassword(data);
        if (res.status === 200) {
          return res.data.message;
        }
      } catch (error) {
        // console.log(error);
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async confirmResetPassword({ commit }, data) {
      let res;
      try {
        res = await confirmResetPassword(data);
        return false;
      } catch (error) {
        let serverErrors;
        serverErrors = {
          token: !!error.response.data.error.token,
          password: !!error.response.data.error.password,
          password_confirmation:
            !!error.response.data.error.password_confirmation,
        };
        return serverErrors;
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getTestTeacherResults({ commit }, data) {
      try {
        // console.log(data);
        const res = await getTeacherTestResults(data);
        // console.log(res);
        if (res.status === 200) {
          commit('SET_CURR_TEACHER_TEST', res.data.data.test_progress);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getSchoolTeacherLessonProgress({ commit }, data) {
      try {
        const res = await getTeacherLessonProgress(data);
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

    async getAllSchoolCoursesFilters({ commit }) {
      try {
        const res = await getCoursesFilters();

        if (res.status === 200) {
          commit('SET_FILTERS_LIST', res.data.data.filters);

          // return res.data.data.filters;
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getSchoolCoursesCategories() {
      try {
        const res = await getCoursesCategories();
        return res.data.data.courses_categories;
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getAllSchoolCoursesList({ getters, commit, dispatch }, data) {
      if (getters.getAllCoursesStatus) {
        data = {
          page: 1,
          order_by: 'rating_desc',
        };
        commit('setHeaderCoursesFilter', null);
      }
      try {
        const res = await getCoursesList(data);

        // console.log(router.history.current.name);
        // console.log(getters.getCurrentCoursesPage);
        if (res.status === 200) {
          commit('SET_COURSES_LIST', res.data.data.courses);
          commit('SET_COURSES_PAGE_COUNT', res.data.data.courses.last_page);
          commit('SET_ALL_COURSES', false);
          if (getters.getCurrentCoursesPage > res.data.data.courses.last_page) {
            commit('SET_CURRENT_COURSES_PAGE', 1);
            dispatch('getAllSchoolCoursesList', {
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

    async getMySchoolCoursesList({ getters }, data) {
      try {
        const res = await getMyCoursesList(data);
        // console.log(res);
        return res.data.data.courses;
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async addSchoolCourseReview(
      { getters, commit, dispatch },
      { id, rating, text }
    ) {
      try {
        const res = await addCourseReview(id, rating, text);
        if (res.status === 200) {
          dispatch('setNotification', {
            type: 'success',
            text: `${VueI18n.t('courses.rate_thanks')}`,
          });
          dispatch('getCurrentSchoolCourseData', id);
        }
      } catch (error) {
        dispatch('setNotification', {
          type: 'error',
          text: error.response.data.error.author_id[0],
        });
      }
    },

    async getSchoolCourseReviews(_, { id, offset }) {
      try {
        const res = await getCourseReviews(id, offset);
        return res.data.data.reviews;
      } catch (error) {
        // console.log(error);
      }
    },

    async getPopularSchoolCoursesList() {
      try {
        const res = await getPopularCoursesList();
        // console.log(res);
        return res.data.data.courses;
      } catch (error) {
        return { error: true };
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getNewsCategories() {
      try {
        const res = await getNewsCategories();
        return res.data.data.categories;
      } catch (error) {
        return { error: true };
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getNewsDigestList({ commit }, data) {
      try {
        const res = await getNewsDigestList(data);
        return res.data.data;
      } catch (error) {
        return { error: true };
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getNewsList({ commit }, data) {
      try {
        const res = await getNewsList(data);
        return res.data.data;
      } catch (error) {
        return { error: true };
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getNewsBySlug({ commit }, data) {
      try {
        const res = await getNewsBySlug(data);
        return res.data.data.post;
      } catch (error) {
        return { error: true };
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getNewsSimilar({ commit }, data) {
      try {
        const res = await getNewsSimilar(data);
        return res.data.data.posts;
      } catch (error) {
        return { error: true };
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getPprofileData({ commit }, data) {
      try {
        const res = await getPprofileData(data);
        commit('SRT_USER_PROFILE_DATA', res.data.data.user);
        return res.data.data.user;
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getSchoolStudentsList({ commit }, data) {
      try {
        const res = await getStudentsList(data);
        return res.data.data.students;
      } catch (error) {
        // console.log(error);
      }
    },

    async getStudentsSchoolCourseProgressList({ commit }, data) {
      try {
        const res = await getStudentsCourseProgressList(data);
        commit('SET_LESSON_PROGRESS', res.data.data.lessons_and_tests_progress);
        // return res.data.data.lessons_and_tests_progress;
      } catch (error) {
        // console.log(error);
      }
    },

    async getStudentsSchoolCourseProgress({ commit, getters }, id) {
      try {
        const res = await getStudentsCourseProgress(id);
        if (res.status === 200) {
          // console.log('SET_MY_COURSE_PROGRESS', res.data.data.course_progress);
          commit('SET_MY_COURSE_PROGRESS', res.data.data.course_progress);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async purchaseSchoolCourse({ commit, dispatch, getters }, id) {
      try {
        const res = await purchaseCourse(id);
        if (res.status === 200) {
          dispatch(`getCurrentSchoolCourseData`, id);
          commit('SET_MODAL', { state: true, name: 'parent-control' });
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

    async getQuizTestCategories({ commit }) {
      try {
        const res = await getQuizTestCategories();
        if (res.status === 200) {
          commit('SET_QUIZ_CATEGORIES', res.data.data.categories);
        }
        // return res.data.data.categories;
      } catch (error) { }
    },

    async getQuizTestsList({ commit }, payload) {
      try {
        const res = await getQuizTestsList(payload);
        // console.log('getQuizTestsList', res);
        if (res.status === 200) {
          commit('SET_QUIZ_TESTS', res.data.data.tests);
        }
        // return res.data.data.categories;
      } catch (error) { }
    },

    async getQuizTest({ commit, dispatch }, payload) {
      try {
        const res = await getQuizTest(payload);
        // console.log('getQuizTest', res.data.data);
        if (res.status === 200) {
          commit('SET_QUIZ_TEST', res.data.data.test);
        }
        // return res.data.data.categories;
      } catch (error) {
        // console.log(error.response);
      }
    },

    async getQuizCertificate({ commit, dispatch }, payload) {
      try {
        const res = await getQuizCertificate(payload);
        if (res.status === 200) {
          return res;
        }
      } catch (error) {
        // console.log(error);
      }
    },

    async getQuizFilters({ commit }) {
      try {
        const res = await getQuizFilters();
        if (res.status === 200) {
          commit('SET_QUIZ_FILTERS', res.data.data.filters);
        }
        // return res.data.data.categories;
      } catch (error) {
        // console.log(error.response);
      }
    },

    async startQuizTest({ commit }, data) {
      // console.log('store curr test info', data);
      try {
        const res = await startQuizTest(data);
        if (res.status === 200) {
          commit('SET_QUIZ_STUDENT_RESPONSES', res.data.data.test);
        }
        // console.log('response startQuizTest', res.data.data);
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async passingQuizTest({ commit }, data) {
      // console.log('store curr test info', data);
      try {
        const res = await passingQuizTest(data);
        if (res.status === 200) {
          commit('SET_QUIZ_STUDENT_RESPONSES', res.data.data.test);
        }
        // console.log('response passingQuizTest', res.data.data);
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getQuizTestResults({ commit }, data) {
      // console.log('store curr test info', data);
      try {
        const res = await getQuizTestResults(data);
        // console.log('getQuizTestResults', res.data.data);

        if (res.status === 200) {
          commit('SET_QUIZ_STUDENT_RESULT', res.data.data.test);
          commit('SET_QUIZ_STUDENT_RESPONSES', res.data.data.test);
        }
        // console.log('response getQuizTestResults', res.data.data);
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getQuizSubCategories({ commit }) {
      try {
        const res = await getQuizSubCategories();
        if (res.status === 200) {
          commit('SET_QUIZ_SUBCATEGORIES', res.data.data.subcategories);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getQuizCategoriesBySubCategories({ commit }, data) {
      try {
        const res = await getQuizCategoriesBySubCategories(data);
        if (res.status === 200) {
          commit('SET_QUIZ_CATEGORIES', res.data.data.categories);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async sendFeedbackForm({ commit, dispatch }, data) {
      try {
        const res = await sendFeedbackFormData(data);
        if (res.status === 200) {
          dispatch('setNotification', {
            type: 'success',
            text: `${VueI18n.t('profilePage.success_feedback')}`,
          });
        }
      } catch (error) {
        commit('SHOW_MESS', 'Ошибка');
      }
    },

    async createWithdrawalRequest({ commit, dispatch }, data) {
      try {
        const res = await createWithdrawalRequest(data);
        // console.log(res);
        if (res.status === 200) {
          dispatch('setNotification', {
            type: 'success',
            text: `${VueI18n.t('profilePage.success_withdrawal')}`,
          });
          router.push({ name: 'payment' });
        }
      } catch (error) {
        // console.log(error.response.data.error.amount[0]);
        dispatch('setNotification', {
          type: 'success',
          text: `${error.response.data.error.amount[0]}`,
        });
      }
    },

    async sendQuizTestResults({ commit }, data) {
      // console.log(data);
      try {
        const res = await sendQuizTestResults(data);
        if (res.status === 200) {
          // console.log('response send results', res.data);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getImgByLocation({ commit }, data) {
      try {
        const res = await getImgByLocation(data);
        if (res.data.data.length === 0) {
          commit(
            'SET_IMG_BY_LOCATION',
            'https://api.ilm.devbazu.com/storage/1922/4b328fd6737971f0e0380b823ebcbea5.png'
          );
        } else {
          commit('SET_IMG_BY_LOCATION', res.data.data.region.image);
        }
      } catch (error) {
        return error.response.data.error;
      }
    },

    async startCourse({ commit }, data) {
      // console.log(data);
      try {
        const res = await startCourse(data);
        // console.log('response start course >>>', res.data.data);
        return res.data.data;
      } catch (error) {
        return error.response.data.error;
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getSchoolStudentSubscriptionInfo({ commit }) {
      try {
        const res = await getSchoolStudentSubscriptionInfo();
        if (res.status === 200) {
          commit('changingStudentsSubscribes', res.data.data.subscriptions);
        }
        return { error: false };
      } catch (error) {
        return { error: true };
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async deleteSchoolStudentSubscription({ dispatch }) {
      try {
        const res = await deleteStudentSubscription();
        if (res.status === 200) {
          await dispatch('getSchoolStudentSubscriptionInfo');
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

    async updateSchoolStudentSubscription({ commit, dispatch, getters }, data) {
      try {
        const res = await updateStudentSubscription(data);
        if (res.status === 200) {
          await dispatch('getSchoolStudentSubscriptionInfo');
          await dispatch('getParentConnectionStatus');
          await dispatch('setNotification', {
            type: 'success',
            text: data.isExistSubscribes
              ? `${VueI18n.t('main.smart_subscription_updated')}`
              : `${VueI18n.t('main.smart_subscription_formalized')}`,
          });
          if (!getters.getBotConnection.application_submitted) {
            commit('SET_MODAL', { state: true, name: 'parent-control' });
          } else {
            commit('SET_MODAL', { state: false });
          }
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

    async getParentConnectionStatus({ getters, commit }) {
      try {
        if (getters.getUserRole === 'student') {
          const res = await getParentConnectionStatus();
          if (res.status === 200) {
            commit('setBotConnection', res.data.data);
          }
        }
      } catch (error) {
        // console.log(error.response);
      }
    },

    async getConnectionToken({ getters, dispatch }) {
      try {
        const res = await getConnectionToken();
        setToLS('connection_token', res.data.data.connection_token);
        await dispatch('getParentConnectionStatus');
        // return res.data.data.connection_token;
      } catch (error) {
        // console.log(error.response);
      }
    },

    async sendSubmitParentControl({ commit }, data) {
      try {
        const res = await sendSubmitParentControl(data);
        return res.data;
      } catch (error) {
        // console.log(error.response);
      }
    },

    async getBroadcastingChannelId() {
      try {
        const res = await getBroadcastingChannelId();
        setToLS(
          'broadcasting_channel_id',
          res.data.data.broadcasting_channel_id
        );
      } catch (error) {
        // console.log();
      }
    },

    async forgotPassword({ commit }, data) {
      let res;
      try {
        commit('SET_MODAL', { state: true, name: 'forgot-password' });

        // res = await resetPass(data);
        // if (res.status === 200) {
        //   commit('SET_MODAL', { state: true, name: 'reset-password' });
        // }
      } catch (error) {
        // console.log('>>> error forgotPassword', error.response.data);
      }
    },

    async uploadPhoto({ dispatch }, data) {
      // console.log(data);
      try {
        const res = await uploadPhoto(data);
        dispatch('setNotification', {
          type: 'success',
          text: `${VueI18n.t('profilePage.success_changes')}`,
        });
        // dispatch('getPprofileData');
        return res.data.data.user.profile_photo;
      } catch (error) {
        // console.log(error.response.data);
        // error.handleGlobally && error.handleGlobally();
      }
    },
    async deletePhoto({ getters, dispatch }) {
      try {
        const res = await deletePhoto();
        // dispatch('getPprofileData');
        // console.log('getPprofilePhoto', getters.getCoursesMode);
        let mode = COURSES_MODES.SCHOOL;
        if (getters.getCoursesMode === COURSES_MODES.PRO) {
          mode = COURSES_MODES.PRO;
        }
        return res.data.data.user.non_avatars[mode];
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async updateProfileInfo({ dispatch }, data) {
      // console.log(data);
      try {
        const res = await updateProfileInfo(data);
        if (res.status === 200) {
          dispatch('getPprofileData');
          dispatch('setNotification', {
            type: 'success',
            text: `${VueI18n.t('profilePage.success_changes')}`,
          });
        }
        return res.data.data.user;
      } catch (error) {
        // console.log(error.response.data);
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async changePasswrod({ dispatch, commit }, data) {
      // console.log(data);
      try {
        const res = await changePasswrod(data);
        if (res.status === 200) {
          dispatch('setNotification', {
            type: 'success',
            text: `${VueI18n.t('profilePage.success_changes')}`,
          });
        }
        return res;
      } catch (error) {
        commit('SET_ERRORS', error.response.data.error);
        // console.log(error.response.data);
        // error.handleGlobally && error.handleGlobally();
      }
    },

    userLogout({ commit, dispatch }) {
      try {
        commit('LOGOUT_USER');
        dispatch('setNotification', {
          type: 'success',
          text: `${VueI18n.t('profilePage.success_logout')}`,
        });
        router.push({ name: 'first-page' });
      } catch (error) {
        error.handleGlobally && error.handleGlobally();
      }
    },

    setNotification({ commit, getters }, notification) {
      commit('SET_NOTIFICATION', notification);
      setTimeout(() => {
        if (getters.getNotification) {
          commit('CLEAR_NOTIFICATION');
        }
      }, 5000);
    },
  },
});
